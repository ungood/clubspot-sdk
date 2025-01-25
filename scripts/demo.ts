import Parse from "parse/node.js";
import { Camps, Golf_Schedules, Clubspot } from '../src/index.js'
import * as dotenv from "dotenv"



async function main(): Promise<void> {

/*****
 ARG:  Prefer to load environment varibles from a .env file. rather than the system.
 Note: the .env file should be added to .gitignore and never committed.
 ./scripts holds encrypt/decript scripts to pass encrypted .env through version control if desired.
 *****/
  dotenv.config({ path: '../.env' });  // make sure there is a .env file in config

  const email = process.env.CLUBSPOT_EMAIL;
  const password = process.env.CLUBSPOT_PASSWORD;

  const clubspot = new Clubspot();
  const user = await clubspot.login(email, password);
  console.log(`Logged in as ${user.getUsername()}`);

  console.log("Clubs:")
  const userClubs = await clubspot.findClubsForUser(user);

  /*
  ARG:
  In JavaScript, the Array.prototype.forEach method does not return a Promise or support async/await behavior directly.
  If you're working with asynchronous operations inside a forEach loop, those operations will execute but not in a
  way that await can handle.

  I modified the old "const camps = await new Parse.Query(Camps)" with a for...of, which works with await

 HERE IS THE OLD CODE, THE NEW CODE IS BELOW THE COMMENTED OUT SECTION

  await userClubs.forEach(async userClub => {
    const club = userClub.get("clubObject");
    var isAdmin = userClub?.get("admin") ?? false;

    console.log(club.get("name"));
    console.log(typeof(isAdmin), isAdmin, `${isAdmin}`);
    console.log(`- Admin: ${isAdmin}`);
    console.log(`- Manager: ${userClub.get("manager")}`);
    console.log(`- Permissions: ${userClub.get("permissions")}`);

    if (isAdmin) {
      // Camps
      console.log("- Camps:");

      const camps = await new Parse.Query(Camps)
        .equalTo("archived", false)
        .equalTo("clubObject", club)
        .limit(10)
        .find();

      camps.forEach(camp => {
        console.log(`  - ${camp.get("name")}`);
      })

      // Golf
      console.log("- Golf:");

      const golf = await new Parse.Query(Golf)
        .equalTo("archived", false)
        .equalTo("clubObject", club)
        .limit(10)
        .find();

      golf.forEach(golf => {
        console.log(`  - ${golf.get("name")}`);
      })
    }
  })

*/
  for (const userClub of userClubs) {
    const club = userClub.get('clubObject');
    var isAdmin = userClub?.get('admin') ?? false;  // this ensured isAdmin is not undefined

    console.log(club.get("name"));
    console.log(`- Admin:  ${isAdmin}`);
    console.log(`- Manager: ${userClub.get("manager")}`);
    console.log(`- Permissions: ${userClub.get("permissions")}`);


    if (isAdmin) {
      // Camps
      console.log("- Camps:");

      const camps = await new Parse.Query(Camps)
        .equalTo("archived", false)
        .equalTo("clubObject", club)
        .limit(10)
        .find();

      console.log(camps);

      camps.forEach(camp => {
        console.log(`  - ${camp.get("name")}`);
      });

      // Golf
      console.log("- Golf_Schedules:");

      const golf_schedules = await new Parse.Query(Golf_Schedules)
        .equalTo("archived", false)
        .equalTo("clubObject", club)
        .limit(10)
        .find();

      console.log(golf_schedules);

      golf_schedules.forEach(golf_schedule => {
        console.log(`  - ${golf_schedule.get("name")}`);
      });
    }
  }
};

main().catch(console.error);
