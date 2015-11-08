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
    link: { type: String, default: '' },

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
    },
    pros: {
        type: Schema.Types.ObjectId, 
        ref: 'Pro'
    }
});

mongoose.model('Gear', GearSchema);
