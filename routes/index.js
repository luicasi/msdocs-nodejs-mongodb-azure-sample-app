var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
      if (req.session.user)
            res.render('index');
      else 
            res.render('login');
});

router.get('/login', function(req, res, next) {
      res.render('login', {message: req.query.message});
});

router.post('/login', express.urlencoded({ extended: false }), function (req, res) {
      // login logic to validate req.body.user and req.body.pass
      // would be implemented here. for this example any combo works
    
      if (req.body.user != "ale" || req.body.pass != "alb000"){
        res.render('login', {message: "Credenziali non valide"});
        return;
      }
  
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err)
    
        // store user information in session, typically a user id
        req.session.user = req.body.user
    
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err)
          res.redirect('/')
        })
      })
    })
  
module.exports = router;
