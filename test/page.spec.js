var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);
var models = require("../models");
var Page = models.Page;
var User = models.User;

// describe('Pages model', function () {
//   describe('is an instance of pageSchema', function () {
//     it('expects page to be an instance of pageSchema');
//     it('has the right keys');
//     it('requires all the right things');
//     it('doesnt accept bad data');
//   });
//   describe('virtuals/statics/methods works', function(){
//   	it('page.route goes to /wiki/something');
//   	it('renderedContent work');
//   	it('findbytag works');
//   	it('findsimilar works');
//   });
//   describe('hooks work', function(){
//   	it('urlTitle is created');
//   	it('urlTitle doesnt have spaces');
//   });
// });
// describe('User model', function () {
//   describe('', function () {
//     it('tests something');
//     it('tests another aspect of the same thing');
//   });
//   describe('A different subcategory');
// });

describe('Page model', function() {

	describe('Virtuals', function() {
		var page;
		beforeEach(function(){
			page = new Page({
				title: "Ohai sean",
				content: "# Hello Sean, nice to see you",
				urlTitle: "Ohai_sean"
			})
		})
		describe('route', function() {
			it('returns the url_name prepended by "/wiki/"', function(){
				expect(page.route).to.equal("/wiki/Ohai_sean");
			})
		});

    	//Maybe revisit if time permits (.trim)
    	describe('renderedContent', function () {
    		it('converts the markdown-formatted content into HTML', function() {
    			expect(page.renderedContent.trim()).to.equal('<h1 id="hello-sean-nice-to-see-you">Hello Sean, nice to see you</h1>');
    		});
    	});
    });

	describe('Statics', function() {
		var page;

		beforeEach(function(done){
			page = new Page({
				title: "Ohai sean",
				content: "# Hello Sean, nice to see you",
				urlTitle: "Ohai_sean",
				tags: ['greetings', 'sean']
			});
			page.save();
			done();
		})

		afterEach(function(done){
			Page.find({}).remove().exec()
			done();
		})

		// describe('findByTag', function() {
		// 	it('gets pages with the search tag', function(done) {
		// 		Page.findByTag('greetings').then(function(pages) {
		// 			expect(pages).to.have.lengthOf(1);
		// 			done();
		// 		})
		// 		.then(null, done);
		// 	})

		// 	it('does not get pages without the search tag', function(done) {
		// 		Page.findByTag('bobobobobobobobobobob').then(function(pages) {
		// 			expect(pages).to.have.lengthOf(0);
		// 			done();
		// 		})
		// 		.then(null, done);
		// 	});
		// });

		describe('findByTag', function() {
			it('gets pages with the search tag', function() {
				console.log('first test');
				return Page.findByTag('greetings').then(function(pages) {
					setTimeout( function() {
						expect(pages).to.have.lengthOf(1);
					}, 1000)	
				})
			})

			it('does not get pages without the search tag', function() {
				console.log('second test');
				return Page.findByTag('bobobobobobobobobobob').then(function(pages) {
					expect(pages).to.have.lengthOf(0);
				})
			});
		});


	});

	describe('Methods', function() {
		beforeEach(function(done){
			Page.create({
				title: "page one",
				content: "content one",
				tags: ["one", "two"]
			})
			Page.create({
				title: "page two",
				content: "content two",
				tags: ["three", "two"]
			})
			Page.create({
				title: "page three",
				content: "content three",
				tags: ["three", "four"]
			})
			done();
		});



		describe('findSimilar', function() {
			it('never gets itself', function(done){
				Page.findOne({ title: "page one"})
				.then(function(page){
					return page.findSimilar();
				})
				.then(function(pages){
					expect(pages).to.have.lengthOf(1);
					expect(pages[0].title).to.not.equal("page one");
					done();
				}).then(null, done);
			});

			it('gets other pages with any common tags', function(done){
				Page.findOne({ title: "page one"})
				.then(function(page){
					return page.findSimilar();
				})
				.then(function(pages){
					expect(pages).to.have.lengthOf(1);
					expect(pages[0].title).to.equal("page two");
					done();
				}).then(null, done);
			});

			it('does not get other pages without any common tags', function(done){
				Page.findOne({ title: "page one"})
				.then(function(page){
					return page.findSimilar();
				})
				.then(function(pages){
					expect(pages).to.have.lengthOf(1);
					expect(pages[0].title).to.not.equal("page three");
					done();
				}).then(null, done);
			});
		});
	});

	describe('Validations', function() {
		beforeEach(function(){
			page = new Page({});
		});
		afterEach(function(done){
			Page.find({}).remove().exec()
			done();
		});
		it('errors without title', function(done){
			var success;
			page.content = "sample content";
			page.status = "open";
			page.save().then(function(page) {
				console.log('success');
				expect(page).to.not.exist;
				done();
			}, function(err){
				expect(err).to.exist;
				done();
			}).then(null, done);
		});
		it('errors without content', function(done) {
			page.validate(function(err){
				expect(err.errors).to.have.property('content');
				done();
			})
		});
		it('errors given an invalid status', function(done) {
			page.status = "something else"
			page.validate(function(err){
				expect(err.errors).to.have.property('status');
				done();
			})
		});
	});

	describe('Hooks', function() {
		beforeEach(function(){
			page = new Page({
				title : "Something we want to read",
				content : "sample content",
				status : "open"
			});
		});
		afterEach(function(done){
			Page.find({}).remove().exec()
			done();
		});
		it('it sets urlTitle based on title before validating', function(done){	
			page.save().then(function(page){
				expect(page.urlTitle).to.equal("Something_we_want_to_read")
				done()
			}).then(null, function(err){done(err)})
		});
	});

	afterEach(function(done){
		Page.find({}).remove().exec()
		done();
	});

});