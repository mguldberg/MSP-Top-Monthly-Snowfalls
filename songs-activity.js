// Load the NPM Package mysql
var mysql = require("mysql");


var fs = require('fs');


var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "friday_exercise_2_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // A query which returns all data for songs sung by a specific artist
    var query = connection.query(
        "SELECT * FROM friday_exercise_2_db.song_table where artist='The Beach Boys'",

        function (err, res) {
            console.log(res);
            // console.log(res.affectedRows + " query artist!\n");

        }
    );


    // A query which returns all artists who appear within the top 5000 more than once
    var query2 = connection.query(
        "SELECT artist, count(*) as releases FROM friday_exercise_2_db.song_table " +
        "group by artist HAVING count(*) > 10 order by releases DESC",

        function (err, res) {
            console.log(res);
            // console.log(res.affectedRows + " artists who appear more than once!\n");

        }
    )

    // A query which returns all data contained within a specific range
    var query3 = connection.query(

        "SELECT * FROM friday_exercise_2_db.song_table WHERE song_year " +
        "between 2001 AND 2002",

        function (err, res) {
            console.log(res);
            // console.log(res.affectedRows + " year range\n");

        }
    )

    // A query which searches for a specific song in the top 5000 and returns the data for it
    var query4 = connection.query(

        "SELECT * FROM friday_exercise_2_db.song_table where song_title='Hey Ya!'",

        function (err, res) {
            console.log(res);
            // console.log(res.affectedRows + " hey ya song data dump\n");

        }
    )

    connection.end();
})







// SELECT * FROM songs WHERE genre = 'Classic Rock' OR genre = 'Dance'", function (err, res) {

