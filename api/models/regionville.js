const mongoose = require('mongoose');

const arrondissemntSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    ville: String,
    region: String,
    arrondissement: String,
    created: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Arrondissement', arrondissemntSchema);