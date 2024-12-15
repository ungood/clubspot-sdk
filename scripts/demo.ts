//import Parse from "parse/node.js";
import { Clubspot } from '../src/index.js'

const email = process.env.CLUBSPOT_EMAIL;
const password = process.env.CLUBSPOT_PASSWORD;

async function main(): Promise<void> {
    const clubspot = new Clubspot();
    const user = await clubspot.login(email, password);
    console.log(`Logged in as ${user.getUsername()}`);
}

main().catch(console.error);