const
      express = require('express')
    , router = express.Router()

    , multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({ storage: inMemoryStorage }).single('file')

    , getStream = require('into-stream')
    , containerName = process.env.AZURE_STORAGE_CONTAINER_NAME
    , { BlockBlobClient } = require('@azure/storage-blob')
    , path = require('path')
    , general = require('../config/general')
    , dateFns = require("date-fns")
    , config = require('../config')
;

var Day = require('../models/day');

function getBasicData(day) {
    return {date: day.date, status: day.status, openPictures: day.pictures.filter(i => i.status == 0).length, totalPictures: day.pictures.length};
}

function failure(message) {
    return {success: false, message: message}
}

router.get('/dates_list', async function(req, res, next) {
    const opt = req.query.opt;

    var data = [];

    if (opt == undefined || opt == null || opt == "" || opt == "0" || opt == "1"){
        const DataInizioAnno = new Date(2023, 8, 12);
        var d = DataInizioAnno;
        const oggi = Date.now();

        while (d <= oggi){
            if (d.getDay() != 0 && d.getDay() != 6){                
                const dt = dateFns.format(d, "yyyyMMdd");
                const day = await Day.findOne({ 'date': dt });
                if (day){
                    if (day.status == 1 || opt == "1"){
                        data.push(getBasicData(day));
                    }
                }
                else {
                    data.push({date: dt, status: 0, openPictures: 0, closedPictures: 0});
                }
            }
            d.setDate(d.getDate() + 1);
        }
        res.json({success: true, data: data});
        return;
    }
    else if (opt == "2"){
        try {
            const days = await Day.find();
            res.json({success: true, data: days});
        }
        catch (err) {
            console.log(err);
            res.json(failure(err.message));
        }
    }
});

router.get('/pictures_list', async function(req, res, next) {
    const date = req.query.date;

    const day = await Day.findOne({ 'date': date });
    if (day) {
        var data = {day: {date: date, status: day.status, accountName: config.getStorageAccountName(), containerName: containerName}, pictures: []};
        for (const picture of day.pictures){
            data.pictures.push({name: picture.name, status: picture.status});
        }
        res.json({success: true, data: data});
    }
    else {
        res.json(failure("date not found [" + date + "]"));
    }
});

router.post('/add_not_working_day', function(req, res, next) {
  const date = req.body.date;
  const createdDate = Date.now();
  
  //todo: verificare che la data non esista

  var day = new Day({
    date: date,
    status: 3,
    createdDate: createdDate,
    pictures: []
    });

  day.save()
      .then(() => { 
        console.log(`Added new day ${date}`)
        res.json({success: true, data: getBasicData(day)}); })
      .catch((err) => {
          console.log(err);
          res.json(failure(err.message));
      });
});

router.post('/add_empty_day', function(req, res, next) {
    const date = req.body.date;
    const createdDate = Date.now();
    
  //todo: verificare che la data non esista

  var day = new Day({
      date: date,
      status: 4,
      createdDate: createdDate,
      pictures: []
    });
  
    day.save()
        .then(() => { 
          console.log(`Added new day ${date}`)
          res.json({success: true, data: getBasicData(day)}); })
          .catch((err) => {
            console.log(err);
            res.json(failure(err.message));
        });
  });
  
  router.post('/add_picture', uploadStrategy, function(req, res, next) {
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
                res.status(500);
                res.send("wrong status for date [" + day.status + "]");
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

        console.log(req.file);

        const name = date + "_" + index + path.extname(req.file.originalname);
        const
            blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING, containerName, name)
            , stream = getStream(req.file.buffer)
            , streamLength = req.file.buffer.length
        ;

        blobService.uploadStream(stream, streamLength)
        .then(
            ()=>{
                const picture = {name: name, status: 0};
                day.pictures.push(picture);

                day.save()
                .then(() => { 
                    console.log(`Saved day ${date}`)
                    res.json({success: true, picture}); 
                })
                  .catch((err) => {
                      console.log(err);
                      res.status(500);
                      res.send(err.message);
                  });      
                    })
            .catch((err) => {
                console.log(err);
                res.status(500);
                res.send(err.message);
      });      
    })
    .catch((err) => {
        console.log(err);
        res.status(500);
        res.send(err.message);
});
});
  
router.post('/set_day_done', function(req, res, next) {
    const date = req.body.date;
    
    Day.find()
    .then(days => {
        const d1 = days.filter(item => item.date == date);
        if (d1.length == 0) {
            res.json(failure("date not found [" + date + "]"));
            return;
        }

        const day = d1[0];
        if (day.status != 1){
            res.json(failure("wrong status for date [" + day.status + "]"));
            return;
        }

        day.status = 2;
        day.updatedDate = Date.now();

        day.save()
        .then(() => { 
            console.log(`Saved day ${date}`)
            res.json({success: true, data: getBasicData(day)}); 
        })
        .catch((err) => {
            console.log(err);
            res.json(failure(err.message));
        });      
    })
    .catch((err) => {
        console.log(err);
        res.json(failure(err.message));
    });
});

router.post('/set_picture_done', function(req, res, next) {
    const date = req.body.date;
    const name = req.body.name;
    
    Day.find()
    .then(days => {
        const d1 = days.filter(item => item.date == date);
        if (d1.length == 0) {
            res.json(failure("date not found [" + date + "]"));
            return;
        }

        const day = d1[0];
        if (day.status != 1){
            res.json(failure("wrong status for date [" + day.status + "]"));
            return;
        }

        var pictureFound = false;
        for (var i = 0; i < day.pictures.length; i++)
        {
            if (day.pictures[i].name == name){
                day.pictures[i].status = 1;
                pictureFound = true;
            }
        }

        if (!pictureFound){
            res.json(failure("picture not found [" + name + "]"));
            return;
        }

        day.save()
        .then(() => { 
            console.log(`Saved day ${date}`)
            res.json({success: true}); })
          .catch((err) => {
              console.log(err);
              res.json(failure(err.message));
          });      
    })
    .catch((err) => {
        console.log(err);
        res.json(failure(err.message));
    });
});

router.post('/delete_date', function(req, res, next) {
    const dayId = req.body._id;
    Day.findByIdAndDelete(dayId)
      .then(() => { 
        console.log(`Deleted day $(dayId)`)      
        res.json({success: true}); })
      .catch((err) => {
        console.log(err);
        res.json(failure(err.message));
      });
  });
  
  
module.exports = router;
