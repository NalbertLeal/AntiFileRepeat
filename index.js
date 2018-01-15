const AntiFileRepeat = require("./AntiFileRepeat.js");

let afr = new AntiFileRepeat( process.cwd() );
afr.readAndDeleteAllPaths();