const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
//const del = require('del');
const path = require('path');

const Secteuractivite = require('../models/secteuractivite');

const router = express.Router();


 router.post('/', (req, res, next) => {
   console.log(req.body.activite)
    const secteuractivite = new Secteuractivite({
        _id: new mongoose.Types.ObjectId(),
        activite: req.body.activite
      });
      secteuractivite
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
    Secteuractivite.find({}, '-__v').lean().exec((err, result) => {
        if (err) {
           
            res.sendStatus(400);
        }

        res.status(200).json({
            activités: result,
        });
    })
});

router.delete('/:id', (req, res, next) => {
    Secteuractivite.remove({ _id: req.params.id })
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