import { Clubspot } from '../src/index.js'
import { retrieveGolfAvailability } from "../src/functions.js";

const email = process.env.CLUBSPOT_EMAIL!;
const password = process.env.CLUBSPOT_PASSWORD!;

async function main(): Promise<void> {
  const clubspot = new Clubspot();
  const user = await clubspot.login(email, password);
  console.log(`Logged in as ${user.getUsername()}`);

  const availability = await retrieveGolfAvailability({
    clubId: "7D66rAJH5A", // CYC Seattle
    courseIds: ["FQGzpoln7R"], // The demo course id
    date: new Date(2025, 1, 27)
  });

  console.log(availability);
}

main().catch(console.error);
