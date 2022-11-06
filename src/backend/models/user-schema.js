const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'กรุณาใส่ชื่อ'],
        unique: true,
    },
    role: {
        type: Number,
    },
    department: {
        type: String
    },
    password: {
        type: String,
    }
}, {
        timestamps: true,
        collection: 'users'
    })

module.exports = mongoose.model('User', userSchema)