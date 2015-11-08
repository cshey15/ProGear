'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Validation
 */
function validateLength(v) {
    // a custom validation function for checking string length to be used by the model
    return v.length <= 15;
}

/**
 * Pro Schema
 */
var ProSchema = new Schema({
    // the property name
    created: {
        // types are defined e.g. String, Date, Number (http://mongoosejs.com/docs/guide.html)
        type: Date,   
        // default values can be set
        default: Date.now
    },
    team: {
        type: String,
        default: '',
        // types have specific functions e.g. trim, lowercase, uppercase (http://mongoosejs.com/docs/api.html#schema-string-js)
        trim: true
    },
    name: {
        type: String,
        default: '',
        trim: true,     
        unique : true,
        // make this a required field
        required: 'name cannot be blank',
        // wires in a custom validator function (http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate).
        validate: [validateLength, 'name must be 15 chars in length or less']
    },
    gear: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gear' }]
});

// Expose the model to other objects (similar to a 'public' setter).
mongoose.model('Pro', ProSchema);