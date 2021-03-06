var http = require('http');
var express = require ('express');
var path = require('path');
var bodyParser = require('body-parser');
// var cloudinary = require('cloudinary');
// var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect('mongodb://root:root@ds125555.mlab.com:25555/student', {
	 useMongoClient: true
 });

var studentSchema = new mongoose.Schema({
	studentname: {type: String, required: true},
	school: {type: String, required: true},
	email:  {type: String, required: true},
	age: {type: Number, required: true},
});

var StudentModel = mongoose.model('studentData', studentSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.render('index', {
		title: 'Andela',
		name: 'The Andela School'
	});
});

app.get('/create', function(req, res) {
	res.render('create', {
		title: 'Create Resource',
	});
});

app.get('/list', function(req, res, next) {
	// Get Student data from the Database
	StudentModel.find()
	.then(function(doc) {
		res.render('list', {
				studentdata: doc,
				title: 'Listings'
		});
	});

});

app.post('/create', urlencodedParser, function(req, res) {
	// Get the Student request
	var item = {
		studentname: req.body.studentname,
		school: req.body.school,
		email: req.body.email,
		age: req.body.age,
	};
	// Insert Student data into the database
	var data = new StudentModel(item).save(function(err, data) {
		if (err) throw err;
		res.redirect('list');
	});
});


app.get('/show/:id', function(req, res) {
	var id = req.params.id;
	StudentModel.findOne({_id: id}, function(err, data) {
		if (err) throw err;
		res.render('show', { studentdata: data });
	});
});

app.post('/update/:id', urlencodedParser, function(req, res) {
	var id = req.params.id;
	StudentModel.findOne({_id: id}, function(err, data) {
		if (err) throw err;
		data.studentname = req.body.studentname,
		data.school = req.body.school,
		data.email = req.body.email,
		data.age = req.body.age

		data.save(function(err, data) {
			if (err) throw err;
			res.redirect('/list');
		});
	});
});

app.get('/delete/:id', function(req, res) {
	StudentModel.remove({_id: req.params.id }, function(err, data) {
		if (err) throw err;
		res.redirect('/list');
	 });
});

app.listen(process.env.PORT || 3000);
