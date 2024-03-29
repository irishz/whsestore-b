const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let locationSchema = new Schema({
    zone: {
        type: Number
    },
    ch: {
        type: Number
    },
    job: {
        type: String
    },
    item: {
        type: String
    }
}, {
        timestamps: true,
        collection: 'location'
    })

module.exports = mongoose.model('Location', locationSchema)