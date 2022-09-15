const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let zoneSchema = new Schema({
    zone: {
        type: Number
    },
    created_date: {
        type: Date,
        default: new Date(),
    }
}, {
        collection: 'zone'
    })

module.exports = mongoose.model('Zone', zoneSchema)