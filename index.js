const express = require('express')
const { exec } = require("child_process");
var session = require('express-session');
var bodyParser = require('body-parser');
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

const renderAppPage = (req, res, { username = "", message = "", apps = "" }) => {
  res.render('app.html', { username: req.session.username, message, apps });
}

app.get('/', (req, res) => {
  if (req.session.loggedin) {
    renderAppPage(req, res, { message: "You are already logged, press to see apps list" });
  } else {
    renderAppPage(req, res, { message: "Login and then see apps list" });
  }

})

app.post('/auth', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  exec("balena login --credentials --email " + username + " --password " + password, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      renderAppPage(req, res, {message: "Login Failed, check your data!" });
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      renderAppPage(req, res, {message: stderr });
      return;
    }
    console.log(`stdout: ${stdout}`);
    // Login success
    req.session.username = username;
    req.session.loggedin = true;
    renderAppPage(req, res, { username: username, message: "Login Success!" });
  });
});

app.post('/balenaapps/', (req, res) => {
  exec("balena apps", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      renderAppPage(req, res, {message: error.message });
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      renderAppPage(req, res, {message: stderr });
      return;
    }
    console.log(`stdout: ${stdout}`);
    renderAppPage(req, res, {message: "Look your apps", apps: stdout });
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})