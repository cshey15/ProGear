'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * Issue Schema
 */
var IssueSchema = new Schema({
    gear: { type: mongoose.Schema.Types.ObjectId, ref: 'Gear' },
    pro: { type: mongoose.Schema.Types.ObjectId, ref: 'Pro' },
    name: {
        type: String
    },
    email: {
        type: String
    },
    comment: {
        type: String,
        required: 'What\'s the issue?'
    },
    status: {
        type: String, default: 'pending',
        enum: ['approved', 'denied', 'pending']
    },
    lastUpdated: {
        type: Date
    },
	created: {
		type: Date,
		default: Date.now
	},
    approver: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

var options = {};
IssueSchema.plugin(deepPopulate, options);
mongoose.model('Issue', IssueSchema);