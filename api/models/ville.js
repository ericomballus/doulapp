const mongoose = require('mongoose');

const villeSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},   
    ville: String,
});

module.exports = mongoose.model('Ville', villeSchema);