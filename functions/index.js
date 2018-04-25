const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);

const database = firebaseApp.database();

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));

const handlebars = require("express-handlebars").create({ defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/', (request,response) => {
  response.render('home');
})

app.get('/jobpost', (request, response) => {
  response.render('jobpost')
});

app.get('/303', (request, response) => {
  response.render('303')
})

app.post('/formSubmission', (request, response) => {
  firebaseApp.database().ref(request.body.username).set({
    company: request.body.companyName,
    email: request.body.email,
    jobPosition: request.body.jobPosition,
    jobDescription: request.body.jobDescription,
    jobUrl: request.body.jobUrl,
    stoken: request.body.stripeToken

  })

  response.redirect(303, '303');
})

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
