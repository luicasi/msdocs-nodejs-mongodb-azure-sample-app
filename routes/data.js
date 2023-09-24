var express = require('express');
var Day = require('../models/day');

var router = express.Router();

/* GET home page. */
router.get('/list', function(req, res, next) {
  Day.find()
    .then((days) => {      
      res.json({success: true, data: days});
    })
    .catch((err) => {
      console.log(err);
      res.json({success: false, message: err.Description});
    });
});


router.post('/add_not_working_day', function(req, res, next) {
  const date = req.body.date;
  const createdDate = Date.now();
  
  var day = new Day({
    date: date,
    status: 3,
    createdDate: createdDate,
    pictures: []
    });

  day.save()
      .then(() => { 
        console.log(`Added new day ${date}`)
        res.json({success: true}); })
      .catch((err) => {
          console.log(err);
          res.json({success: false, message: err.Description});
      });
});

router.post('/add_empty_day', function(req, res, next) {
    const date = req.body.date;
    const createdDate = Date.now();
    
    var day = new Day({
      date: date,
      status: 4,
      createdDate: createdDate,
      pictures: []
    });
  
    day.save()
        .then(() => { 
          console.log(`Added new day ${date}`)
          res.json({success: true}); })
        .catch((err) => {
            console.log(err);
            res.json({success: false, message: err.Description});
        });
  });
  
  router.post('/add_picture', function(req, res, next) {
    const date = req.body.date;
    const createdDate = Date.now();
    
    Day.find()
    .then(days => {
        const d1 = days.filter(item => item.date == date);
        var day;
        var index = 0;
        if (d1.length > 0) {
            day = d1[0];
            if (day.status != 1){
                res.json({success: false, message: "wrong status for date [" + day.status + "]"});
                return;
            }

            index = day.pictures.length;
        }
        else {
            day = new Day({
                date: date,
                status: 1,
                createdDate: createdDate
            });                    
        }
        day.pictures.push({name: date + "_" + index, status: 0});

        day.save()
        .then(() => { 
            console.log(`Saved day ${date}`)
            res.json({success: true}); })
          .catch((err) => {
              console.log(err);
              res.json({success: false, message: err.Description});
          });      
    })
    .catch((err) => {
        console.log(err);
        res.json({success: false, message: err.Description});
    });
});

  
router.post('/set_picture_done', function(req, res, next) {
    const date = req.body.date;
    const name = req.body.name;
    
    Day.find()
    .then(days => {
        const d1 = days.filter(item => item.date == date);
        if (d1.length == 0) {
            res.json({success: false, message: "date not found [" + date + "]"});
            return;
        }

        const day = d1[0];
        if (day.status != 1){
            res.json({success: false, message: "wrong status for date [" + day.status + "]"});
            return;
        }

        var pictureFound = false;
        var anyZero = false;
        for (var i = 0; i < day.pictures.length; i++)
        {
            if (day.pictures[i].name == name){
                day.pictures[i].status = 1;
                pictureFound = true;
            }
            else if (day.pictures[i].status == 0){
                anyZero = true;
            }
        }

        if (!pictureFound){
            res.json({success: false, message: "picture not found [" + name + "]"});
            return;
        }

        if (!anyZero){
            day.status = 2;
            day.updatedDate = Date.now();
        }

        day.save()
        .then(() => { 
            console.log(`Saved day ${date}`)
            res.json({success: true}); })
          .catch((err) => {
              console.log(err);
              res.json({success: false, message: err.Description});
          });      
    })
    .catch((err) => {
        console.log(err);
        res.json({success: false, message: err.Description});
    });
});

module.exports = router;
