const express = require('express');
const router = express.Router();

// GET Q&A page
router.get('/', (req, res) => {
    res.render('qa', {
        pageTitle: 'Farmer\'s Q&A',
        path: '/qa',
        isAuthenticated: req.session.isLoggedIn
    });
});

module.exports = router; 