const express = require('express');
const morgan = require('morgan');
const expresshbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const sesion = require('express-session');
const mysqlStore = require('express-mysql-session');
const { database } = require('./keys');
const  passport = require('passport');

//initializations
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expresshbs({
	defaultLayout: 'main',
	layoutsDir: path.join(app.get('views'),  'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'),
	extname: '.hbs',
	helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middlewares
app.use(sesion({
	secret: 'saulalonsoibarra',
	resave: false,
	saveUninitialized: false,
	store: mysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extenden: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((request, response, next)=>{
	app.locals.success = request.flash('success');
	app.locals.message = request.flash('message');
	app.locals.user = request.user;
	next();
});

//routes
app.use(require('./routes'));
app.use(require('./routes/autentication'));
app.use('/links', require('./routes/links'));

//Public files
app.use(express.static(path.join(__dirname, 'public')));
//starting server
app.listen(app.get('port'), ()=>{
	console.log('Server on port ', app.get('port'));
});