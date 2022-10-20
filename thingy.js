var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const fs = require('fs')

var urlencodedParser = bodyParser.urlencoded({ extended: false});

// Set EJS View Engine**
app.set('view engine','ejs');
// Set HTML engine**
app.engine('html', require('ejs').renderFile);
//set directory
app.set('views', __dirname + '/views');
//static folder
app.use(express.static('staticfolder'));

function startsWithNumber(str) {
  return /^\d/.test(str);
}

function isNumeric(num){
	return !isNaN(num)
}

app.get('/', function(req, res) {
	pros = new Promise((resolve, reject) => {
    return fs.readdir('staticfolder', (err, filenames) => err ? reject(err) : resolve(filenames))
})
	pros.then((files) => {
		let xDic = {}
		xDic["0-9"] = {"fileInDic":new Array(), "fName": new Array()}

		files.forEach((file) => { 
        	if (file.endsWith('.jsdos')) { 
            	let fileText = file.slice(0, -6).split("-") 
				let joined = fileText.join("-")

				if (!(joined[0].toUpperCase() in xDic)){
					if (!(fileText.join("-")[0] == "'") && (!isNumeric(joined[0]))){
						xDic[fileText.join("-")[0].toUpperCase()] = {"fileInDic":new Array(), "fName": new Array()}
					}
				}
				if (!(joined[0] == "'") && (!isNumeric(joined[0]))){	
					xDic[joined[0].toUpperCase()]["fileInDic"].push(joined)
				} else if(isNumeric(joined[0])) {
					xDic["0-9"]["fileInDic"].push(joined)
				}
            	fileText.forEach((el, i)=>{ 
					if (el.length > 0) {
                		fileText[i] = fileText[i][0].toUpperCase()+fileText[i].substring(1) 
					}
            	}) 
			    joined = fileText.join(" ")
				if (!(joined[0] == "'") && (!isNumeric(joined[0]))){	
					xDic[joined[0].toUpperCase()]["fName"].push(joined)
				} else if(isNumeric(joined[0])) {
					xDic["0-9"]["fName"].push(joined)
				}
			}
		})
    	res.render('library', {fs:fs, xDic:xDic});
	})
});
app.get('*', function(req, res) {
    
    const gameName = req.url.substring(1)
    res.render('game', { gameName: gameName, fs: fs});
});


app.listen(2256, '10.1.3.10');
