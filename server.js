require("babel-register");

var path =  require('path');
var express = require('express');
var app = express();
var React = require('react')
var renderToString = require('react-dom/server').renderToString
var match = require('react-router').match
var RouterContext = require('react-router').RouterContext
var routes = require('./app/routes.js').default

//View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(express.static(path.join(__dirname, 'app')));

global.navigator = { navigator: 'all' };
global.__isDevelopment = process.env["CLOUDBOOST_DEVELOPMENT"] || false
global.__isHosted = process.env["CLOUDBOOST_HOSTED"] || false
global.__isBrowser = false;
if(__isHosted){
	global.USER_SERVICE_URL = "https://service.cloudboost.io"
	global.SERVER_DOMAIN = "cloudboost.io"
	global.SERVER_URL='https://api.cloudboost.io'
	global.DASHBOARD_URL='https://dashboard.cloudboost.io'
	global.ACCOUNTS_URL='https://accounts.cloudboost.io'
} else {
	global.USER_SERVICE_URL = "https://localhost:3000"
	global.SERVER_DOMAIN = "localhost:4730"
	global.SERVER_URL="https://localhost:4730"
	global.DASHBOARD_URL="https://localhost:1440"
	global.ACCOUNTS_URL="https://localhost:1447"
}

if(__isHosted) routes = routes.routes_prod
	else routes  = routes.routes_dev

app.get('/app/key.js',function(req,res){
	res.setHeader('Content-type', 'text/plain');
	res.charset = 'UTF-8';
	var content= "";

		/***************************************************Connecting URLs*********************************************************/
		content+= "var __isDevelopment = "+(process.env["CLOUDBOOST_DEVELOPMENT"] || "false")+";\n";
		content+= "var __isHosted = "+(process.env["CLOUDBOOST_HOSTED"] || "false")+";\n";
		content+= "var __isBrowser = typeof document !== 'undefined';\n";
		content+= "var USER_SERVICE_URL = null,\n";
		content+= "SERVER_URL = null,\n";
		content+= "DASHBOARD_URL = null,\n";
		content+= "ACCOUNTS_URL = null,\n";
		content+= "LANDING_URL = 'https://www.cloudboost.io';\n";
		content+= "if(window.location.hostname==='accounts.cloudboost.io'){\n";
		content+= "USER_SERVICE_URL='https://service.cloudboost.io';\n";
		content+= "SERVER_DOMAIN='cloudboost.io';\n";
		content+= "SERVER_URL='https://api.cloudboost.io';\n";
		content+= "DASHBOARD_URL='https://dashboard.cloudboost.io';\n";
		content+= "ACCOUNTS_URL='https://accounts.cloudboost.io';\n";
		content+= "}else{\n";
		content+= "USER_SERVICE_URL = window.location.protocol+'//'+window.location.hostname + ':3000';\n";
		content+= "SERVER_DOMAIN= window.location.hostname;\n";
		content+= "SERVER_URL =  window.location.protocol+'//'+window.location.hostname + ':4730';\n";
		content+= "DASHBOARD_URL =  window.location.protocol+'//'+window.location.hostname + ':1440';\n";
		content+= "ACCOUNTS_URL =  window.location.protocol+'//'+window.location.hostname + ':1447';\n";
		content+= "}\n";

		res.write(content);
		res.end();
	});

// universal routing and rendering
app.get('*', (req, res) => {
  match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {

      // in case of error display the error message
      if (err) {
        return res.status(500).send(err.message);
      }

      // in case of redirect propagate the redirect to the browser
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      // generate the React markup for the current route
      let markup;
      if (renderProps) {
        // if the current route matched we have renderProps
        markup = renderToString(React.createElement(RouterContext, renderProps));
      } else {
        // otherwise we can render a 404 page
        markup = renderToString((React.createElement('h1',null,'404')))
        res.status(404);
      }

      // render the index template with the embedded React markup
      return res.render('index', { markup });
    }
  );
});

//Ending
app.set('port', process.env.PORT || 1447);
var server = app.listen(app.get('port'), function() {	
	console.log("Accounts started on PORT:"+app.get('port'));
});
