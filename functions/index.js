const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const stripe = require("stripe")("sk_test_IOqUUmheBCzexCbNcCnHmPNQ");

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

function getPosts () {
  const ref = firebaseApp.database().ref();
  return ref.once('value').then(snap => snap.val())
};

app.get('/', (request,response) => {
  getPosts().then(posts => {
    response.render('home', {posts})
  })
  //response.render('home');
})

app.get('/jobpost', (request, response) => {
  response.render('jobpost')
});

app.get('/303', (request, response) => {
  response.render('303')
})

app.get('/400', (request, response) => {
  response.render('400')
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
  const token = request.body.stripeToken; // Using Express


  stripe.customers.create({
    email: request.body.stripeEmail,
    source: token
  })
  .then(customer => stripe.charges.create({
    amount: 2500,
    description: 'Example charge',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => response.redirect(303, '303'))
  .catch(err => response.redirect(400,'404'))
  //.catch(err => {
  //  response.status(400).json({ errors: JSON.stringify(err) })
  //})

})

exports.app = functions.https.onRequest(app);





// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
