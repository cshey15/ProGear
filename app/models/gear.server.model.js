'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
    amazonLink: { type: String, default: '' },
    asin: { type: String, default: '' },
    popularityScore: {
        type: Number,
        default: 0
    },
    published: {
        type: Boolean,
        default: false
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
    }
});

mongoose.model('Gear', GearSchema);
