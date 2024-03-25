let express = require('express');
let router = express.Router();

// get index page
router.get('/', function(req, res, next) {
  res.render('index', { 
  title: 'Freelance Work Tracker',
  purpose: 'Purpose of this page is to track the freelance work.', 
  img: 'images/overwhelmed.png',});
});

// get case page
router.get('/case', async(req, res) => {

 let Cases = require('../models/case');
//  sort by the date
 let cases = await Cases.find().sort({ 'date': -1 });

//  render the case page
 res.render('case', {
 cases: cases,
 });
 });


module.exports = router;
