const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const del = require('del');
const path = require('path');
var Jimp = require('jimp');
const gcsSharp = require('multer-sharp');
//const checkAuth = require('../middleware/check-auth');


const Structure = require('../models/structure');
const User = require('../models/user');

const router = express.Router();


 let UPLOAD_PATH = 'uploads';


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
}) 
 let upload1 = multer({ storage: storage })


 router.post('/', upload1.single('image'), (req, res, next) => {
       
 // let lena;  
    console.log(req.file)
Jimp.read(req.file.path)
    .then(lenna => {
        return lenna
            .resize(256, 256) // resize
            //.quality(80) // set JPEG quality
           // .greyscale() // set greyscale
            .write('uploads/lena\\' + req.file.filename  ,() =>{
               
                    fs.readFile('uploads/lena\\' + req.file.filename,  function(error, data) {
                        if (error) {
                            console.log('Error:- ' + error);
                            throw error;
                        }
                        fs.writeFile(req.file.path, data, function(error) {
                            if (error) {
                                console.log('Error:- ' + error);
                                throw error;
                            }
                            console.log("done!!");
                        });
                    });

            }); // save
           // console.log(lena)
    })/*.then(data =>{
        const newStructure = new Structure();
        //id: new mongoose.Types.ObjectId(),
        newStructure.filename = req.file.filename;
        newStructure.originalName = req.file.originalname;
        newStructure.description = req.body.description;
        newStructure.name = req.body.name;
        newStructure.ville = req.body.ville;
        newStructure.region = req.body.region;
        newStructure.arrondissement = req.body.arrondissement;
        newStructure.telephone = req.body.telephone;
        newStructure.autorisation = req.body.autorisation;
        newStructure.nomproprio = req.body.nomproprio;
       // newStructure.lat = req.body.lat;
       // newStructure.long = req.body.long;
        newStructure.activite = req.body.activite;
       
        
        newStructure.save(err => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: err
                });
            }
            console.log(newStructure);
            res.status(201).json({ newStructure });
        });
    })*/
    .catch(err => {
        console.error(err);
    }); 
    
  const newStructure = new Structure();
    //id: new mongoose.Types.ObjectId(),
    newStructure.filename = req.file.filename;
    newStructure.originalName = req.file.originalname;
    newStructure.description = req.body.description;
    newStructure.name = req.body.name;
    newStructure.ville = req.body.ville;
    newStructure.region = req.body.region;
    newStructure.arrondissement = req.body.arrondissement;
    newStructure.phone = req.body.phone;
    newStructure.autorisation = req.body.autorisation;
    newStructure.nomproprio = req.body.nomproprio;
    newStructure.lat = req.body.lat;
    newStructure.long = req.body.long;
    newStructure.activite = req.body.activite;
   
    newStructure.save(err => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }
        console.log(newStructure);
        res.status(201).json({ newStructure });
    });
});

router.get('/', (req, res, next) => {
    // use lean() to get a plain JS object
    // remove the version key from the response
    Structure.find({}, '-__v').lean().exec((err, images) => {
        if (err) {
           
            res.status(500).json({
                error: err
            });
        }

        // Manually set the correct URL to each image     for (let i = 0; i < images.length; i++)  imgs.length
        var imgs = images;
        var imgss = imgs.splice(0,64);
        for (let i = 0; i < imgss.length ; i++) {
           // var img = images[i];
           var img = imgss[i];
            img.url = req.protocol + '://' + req.get('host') + '/structure/' + img._id;
        }
        res.json({
            images: imgss,
            count: images.length,
        });
    })
});

//avec le token
router.get('/mballus', (req, res, next) => {
   // console.log(req.params.mballus);
    //const decoded = jwt.verify(req.params.token, 'ericomballus');
   // console.log('bonjour test token');
    // use lean() to get a plain JS object
    // remove the version key from the response
    Structure.find({}, '-__v - __description').exec((err, images) => {
        if (err) {
           
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = 0; i < images.length; i++) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/structure/' + img._id;
        }
        res.json(images);
    })
});

router.get('/retour/:param', (req, res, next) => {
    let param = req.params.param;
    console.log(param);

    Structure.find({'region': param}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = images.length - 1; i >= 0; i--) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/structure/' + img._id;
        }
        res.json(images);
    })
});

//test api

router.get('/test/:param/:param2', (req, res, next) => {
    let param = req.params.param;
    let param2 = req.params.param2;
    // let param3 = req.params.param3;
    console.log(param2);

    Structure.find({'ville': param, 'arrondissement': param2}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = images.length - 1; i >= 0; i--) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/structure/' + img._id;
        }
        res.json(images);
    })
});

router.get('/visite/test/:param/:param2', (req, res, next) => {
    let param = req.params.param;
    let param2 = req.params.param2;
    // let param3 = req.params.param3;
    console.log(param2);

    Structure.find({'name': param, 'arrondissement': param2}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = images.length - 1; i >= 0; i--) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/structure/' + img._id;
        }
        res.json(images);
    })
});

router.get('/articles/:name', (req, res, next) => {
    let param = req.params.name;
    console.log(param);

    Structure.find({'name': param}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = images.length - 1; i >= 0; i--) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/structure/' + img._id;
        }
        res.json(images);
    })
});


router.get('/:id', (req, res, next) => {
    let imgId = req.params.id;
    Structure.findById(imgId, (err, structure) => {
        if (err) {
            res.sendStatus(400);
        }
        // stream the image back by loading the file
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, structure.filename)).pipe(res);
    })
});

// Delete one image by its ID
router.delete('/:id', (req, res, next) => {
    let imgId = req.params.id;

    Structure.findByIdAndRemove(imgId, (err, image) => {
        if (err && image) {
            res.sendStatus(400);
        }

        del([path.join(UPLOAD_PATH, image.filename)]).then(deleted => {
           // res.sendStatus(200).json({ message: 'image supprimé avec succé' });
           res.status(200).json({ message: 'image supprimé avec succé' });
        })
    })
});

router.patch('/:id', (req, res, next)=>{
    const id = req.params.id;
    console.log(req.body);
   const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
   
    Structure.update( {_id: id}, {$set: updateOps})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'produit mise a jour',
            result: result,
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(400).json({
            error: err 
        });
    });
});

module.exports = router;