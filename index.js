var fs =  require('fs');
var cheerio = require('cheerio');
var sqlite3 = require('sqlite3').verbose();

// Database ========================================

var db_file = 'messages.db';
var db_exists = fs.existsSync(db_file);
var db = new sqlite3.Database(db_file);

db.serialize(function () {
	if (!db_exists) {
		db.run("
			CREATE TABLE if not exists phone (
				id  			integer					PRIMARY KEY NOT NULL,
				person			text					NOT NULL,
				number			text					NOT NULL UNIQUE,

				PRIMARY KEY(id),
			);

			CREATE TABLE if not exists text (
				id  			integer					PRIMARY KEY NOT NULL,
				phone_id		integer					NOT NULL,
				time_stamp		text					NOT NULL,
				message			text,


				FOREIGN KEY (phone_id) REFERENCES phone(id)
			);
			");
	}
});

// Add messages and cosntacts to the databse
// avoiding duplicate contacts
function addMessage (message) {

	// Add contact if they don't exist

	// Add message content

}

// Scrape ==================================================

// Folder with all of the Google Voice logs
var file_path = './Takeout/Voice/Calls/';
var files = [];

// Get a list of all the files in the folder
fs.readdir(file_path, function (err, output){
	files = output;
});

//  Grab only the text logs
var re = /- Text -/;

files = files.filter(function (element) {
	return re.test(element);
});


// Loop through all of the text logs and load them into the database
var file;
var $;

for (var i=0; i < files.length; i++) {
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
		var name = $(this).find('.fn').text();

		// Grab the message
		var content = $(this).find('q').text();

		addMessage({
			datetime: datetime,
			number: number,
			name: name,
			content: content
		});

	});
}