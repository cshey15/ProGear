'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Gear = mongoose.model('Gear'),
    Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * Validation
 */
function validateLength(v) {
    // a custom validation function for checking string length to be used by the model
    return v.length <= 30;
}

function validateUrl(value) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
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
    lastUpdated: {
        // types are defined e.g. String, Date, Number (http://mongoosejs.com/docs/guide.html)
        type: Date,   
        // default values can be set
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim: true,     
        unique : true,
        // make this a required field
        required: 'name cannot be blank',
        // wires in a custom validator function (http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate).
        validate: [validateLength, 'name must be 30 chars in length or less']
    },
    profilePictureUrl: {
        type: String,
        default: '/modules/media/images/defaultPerson.jpg',
    },
    sport: {
        type: String,
        default: '',
        required: 'sport cannot be blank',
        // types have specific functions e.g. trim, lowercase, uppercase (http://mongoosejs.com/docs/api.html#schema-string-js)
        trim: true,
        validate: [validateLength, 'name must be 30 chars in length or less']
    },
    team: {
        type: String,
        default: '',
        required: 'team cannot be blank',
        // types have specific functions e.g. trim, lowercase, uppercase (http://mongoosejs.com/docs/api.html#schema-string-js)
        trim: true,
        validate: [validateLength, 'name must be 30 chars in length or less']
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    requestList:[{ type: mongoose.Schema.Types.ObjectId, ref: 'LinkGearRequest' }],
    popularityScore: {
        type: Number,
        default: 0
    },
    fbProfile: {
        type: String,
        validate: [validateUrl, 'Facebook profile should be a valid url. Remember to include the http://']
    },
    website: {
        type: String,
        validate: [validateUrl, 'Website should be a valid url. Remember to include the http://']
    },
    alias: {
        type: String,
    },
    published: {
        type: Boolean,
        default: true,
    }
});

// automatically populated based approved requestList
//ProSchema.virtual('gearList').get(function () {
//    var gears = [];
    
//    for (var i in this.requestList) {
//        if (this.requestList[i].status === 'approved') {
//            gears.push(this.requestList[i].gear);
//        }
//    }
//    return gears;
//});

ProSchema.set('toJSON', { getters: true, virtuals: true });
ProSchema.set('toObject', { getters: true, virtuals: true });

var options = { };
ProSchema.plugin(deepPopulate, options /* more on options below */);

// Expose the model to other objects (similar to a 'public' setter).
mongoose.model('Pro', ProSchema);
