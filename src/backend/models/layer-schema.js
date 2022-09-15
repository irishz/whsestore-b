const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let layerSchema = new Schema({
    layer: {
        type: Number
    },
}, {
        timestamps: true,
        collection: 'layer'
    })

module.exports = mongoose.model('Layer', layerSchema)