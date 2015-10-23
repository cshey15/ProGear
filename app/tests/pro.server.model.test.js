'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    Pro = mongoose.model('Pro');

/**
 * Unit tests
 */
describe('Pro Model', function () {
    
    describe('Saving', function () {
        it('saves new record', function (done) {
            var pro = new Pro({
                name: 'Doublelift',
                team: 'League of legends'
            });
            
            pro.save(function (err, saved) {
                should.not.exist(err);
                done();
            });
        });
        
        it('throws validation error when name is empty', function (done) {
            var pro = new Pro({
                team: 'League of legends'
            });
            
            pro.save(function (err) {
                should.exist(err);
                err.errors.name.message.should.equal('name cannot be blank');
                done();
            });
        });
        
        it('throws validation error when name longer than 15 chars', function (done) {
            var pro = new Pro({
                name: 'DoubleliftDoubleliftDoublelift'
            });
            
            pro.save(function (err, saved) {
                should.exist(err);
                err.errors.name.message.should.equal('name must be 15 chars in length or less');
                done();
            });
        });
        
        it('throws validation error for duplicate pro name', function (done) {
            var pro = new Pro({
                name: 'Doublelift'
            });
            
            pro.save(function (err) {
                should.not.exist(err);
                
                var duplicate = new Pro({
                    name: 'Doublelift'
                });
                
                duplicate.save(function (err) {
                    err.err.indexOf('$name').should.not.equal(-1);
                    err.err.indexOf('duplicate key error').should.not.equal(-1);
                    should.exist(err);
                    done();
                });
            });
        });
    });
    
    afterEach(function (done) {
        // NB this deletes ALL categories (but is run against a test database)
        Pro.remove().exec();
        done();
    });
});