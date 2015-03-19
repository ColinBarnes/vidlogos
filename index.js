var fs =  require('fs');
var cheerio = require('cheerio');
var sqlite3 = require('sqlite3').verbose();

// Database ========================================

var db_file = 'messages.db';
var db_exists = fs.existsSync(db_file);
var db = new sqlite3.Database(db_file);

db.serialize(function () {
	if (!db_exists) {

		db.run("CREATE TABLE if not exists phone (id integer PRIMARY KEY NOT NULL, person text NOT NULL, number text UNIQUE NOT NULL);",
			function (error){
				if (error){
					console.log("Error creating phone table");
					console.log(error);
				}
			});

		db.run("CREATE TABLE if not exists text (id integer PRIMARY KEY NOT NULL, phone_id integer NOT NULL, time_stamp text NOT NULL, message text, FOREIGN KEY (phone_id) REFERENCES phone(id));",
			function (error){
				if (error) {
					console.log("Error creating text table");
					console.log(error);
				}
			});
	}
});

// Add messages and cosntacts to the databse
// avoiding duplicate contacts
function addMessage (message) {
	console.log(message.datetime);
	db.serialize(function () {

		// Add contact if they don't exist
		db.run("INSERT OR IGNORE INTO phone(person, number) VALUES(?, ?)", 
			[message.person, message.number]);

		// Grab phone_id
		db.get("SELECT id FROM phone WHERE number = ?", 
			message.number,
			function (error, row){
				var phone_id = row.id;
			});

		// Add message content
		db.run("INSERT INTO text(phone_id, time_stamp, message) VALUES(?, ?, ?)", 
			[phone_id, message.datetime, message.content]);
	});
}

// Scrape ==================================================

// Folder with all of the Google Voice logs
var file_path = './Takeout/Voice/Calls/';


// Get a list of all the files in the folder
/*
var files = [];
fs.readdir(file_path, function (err, output){
	if (err) {
		console.log("Error reading files");
		conosle.log(err);
	}
	files = output;
	console.log('output: ' +  output.length);
	console.log('files: ' + files.length);
});
*/

files = fs.readdirSync(file_path);

console.log("Files: " + files.length);

//  Grab only the text logs
var re = /- Text -/;

files = files.filter(function (element) {
	return re.test(element);
});

// Loop through all of the text logs and load them into the database
var file;
var $;

for (var i=0; i < files.length; i++) {
	console.log(i);
	file = fs.readFileSync(file_name);
	$ = cheerio.load(file);

	$('.message').each(function () {

		// Grab the timestamp
		// Format is YYYY-MM-DDTHH:MM:SS.SSSZ
		var datetime = $(this).find('.dt').attr('title'); 

		// Grab the telephone number in 'tel:+##########' format
		var number = $(this).find('.tel').attr('href');

		// Remove any non digits
		number = number.replace(/[^\d]/g, '');

		// Grab the name of the sender
		var person = $(this).find('.fn').text();

		// Grab the message
		var content = $(this).find('q').text();

		addMessage({
			datetime: datetime,
			number: number,
			person: person,
			content: content
		});

	});
}