#!/usr/bin/env -S npx tsx

import buildProgram from '../src/program.js';
import buildClubCommand from '../src/club.js';
import buildCampCommand from '../src/camp.js';

const program = buildProgram();
buildClubCommand(program);
buildCampCommand(program);

await program.parseAsync();
