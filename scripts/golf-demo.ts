import { Clubspot, Courses } from '../src/index.js'
import Parse from "parse/node.js";
import { retrieveGolfAvailability } from "../src/functions.js";
import * as dotenv from "dotenv"

dotenv.config({ path: '../.env' });  // make sure there is a .env file in config

const email = process.env.CLUBSPOT_EMAIL!;
const password = process.env.CLUBSPOT_PASSWORD!;

async function main(): Promise<void> {
  dotenv.config({ path: '../.env' });  // make sure there is a .env file in config

  const clubspot = new Clubspot();
  const user = await clubspot.login(email, password);
  console.log(`Logged in as ${user.getUsername()}`);

  console.log("Clubs:")
  const userClubs = await clubspot.findClubsForUser(user);

  for (const userClub of userClubs) {
    const club = userClub.get('clubObject');
    var isAdmin = userClub?.get('admin') ?? false;  // this ensured isAdmin is not undefined
    const clubId = club.id;
    console.log(club.get("name"));
    console.log(`ClubId: ${clubId}`);
    console.log(`- Admin:  ${isAdmin}`);

    if (isAdmin) {
      const date = new Date("Jan-27-2025");    // hardcoded to the example tee times

      // get the courses for this club
      try {
        // Query Courses
        const query = new Parse.Query("courses")
        query.equalTo('clubObject', club)
        query.equalTo('archived', false);
        query.ascending('priority');

        const retrievedCourses = await query.find();
        if (retrievedCourses.length === 0) {
          throw new Error("Missing Course")
        }
        const courseIds = retrievedCourses.map(course => course.id)
        console.log(`- Course ID: ${courseIds}`);

        var params = {}


        params["party_size"] = 1;
        params["day"] = date.getDay();
        params["date_string"] = `Jan-27-2025`//date.toDateString();
        params["club_id"] = clubId;
        params["course_ids"] = courseIds;
        params["include_billing"] = true;
        const availability = await Parse.Cloud.run('retrieve_golf_availability', params);
        const participantsArray = availability[0].options[0].booked_by[0].attributes.participantsArray;
        for (const participant of participantsArray) {
          console.log(`- golfer ${participant.attributes.firstName} ${participant.attributes.lastName}`);
        }




      } catch (error){
        console.error(error);
        throw error;
      }


    }

  }

}

main().catch(console.error);
