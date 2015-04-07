var fs =  require('fs'),
	sqlite3 = require('sqlite3').verbose();

// Database =======================================
var db_file = 'messages.db';
var db = new sqlite3.Database(db_file);

var female_names = []

function addGender () {
	db.serialize(function () {
		db.each("SELECT id, person FROM phone", function (err, row) {
			if(err) throw err;

			// Grab first name
			var first_name = row.person.split(/\s/)[0];

			// Check if name is in list of female names
			if(female_names.indexOf(first_name) > -1) {

				// Flag person as being female
				db.run("UPDATE phone SET is_female=? WHERE id=?", 1, row.id);

			} else {
				// Flag as not being female
				db.run("UPDATE phone SET is_female=? WHERE id=?", 0, row.id);
			}
		});
	});

	db.close();
}

// Read a list of common female names
fs.readFile('female.txt', function(err, data) {
    if(err) throw err;
    female_names = data.toString().split("\n");
    
    addGender();
});

