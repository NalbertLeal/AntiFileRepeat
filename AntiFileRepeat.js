const fs = require("fs");
const crypto = require("crypto");

class AntiFileRepeat {
	constructor(pathStart) {
		this.pathStart = pathStart;
		this.nextPaths = [ pathStart ];
		this.knownFilesPaths = [];
		this.knownHashs = {};
	}

	readAllPaths() {
		while(this.nextPaths.length > 0) {
			let actualPath = this.nextPaths[0];
			this.nextPaths = this.nextPaths.splice(1, this.nextPaths.lengthh);
			// try to read the actual pathStart content
			try {
				let files = fs.readdirSync(actualPath);
				if(!files) {			    	
				   		console.log("Problem while reading the path " + actualPath);
				}
				else {
				  	for(let index = 0; index < files.length; index++) {
				   		// now try to see if is directory or file
				   		try {
				   			if( fs.lstatSync( actualPath + "\\" + files[index] ).isDirectory() ) {
				   				this.nextPaths.push( actualPath + "\\" + files[index] );
				   			}
				   			else {
				   				this.knownFilesPaths.push( actualPath + "\\" + files[index] );
				   			}
				   		}
				   		catch(e) {
				   			console.log("Problem while trying to test if " + actualPath + "\\" + files[index] + " is a directory of a file.");
				   		}
				   	}
				}
			}
			catch(e) {
				console.log("Problem while reading the path " + actualPath);
			}
		}
	}

	readAndDeleteAllPaths() {
		while(this.nextPaths.length > 0) {
			let actualPath = this.nextPaths[0];
			this.nextPaths = this.nextPaths.splice(1, this.nextPaths.lengthh);
			// try to read the actual pathStart content
			try {
				let files = fs.readdirSync(actualPath);
				if (!files) {			    	
					console.log("Problem while reading the path " + actualPath);
				}
				else {
					for(let index = 0; index < files.length; index++) {
				  		// now try to see if is directory or file
				   		try {
				   			if( fs.lstatSync( actualPath + "\\" + files[index] ).isDirectory() ) {
				   				this.nextPaths.push( actualPath + files[index] );
				   			}
				   			else {
				   				this.knownFilesPaths.push( actualPath + "\\" + files[index] );

			    				let contents = fs.readFileSync(actualPath + "\\" + files[index], 'utf8');
			    				let ok = this.generateFileHash(contents);

								if(!ok) {
								    fs.unlink(actualPath + "\\" + files[index], (err) => {
									    if(err) {
									      	console.log("Problem while deleting the file " + actualPath + "\\" + files[index]);
								    	}
										console.log("file " + actualPath + "\\" + files[index] + " deleted successfully");
									});
								}
			    			}
			    		}
			    		catch(err) {
			    			console.log("Problem while trying to test if " + actualPath + "\\" + files[index] + " is a directory of a file.");
			    		}
			    	}
			    }
			}
			catch(err) {
				console.log("Problem while reading the path " + actualPath);
			}
		}
	}

	deleteAllRepeat() {
		console.log(this.knownFilesPaths.length);
		for(let index = 0; index < this.knownFilesPaths.length; index++) {

			let contents = fs.readFileSync(this.knownFilesPaths[index], 'utf8');
			let ok = this.generateFileHash(contents);

			if(!ok) {
				fs.unlink(this.knownFilesPaths[index], (err) => {
					if(err) {
						console.log("Problem while deleting the file " + this.knownFilesPaths[index]);
					}
					console.log("file " + this.knownFilesPaths[index] + " deleted successfully");
				});
			}
		}
	}

	generateFileHash(fileContent) {
		let sha = crypto.createHash('sha256');
		sha.update(fileContent); 

		let result = sha.digest();
		if(this.knownHashs[ result ]) {
			return false; // alread exist
		}
		else{ 
			this.knownHashs[ result ] = true;
			return true; // don't exits
		}
	}
}

module.exports = AntiFileRepeat;