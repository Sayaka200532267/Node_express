let express = require('express');
let router = express.Router();

let Cases = require('../models/case');

let authCheck = require('../authCheck');

// get the details page
router.get('/details', async(req, res) => {

    let Cases = require('../models/case');
    let cases = await Cases.find().sort({ 'date': -1 });

    res.render('details', {
        cases: cases,
        user: req.user
    });
});

// render the details page
router.get('/details/:_id', async (req, res) => {
    let Cases = require('../models/case');
    let cases = await Cases.find().sort({ 'date': -1 });
   
    res.render('details', {
        title: 'Cases',
        cases: cases,
        user: req.user
    });
});

// get the create page
router.get('/create', authCheck, async (req, res) => {
    let Cases = require('../models/case');
    let cases = await Cases.find().sort({ 'date': -1 });
    res.render('create', {
        title: 'Create New Case',
        user: req.user,
        cases: cases
    });
});

// post the create page
router.post('/create', authCheck, async (req, res) => {

    await Cases.create(req.body);

    res.redirect('/details');
  });
  
// render the delete function
router.get('/delete/:_id', authCheck, async (req, res) => {
     
    let cases = await Cases.findById(req.params._id);

    if (req.user.username !== cases.username) {
        res.redirect('/unauthorized');
        return;
    }
    else {
        await cases.deleteOne({ _id: cases._id });

 
        res.redirect('/details');
    }
});

// get the edit page
router.get('/edit/:_id', authCheck, async (req, res) => {

    let cases = await Cases.findById(req.params._id);

    
    if (req.user.username !== cases.username) {
        res.redirect('/unauthorized');
        return;
    } else {
       
        res.render('edit', {
            title: 'Edit Post',
            cases: cases,
            user: req.user
        });
    }
});

// post the edit page
router.post('/edit/:_id', authCheck, async (req, res) => {
 
    await Cases.findByIdAndUpdate(req.params._id, req.body);

    res.redirect('/details');
});



module.exports = router;