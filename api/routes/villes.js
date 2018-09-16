const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
//const del = require('del');
const path = require('path');

const Ville = require('../models/ville');

const router = express.Router();


 router.post('/', (req, res, next) => {
   console.log(req.body.ville)
    const vill = new Ville({
        _id: new mongoose.Types.ObjectId(),
        ville: req.body.ville
      });
      vill
      .save()
              .then(result => {
               
                res.status(201).json({
                  message: 'bonjour',
                  resultat: result
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: 'desolé message serveur',
                 
                });
              });
});

router.get('/', (req, res, next) => {
    // use lean() to get a plain JS object
    // remove the version key from the response
    Ville.find({}, '-__v').lean().exec((err, result) => {
        if (err) {
           
            res.sendStatus(400);
        }

        res.status(200).json({
            villes: result,
        });
    })
});

router.delete('/:id', (req, res, next) => {
  Ville.remove({ _id: req.params.id })
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