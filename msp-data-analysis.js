// Load the NPM Package mysql
var mysql = require("mysql");
const moment = require("moment")
var fs = require('fs');


var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "msp_snow_data"
});

let queryStringCountResult = 0;
var queryStringCount = "select count(*) as count from msp_snow_data.80_89_msp_data;";

connection.query(queryStringCount, (err, result) => {
    queryStringCountResult = result[0].count;
    console.log('queryStringCountResult', queryStringCountResult);
    // queryStringCountResult = 5;

    calcLoop(queryStringCountResult, 30)
        .then(function (data) {
            console.log(data);
            return;
        })
        .then(() => connection.end());

})

const calcLoop = (countOfRecords, numOfDays) => {
    return new Promise(function (res, rej) {
        var totalArray = [];
        var filteredSum = [];

        for (i = 1; i <= countOfRecords; i++) {
            var arraySum = [];

            sqlStringFunction(i, (i + numOfDays-1), function (err, res) {

                arraySum = res.map(data => data['Snow (inches)']);
                filteredSum = arraySum.filter(data2 => data2 != 'T');
                // console.log('result range ', ...filteredSum);
                // console.log('sum 2 things', (parseFloat(filteredSum[0])+parseFloat(filteredSum[1])));
                // console.log('total sum',filteredSum.reduce((total, num) => total+parseFloat(num), 0));
                totalArray.push({
                    'Start Date': moment(res[0].Date).format("YYYY-MM-DD"),
                    'End Date': moment(res[29].Date).format("YYYY-MM-DD"),
                    Sum: filteredSum.reduce((total, num) => total + parseFloat(num), 0).toFixed(2)
                });

            })
        }
    })
};
// (console.log('result',result[0].count)));
// (queryStringCountResult = result[0].count));

// sqlStringFunction(i, (i+29), function (err, res) {
//     console.log(res);
//     // console.log(res.affectedRows + " product inserted!\n");

// });


// })

function sqlStringFunction(startIdx, endIdx, cb) {
    //SELECT * from msp_snow_data.80_89_msp_data
    //  WHERE (Date BETWEEN '1988-05-15' AND '1988-06-29');
    //
    //SELECT * from msp_snow_data.80_89_msp_data
    // where id >=3054 and id <=3083;
    var queryString = "SELECT * from msp_snow_data.80_89_msp_data";
    queryString += " where id >=" + startIdx;
    queryString += " and id <=" + endIdx;
    queryString += ";";
    connection.query(queryString, function (err, result) {
        if (err) {
            throw err;
        }
        // console.log('result range ', result);
        cb(err, result);
    });
};
