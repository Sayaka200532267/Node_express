const express = require('express');
const router = express.Router();



router.get('/', function(req, res, next) {
  res.render('index', { 
  title: 'Freelance Work Tracker',
  purpose: 'Purpose of this page is to track the freelance work.', 
  img: 'images/overwhelmed.png',
  backgroundColor: 'background-color: #f8f9fa'});
});



router.get('/case', async(req, res) => {

 let Cases = require('../models/case');
 let cases = await Cases.find().sort({ 'date': -1 });


 res.render('case', {
 cases: cases,
 });
 });


module.exports = router;
