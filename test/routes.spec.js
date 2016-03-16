var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var models = require("../models");
var Page = models.Page;
var User = models.User;
var chai = require('chai');
var expect = chai.expect;


describe('http requests', function () {


	beforeEach(function(done){
		page = new Page({
			title: "Ohai sean",
			content: "# Hello Sean, nice to see you",
			tags: ['greetings', 'sean']
		});
		page.save();

		page = new Page({
			title: "Hi sean",
			content: "# Hello Sean, nice to see you",
			tags: ['greetings', 'sean']
		});
		page.save();
		done();
	})

	afterEach(function(done){
		Page.find({}).remove().exec()
		done();
	})



	describe('GET /', function () {
		it('gets 200 on index', function (done) {
			agent
			.get('/')
			.expect(200, done);
		});		
	});

	describe('GET /wiki/add', function () {
		it('responds with 200', function(done) {
			agent
			.get('/wiki/add')
			.expect(200, done);
		});
	});

	describe('GET /wiki/:urlTitle', function () {
		it('responds with 404 on page that does not exist',function(done) {
			agent
			.get('/wiki/Bye_sean')
			.expect(404, done);
		});
		it('responds with 200 on page that does exist',function(done) {
			agent
			.get('/wiki/Hi_sean')
			.expect(200, done);
		});
	});

	describe('GET /wiki/search', function () {
		it('responds with 200', function(done) {
			agent
			.get('/wiki/search')
			.expect(200, done);
		});
	});

	describe('GET /wiki/:urlTitle/similar', function () {
		it('responds with 404 for page that does not exist', function(done) {
			agent
			.get('/wiki/Bye_sean/similar')
			.expect(404, done);
		});
		it('responds with 200 for similar page', function(done) {
			agent
			.get('/wiki/Hi_sean/similar')
			.expect(200, done);
		});
	});

	describe('POST /wiki', function () {
		it('responds with 302', function(done){
			agent
			.post('/wiki/')
			.send({
				title: "Hello sean",
				content: "# Hello Sean, nice to see you",
				name: "Eric",
				email: "eric@fullstack.com",
				tags: 'greetings,sean'
			})
			.expect(302, function(err, res){
				if (err) {
					done(err);
				} else {
					expect(res.header.location).to.equal("/wiki/Hello_sean");
					done()
				}
			})
		});
		it('creates a page in the database', function(done){
			agent
			.post('/wiki/')
			.send({
				title: "Hello sean",
				content: "# Hello Sean, nice to see you",
				name: "Eric",
				email: "eric@fullstack.com",
				tags: 'greetings,sean'
			})
			.expect(302, function(err, res){
				if (err) {
					done(err);
				} else {
					Page.find({title: "Hello sean"})
					.then(function(pages){
						expect(pages).to.have.lengthOf(1);
						done()
					}).catch(done)
				}
			});
		});
	});

});





