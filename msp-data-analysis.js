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
var queryStringCountSql = "select count(*) as count from msp_snow_data.80_89_msp_data;";

connection.query(queryStringCountSql, (err, result) => {
    queryStringCountResult = result[0].count;
    console.log('queryStringCountResult', queryStringCountResult);
    // queryStringCountResult = 5;

    calcLoop(queryStringCountResult, 30)
        .then(function (data) {
            console.log('answer', data);
            return;
        })
        .then(() => connection.end());

})

const calcLoop = (countOfRecords, numOfDays) => {
    return new Promise(function (resolve, reject) {
        var totalArray = [];
        var filteredSum = [];

        for (let i = 1; i <= (countOfRecords - numOfDays); i++) {
            var arraySum = [];
            console.log('value of i', i);
            sqlStringFunction(i, (i + numOfDays - 1), function (err, res) {

                arraySum = res.map(data => data['Snow (inches)']);
                filteredSum = arraySum.filter(data2 => data2 != 'T');

                totalArray.push({
                    'Start Date': moment(res[0].Date).format("YYYY-MM-DD"),
                    'End Date': moment(res[29].Date).format("YYYY-MM-DD"),
                    Sum: filteredSum.reduce((total, num) => total + parseFloat(num), 0).toFixed(2)
                });
                console.log('totalArray1',totalArray[i]);

            })
            
        }
        // resolve(totalArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)));
        resolve(totalArray);
    })
};

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
