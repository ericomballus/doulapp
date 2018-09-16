const mongoose = require('mongoose');

const imagelogoSchema = mongoose.Schema({
    filename: String,
    originalName: String,
    description: String,
    activite: String,
    created: {type: Date, default: Date.now},   
    name: String,
    ville:  String,
    region:  String,
    arrondissement: String,
    lat: Number,
    long: Number,
    telephone:  Number, 
    nomproprio: String,
    autorisation: String,
    imageprofile: String,
});

module.exports = mongoose.model('Imagelogo', imagelogoSchema);