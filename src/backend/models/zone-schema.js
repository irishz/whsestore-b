const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let zoneSchema = new Schema({
    zone: {
        type: Number
    },
}, {    timestamps: true,
        collection: 'zone'
    })

module.exports = mongoose.model('Zone', zoneSchema)