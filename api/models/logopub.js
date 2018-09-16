const mongoose = require('mongoose');

const logopubSchema = mongoose.Schema({
    filename: String,
    originalName: String,
    description: String,
    created: {type: Date, default: Date.now},   
    name: String,
   
    
});

module.exports = mongoose.model('Logopub', logopubSchema);