var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

describe('adding', function() {
	it('should add numbers together', function() {
		expect(2+2).to.equal(4);
	})
});

// describe('timeOuts', function() {
// 	it('should wait the right amount of time', function(done) {
// 		var setTime = new Date();
// 		setTimeout(function() {
// 			expect(new Date() - setTime).to.be.above(10);
// 		done();
// 		}, 10);	
// 	})
// });

describe('forEach', function() {

	var innerFunction = function(elem) {
		console.log(elem);
	};
	var testArray = [1, 2, 3];
	var spiedInnerFunction = chai.spy(innerFunction);

	it('should call the callback three times', function() {
		testArray.forEach(spiedInnerFunction);
		expect(spiedInnerFunction).to.have.been.called.exactly(3);
	})
});



