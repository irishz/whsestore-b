const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let historySchema = new Schema({
    job: {
        type: String
    },
}, {
        collection: 'history'
    })

module.exports = mongoose.model('History', historySchema)