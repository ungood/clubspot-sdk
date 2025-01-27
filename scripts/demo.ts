import Parse from "parse/node.js";
import { Camp, Clubspot } from '../src/index.js'

const email = process.env.CLUBSPOT_EMAIL!;
const password = process.env.CLUBSPOT_PASSWORD!;

async function main(): Promise<void> {
  const clubspot = new Clubspot();
  const user = await clubspot.login(email, password);
  console.log(`Logged in as ${user.getUsername()}`);

  console.log("Clubs:")
  const userClubs = await clubspot.findClubsForUser(user);
  for (const userClub of userClubs) {
    const club = userClub.get("clubObject");

    console.log(`${club.get("name")} - ${club.id}`);
    console.log(`- Admin: ${userClub.admin}`);
    console.log(`- Manager: ${userClub.manager}`);
    console.log(`- Permissions: ${userClub.permissions}`);

    if (userClub.admin) {
      console.log("- Camps:");

      const camps = await new Parse.Query(Camp)
        .equalTo("archived", false)
        .equalTo("clubObject", club)
        .include("event_tags")
        .limit(10)
        .find();

      for (const camp of camps) {
        console.log(`  - ${camp.name} - ${camp.startDate}`);
        camp.toJSON()
      }
    }
  }
}

main().catch(console.error);
