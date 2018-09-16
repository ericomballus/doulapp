const mongoose = require('mongoose');

const secteuractiviteSchema = mongoose.Schema({
    activite: String,
    created: {type: Date, default: Date.now},   
});

module.exports = mongoose.model('Secteuractivite', secteuractiviteSchema);