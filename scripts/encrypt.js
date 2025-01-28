/*-------------- Encrypts "in_file" using "password" ------------------*/
const readline = require('node:readline')

function validateArgs(args) {
	if (args.length !== 2) {
		console.log("Error: expecting filename and password.");
		return false;
	}
	if (!((typeof args[0] === "string") || (typeof args[0] === "string"))) {
		console.log("Error: Both arguments must be words.");
		return false;
	}
	return true;
}

function promptUserForArgs() {
	const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
    });
	
	rl.question("FileName: ", (firstArg) => {
		rl.question("Password (blank for none): ", (secondArg) => {
			const args = [firstArg, secondArg];
		
		if (validateArgs(args)) {
			console.log(`You got it Baby! ${args.join(", ")}`);
		} else {
			console.log("Invalid input. Please try again.");
			}
		rl.close();
		});
	});
}	


function main() {	
	const args = process.argv.slice(2);

	
	// Validate or prompt for the input arguments
	if (!validateArgs(args)) {
		console.log("Let me help you with that:")
		promptUserForArgs();
	}
	else {
		console.log("You got it Baby!");
	}
	
	//got good input args, now encrypt the file
	const crypto = require('crypto');
	const fs = require('fs');
	
	// Configuration
	const algorithm = 'aes-256-cbc';
	const key = crypto.createHash('sha256').update(String(process.env.SECRET_KEY || args[1])).digest('base64').substr(0, 32);
	const iv = crypto.randomBytes(16);
	
	// Encryption function
	const data = fs.readFileSync(args[0], 'utf8')
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
	
    const encryptedData = JSON.stringify({
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
	});

	fs.writeFileSync((args[0]+".enc"), encryptedData, 'utf8');
	console.log(`File encrypted successfully: ${(args[0]+".enc")}`)

}
		
main();
		
		
	
