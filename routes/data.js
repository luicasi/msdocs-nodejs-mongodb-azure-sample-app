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

router.get('/dates_list', async function(req, res, next) 
{
    if (req.session.user == undefined){
        res.json(failure("Non autorizzato"));
        return;
    }

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
                    data.push({date: dt, status: 0, openPictures: 0, totalPictures: 0});
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

router.get('/pictures_list', async function(req, res, next) 
{
    if (req.session.user == undefined){
        res.json(failure("Non autorizzato"));
        return;
    }

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

router.post('/add_not_working_day', async function(req, res, next) 
{
    if (req.session.user == undefined){
        res.json(failure("Non autorizzato"));
        return;
    }

    const date = req.body.date;
    const createdDate = Date.now();
  
    var day = await Day.findOne({ 'date': date });
    if (day)
    {
        res.json(failure("Data già presente in archivio [" + date + "]"));
        return;
    }

    day = new Day({
        date: date,
        status: 3,
        createdDate: createdDate
    });

    try {
        await day.save();
        console.log(`Added new day ${date}`)
        res.json({success: true, data: getBasicData(day)});
    }
    catch (err) {
        console.log(err);
        res.json(failure(err.message));
    }
});

router.post('/add_empty_day', async function(req, res, next) 
{
    if (req.session.user == undefined){
        res.json(failure("Non autorizzato"));
        return;
    }

    const date = req.body.date;
    const createdDate = Date.now();
    
    var day = await Day.findOne({ 'date': date });
    if (day)
    {
        res.json(failure("Data già presente in archivio [" + date + "]"));
        return;
    }

    var day = new Day({
      date: date,
      status: 4,
      createdDate: createdDate
    });
  
    try {
        await day.save();
        console.log(`Added new day ${date}`)
        res.json({success: true, data: getBasicData(day)});
    }
    catch (err) {
        console.log(err);
        res.json(failure(err.message));
    }
  });
  
  router.post('/add_picture', uploadStrategy, async function(req, res, next) 
  {
    if (req.session.user == undefined){
        res.json(failure("Non autorizzato"));
        return;
    }

    const date = req.body.date;
    const createdDate = Date.now();
    
    var day = await Day.findOne({ 'date': date });
    if (!day)
    {
        day = new Day({
            date: date,
            status: 1,
            createdDate: createdDate
        });   
    }
    else {
        if (day.status != 1){
            res.status(500);
            res.send("Stato non valido per la data [" + day.status + "]");
            return;
        }    
    }

    console.log(req.file);

    const name = date + "_" + day.pictures.length + path.extname(req.file.originalname);
    const
        blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING, containerName, name)
        , stream = getStream(req.file.buffer)
        , streamLength = req.file.buffer.length
    ;

    try {
        await blobService.uploadStream(stream, streamLength);
        const picture = {name: name, status: 0};
        day.pictures.push(picture);

        await day.save();

        console.log(`Saved day ${date}`)
        res.json({success: true, picture}); 
    }
    catch (err){
        console.log(err);
        res.status(500);
        res.send(err.message);
    }
});
  
router.post('/set_day_done', async function(req, res, next) 
{
    if (req.session.user == undefined){
        res.json(failure("Non autorizzato"));
        return;
    }

    const date = req.body.date;
    
    var day = await Day.findOne({ 'date': date });
    if (!day)
    {
        res.json(failure("Data non trovata in archivio [" + date + "]"));
        return;
    }

    if (day.status != 1){
        res.json(failure("Stato non valido per la data [" + day.status + "]"));
        return;
    }

    day.status = 2;
    day.updatedDate = Date.now();

    try {
        await day.save();
        console.log(`Saved day ${date}`)
        res.json({success: true, data: getBasicData(day)}); 
    }
    catch (err) {
        console.log(err);
        res.json(failure(err.message));
    }
});

router.post('/set_picture_done', async function(req, res, next) 
{
    if (req.session.user == undefined){
        res.json(failure("Non autorizzato"));
        return;
    }

    const date = req.body.date;
    const name = req.body.name;
    
    var day = await Day.findOne({ 'date': date });
    if (!day)
    {
        res.json(failure("Data non trovata in archivio [" + date + "]"));
        return;
    }

    if (day.status != 1){
        res.json(failure("Stato non valido per la data [" + day.status + "]"));
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
        res.json(failure("Immagine non trovata [" + name + "]"));
        return;
    }

    try {
        await day.save();
        console.log(`Saved day ${date}`)
        res.json({success: true}); 
    }
    catch (err){
        console.log(err);
        res.json(failure(err.message));
    }
});

router.post('/delete_date', function(req, res, next) 
{
    if (req.session.user == undefined){
        res.json(failure("Non autorizzato"));
        return;
    }

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
