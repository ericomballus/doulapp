const mongoose = require('mongoose');

const structureSchema = mongoose.Schema({
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
    phone:  Number, 
    nomproprio: String,
    autorisation: String,
 //  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
   quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('Structure', structureSchema);