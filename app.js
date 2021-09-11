var express = require('express');
const sqlite3 = require('sqlite3').verbose();

var app = express();
app.set('port', process.env.PORT || 3001);

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

if ('development' == app.get('env')) {
  app.use(allowCrossDomain);
}

app.get('/get_data', function (req, res) {
  let db = new sqlite3.Database('./aus_data.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  let sql = `SELECT *
             FROM crns LIMIT 50 OFFSET ` + (req.query.offset * 50);

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

app.get('/get_data_size', function (req, res) {
  let db = new sqlite3.Database('./aus_data.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  let sql = `SELECT Count(*)
             FROM crns`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send('' + rows[0]['Count(*)']);
  });
  
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});