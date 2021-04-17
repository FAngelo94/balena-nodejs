const mysql = require('mysql');
const express = require('express')
const { exec } = require("child_process");
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'db',
  port: 3306,
  user: 'user',
  password: 'test',
  database: 'my_database'
});

/**
 * Function to render the app.html page
 * @param {*} req 
 * @param {*} res 
 * @param {*} param2 all variables we can show in page
 */
const renderAppPage = (req, res, { username = "", message = "", apps = "", logs = [] }) => {
  res.render('app.html', { username: req.session.username, message, apps, logs });
}

const createTable = () => {
  connection.query("CREATE TABLE IF NOT EXISTS Log (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(32), action VARCHAR(16))", function (error, results, fields) {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
  });
}

/**
 * Home page route
 */
app.get('/', (req, res) => {
  createTable()
  if (req.session.loggedin) {
    renderAppPage(req, res, { message: "You are already logged, press to see apps list" });
  } else {
    renderAppPage(req, res, { message: "Login and then see apps list" });
  }

})

/**
 * API to do the login in balena using balena cli
 */
app.post('/auth', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  exec("balena login --credentials --email " + username + " --password " + password, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      renderAppPage(req, res, { message: "Login Failed, check your data!" });
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      renderAppPage(req, res, { message: stderr });
      return;
    }
    console.log(`stdout: ${stdout}`);
    // Login success
    req.session.username = username;
    req.session.loggedin = true;
    renderAppPage(req, res, { username: username, message: "Login Success!" });
  });
});

/**
 * API to read all apps from using balena cli
 */
app.get('/balenaapps', (req, res) => {
  exec("balena apps", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      renderAppPage(req, res, { message: error.message });
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      renderAppPage(req, res, { message: stderr });
      return;
    }
    console.log(`stdout: ${stdout}`);
    connection.query('INSERT INTO Log (username, action) VALUES (?, ?)', [req.session.username, "Read APP"], function (error, results, fields) {
    });
    renderAppPage(req, res, { message: "Look your apps", apps: stdout });
  });
})

/**
 * API to read all logs from DB
 */
app.get('/readdb', (req, res) => {
  connection.query('SELECT * FROM Log', function (error, results, fields) {
    if (results.length > 0) {
      renderAppPage(req, res, { message: "Read DB", logs: results });
    } else {
      renderAppPage(req, res, { message: "Error DB" });
    }
  });
})

/**
 * Function that start the server
 */
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})