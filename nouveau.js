
//créer une annotation

const express = require('express');
const app = express();

// Point de terminaison pour créer une annotation
app.post('/annotations', (req, res) => {
  // Code pour créer une nouvelle annotation
});

// Autres points de terminaison pour récupérer des annotations
// ...

// Démarrage du serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});

//schema pour les annotations

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnotationSchema = new Schema({
  resource: String,
  comment: String,
  rating: Number,
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Annotation'
  }
});

const Annotation = mongoose.model('Annotation', AnnotationSchema);

module.exports = Annotation;


//récupérer toutes les annotations

//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
/*
const AnnotationSchema = new Schema({
  resource: String,
  comment: String,
  rating: Number,
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Annotation'
  }
});*/

//const Annotation = mongoose.model('Annotation', AnnotationSchema);

//module.exports = Annotation;

//format de données 

app.get('/annotations', (req, res) => {
  Annotation.find()
    .then(annotations => {
      // Négociation de contenu
      const negotiator = new Negotiator(req);
      const mediaType = negotiator.mediaType(['application/json', 'application/xml']);

      // Envoi des données dans le format approprié
      switch (mediaType) {
        case 'application/json':
          res.json(annotations);
          break;
        case 'application/xml':
          const xml = convertToXML(annotations);
          res.type('application/xml');
          res.send(xml);
          break;
        default:
          res.status(415).send('Format de données non supporté');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Erreur du serveur');
    });
});


//impportation des données depuis un serveur tiers 

const axios = require('axios');
//const Annotation = require('./models/annotation');

// Point de terminaison pour importer des annotations depuis un serveur tiers
app.get('/import', (req, res) => {
  axios.get('http://serveur-tiers.com/annotations')
    .then(response => {
      // Traitement des données renvoyées par le serveur tiers
      const importedAnnotations = response.data.map(data => ({
        resource: data.resource,
        comment: data.comment,
        rating: data.rating
      }));

      // Insertion des annotations importées dans la base de données locale
      Annotation.insertMany(importedAnnotations)
        .then(() => {
          res.send('Annotations importées avec succès');
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Erreur du serveur');
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Erreur du serveur');
    });
});

