const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    },
    proteins: {
        type: Number,
        required: true,
        min: 0
    },
    glucides: {
        type: Number,
        required: true,
        min: 0
    },
    lipides: {
        type: Number,
        required: true,
        min: 0
    },
    dateAjout: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('meal', mealSchema)
