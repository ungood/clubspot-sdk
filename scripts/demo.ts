import Parse from "parse/node.js";
import { Camp, Shift, Clubspot } from '../src/index.js'
import * as dotenv from "dotenv"



async function main(): Promise<void> {

  /*****
   ARG:  Prefer to load environment varibles from a .env file. rather than the system.
  Note: the .env file should be added to .gitignore and never committed.
  ./scripts holds encrypt/decript scripts to pass encrypted .env through version control if desired.
  *****/
  dotenv.config({ path: '../.env' });  // make sure there is a .env file in config

  const email = process.env.CLUBSPOT_EMAIL!;
  const password = process.env.CLUBSPOT_PASSWORD!;

  const clubspot = new Clubspot();
  const user = await clubspot.login(email, password);
  console.log(`Logged in as ${user.getUsername()}`);

  console.log("Clubs:")
  const userClubs = await clubspot.findClubsForUser(user);

  for (const userClub of userClubs) {
    const club = userClub.get('clubObject');
    var isAdmin = userClub?.get('admin') ?? false;  // this ensured isAdmin is not undefined

    console.log(club.get("name"));
    console.log(`- Club Id: ${userClub.id}`)
    console.log(`- Admin:  ${isAdmin}`);
    console.log(`- Manager: ${userClub.get("manager")}`);
    console.log(`- Permissions: ${userClub.get("permissions")}`);


    if (isAdmin) {
      // Camps
      console.log("- Camps:");

      const camps = await new Parse.Query(Camp)
        .equalTo("archived", false)
        .equalTo("clubObject", club)
        .limit(10)
        .find();

      camps.forEach(camp => {
        console.log(`  - ${camp.get("name")}`);
      });

      // Golf
      console.log("- Shifts:");

      const shifts = await new Parse.Query(Shift)
        .equalTo("archived", false)
        .equalTo("clubObject", club)
        .limit(10)
        .find();

      shifts.forEach(shift => {
        console.log(`  - ${shift.get("name")}, ${shift.get("type")}`);
      });
    }
  }
}

main().catch(console.error);
