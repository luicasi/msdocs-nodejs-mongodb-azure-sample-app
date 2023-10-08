var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
      if (req.session.user)
            res.render('index', {isAdmin: req.session.user == "admin", isUser: req.session.user == "user"});
      else 
            res.render('login');
});

router.get('/login', function(req, res, next) {
      res.render('login', {message: req.query.message});
});

router.post('/login', express.urlencoded({ extended: false }), function (req, res) {
      // login logic to validate req.body.user and req.body.pass
      // would be implemented here. for this example any combo works
    
      var user = "";

      if (req.body.pass == "alb000"){
        user = "admin";
      }
      else if (req.body.pass == "sh123"){
        user = "user";
      }
      else {
        res.render('login', {message: "Credenziali non valide"});
        return;
      }
  
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err)
    
        // store user information in session, typically a user id
        req.session.user = user
    
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err)
          res.redirect('/')
        })
      })
    })
  
router.get("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out')
      } else {
        res.redirect('/')
      }
    });
  } else {
    res.end()
  }

});

module.exports = router;
