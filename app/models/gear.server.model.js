'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * Gear Schema
 */
var GearSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gear name',
		trim: true
    },
    type: {
        type: String, default: '',
        required: 'Please fill Gear type',
        enum: ['Keyboard', 'Mouse']
    }, //keyboard, mouse, etc
    /* this might be unnecessary.. we might want to write some backend
    * logic that handles the link creation dynamically.. basically I dont understand
    * how the amazon/ebay/whatever affiliate linking system works
    */
    
    website: { type: String },
    asin: { type: String },
    popularityScore: {
        type: Number,
        default: 0
    },

    // START - Retrieved from Amazon.
    amazonLink: { type: String }, 
    profilePictureUrl: {
        type: String,
        default: '/modules/media/images/imageComingSoon.jpg',
    },
    features: [{
            type: String
        }],
    // END - Retrieve from Amazon

    published: {
        type: Boolean,
        default: false
    },
	created: {
		type: Date,
		default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
    }
});
var options = {};
GearSchema.plugin(deepPopulate, options /* more on options below */);
mongoose.model('Gear', GearSchema);
