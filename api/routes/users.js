const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const del = require('del');
const path = require('path');
var Jimp = require('jimp');
const fs = require('fs');
//const passport = require('passport');

const User = require("../models/user");
const Structure = require('../models/structure');
const io = require('socket.io');

let UPLOAD_PATH = 'uploads';


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
}) 
 let upload1 = multer({ storage: storage });

router.post('/', upload1.single('image'), (req, res, next) => {
  console.log(req.body)
 
  User.find({ 'name': req.body.name })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        const response = {
          message2: 'cet utilisateur existe deja mballus',
        }
        console.log(response);
        return res.status(409).json({
          message2: 'cet utilisateur existe deja mballus'
        });     //status(409).
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {

            //Jimp gestion du logo
           Jimp.read(req.file.path)
            .then(lenna => {
                return lenna
                    .resize(350, 350) // resize
                    .quality(80) // set JPEG quality
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
            })
    .catch(err => {
        console.error(err);
    }); 


  const user = new User({
     _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      password: hash,
      phone: req.body.phone,
      filename: req.file.filename,
      originalName: req.file.originalname,
      arrondissement: req.body.arrondissement,
      ville: req.body.ville,
      activite: req.body.activite,
      nomproprio: req.body.nomproprio,
      datecreation: req.body.datecreation,
      userLogo: req.file.path,
      lat: req.body.lat,
      long: req.body.long,
      desc:req.body.description
        });
    user
    .save()
    .then(result => {
               
    res.status(201).json({
    user: result,
    message: 'bonjour'
    });
    })
   .catch(err => {
    console.log(err);
    res.status(500).json({
    error: 'desolé message serveur',            
    });
      });
        }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
    User.find({ name: req.body.name })
      .exec()
      .then(user => {
        console.log(user)
        if (user.length < 1) {
          console.log("pas de compte");
          return res.status(401).json({
            message: "Auth failed",
            message2: 401
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                userId: user[0]._id,
                name: user[0].name,
                phone: user[0].phone
              },
              
              'ericomballus',
             // process.env.JWT_KEY,
              {
                  expiresIn: "1h"
              }
            );
           
          let logo = user[0];
          logo.url = req.protocol + '://' + req.get('host') + '/user/logouser/' + logo._id;
           
            if(user[0].name === 'admin'){
              return res.status(201).json({
               token: token,
               message: '200',
               logouser: user[0].url,
              });
            }
             return res.status(200).json({
               token: token,
               message: '201',
               logouser: user[0].url,
               userData: user[0]
             });
            
          }
          res.status(402).json({
            message: "nom utilisateur invalide"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  router.get('/logouser/:id', (req, res, next) => {
    let imgId = req.params.id;
  
    User.findById(imgId, (err, resultat) => {
        if (err) {
            res.sendStatus(400);
        }
        // stream the image back by loading the file
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, resultat.filename)).pipe(res);
    })
  });

  router.get('/', (req, res, next) => {
    // use lean() to get a plain JS object
    // remove the version key from the response
    User.find({},  '-password').lean().exec((err, images) => {
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
            img.url = req.protocol + '://' + req.get('host') + '/user/logouser/' + img._id;
        }
        res.json({
            images: imgss,
            count: images.length,
        });
    })
});

router.get('/test/:param/:param2/:param3', (req, res, next) => {
  let param = req.params.param;
  let param2 = req.params.param2;
  let param3 = req.params.param3;
  // let param3 = req.params.param3;
  console.log(param2);

  User.find({'ville': param, 'arrondissement': param2, 'activite': param3}, '-__v').lean().exec((err, images) => {
      if (err) {
          res.sendStatus(400);
      }

      // Manually set the correct URL to each image
      for (let i = images.length - 1; i >= 0; i--) {
          var img = images[i];
          img.url = req.protocol + '://' + req.get('host') + '/user/logouser/' + img._id;
      }
      res.json(images);
  })
});

router.get('/visite/test/:param/:param2', (req, res, next) => {
  let param = req.params.param;
  let param2 = req.params.param2;
  // let param3 = req.params.param3;
  console.log(param2);

  User.find({'name': param, 'arrondissement': param2}, '-__v').lean().exec((err, images) => {
      if (err) {
          res.sendStatus(400);
      }

      // Manually set the correct URL to each image
      for (let i = images.length - 1; i >= 0; i--) {
          var img = images[i];
          img.url = req.protocol + '://' + req.get('host') + '/logopubs/' + img._id;
      }
      res.json(images);
  })
});

router.get('/articles/:name', (req, res, next) => {
  let param = req.params.name;
  console.log(param);

  User.find({'name': param}, '-__v').lean().exec((err, images) => {
      if (err) {
          res.sendStatus(400);
      }

      // Manually set the correct URL to each image
      for (let i = images.length - 1; i >= 0; i--) {
          var img = images[i];
          img.url = req.protocol + '://' + req.get('host') + '/logopubs/' + img._id;
      }
      res.json(images);
  })
});

router.delete("/:id", (req, res, next) => {

  let imgId = req.params.id;

 /* User.findByIdAndRemove(imgId, (err, image) => {
      if (err && image) {
          res.sendStatus(400);
      }

      del([path.join(UPLOAD_PATH, image.filename)]).then(deleted => {
         // res.sendStatus(200).json({ message: 'image supprimé avec succé' });
         res.status(200).json({ message: 'image supprimé avec succé' });
      })
  })*/
  User.remove({ _id: req.params.id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router; 