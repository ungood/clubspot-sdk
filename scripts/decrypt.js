/*-------------- Decrypt "in_file" using "password" ------------------*/
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
		console.log("Let me help you with that:");
		promptUserForArgs();
	}
	else {
		console.log("You got it Baby!");
	}
	
	//got the input args, now decrypt the file
	const crypto = require('crypto');
	const fs = require('fs');

	// Configuration
	const algorithm = 'aes-256-cbc';
	const key = crypto.createHash('sha256').update(String(process.env.SECRET_KEY || args[1])).digest('base64').substr(0, 32);			

	// Decrypt function
	const encryptedData = JSON.parse(fs.readFileSync(args[0], 'utf8'));
	const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encryptedData.iv, 'hex'));
	
	// the decryption with some error checking
	let decrypted;
	try {
			decrypted = Buffer.concat([
				decipher.update(Buffer.from(encryptedData.content, 'hex')),
				decipher.final(),
		]);		
	}catch (error){
		console.error("Error: Either the password was incorrect or this was the wrong input file:", error);
		return;
	}
	
		
	fs.writeFileSync((args[0]+".dec"), decrypted, 'utf8');
	console.log(`File encrypted successfully: ${(args[0]+".dec")}`)

}
main()
	