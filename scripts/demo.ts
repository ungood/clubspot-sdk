import Parse from "parse/node.js";
import { Camps, Clubspot } from '../src/index.js'

const email = process.env.CLUBSPOT_EMAIL;
const password = process.env.CLUBSPOT_PASSWORD;

async function main(): Promise<void> {
    const clubspot = new Clubspot();
    const user = await clubspot.login(email, password);
    console.log(`Logged in as ${user.getUsername()}`);

  console.log("Clubs:")
  const userClubs = await clubspot.findClubsForUser(user);
  await userClubs.forEach(async userClub => {
    const club = userClub.get("clubObject");
    const isAdmin = userClub.get("admin");

    console.log(club.get("name"));
    console.log(`- Admin: ${isAdmin}`);
    console.log(`- Manager: ${userClub.get("manager")}`);
    console.log(`- Permissions: ${userClub.get("permissions")}`);

    if (isAdmin) {
      console.log("- Camps:");

      const camps = await new Parse.Query(Camps)
        .equalTo("archived", false)
        .equalTo("clubObject", club)
        .limit(10)
        .find();

      camps.forEach(camp => {
        console.log(`  - ${camp.get("name")}`);
      })
    }
  });
}

main().catch(console.error);
