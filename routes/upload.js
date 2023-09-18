const
      express = require('express')
    , router = express.Router()

    , multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

    , getStream = require('into-stream')
    , containerName = process.env.AZURE_STORAGE_CONTAINER_NAME
    , { BlockBlobClient } = require('@azure/storage-blob')
;

const handleError = (err, res) => {
    res.status(500);
    res.render('error', { error: err });
};

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};

router.post('/', uploadStrategy, (req, res) => {

    const
          blobName = getBlobName(req.file.originalname)
        , blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING,containerName,blobName)
        , stream = getStream(req.file.buffer)
        , streamLength = req.file.buffer.length
    ;

    blobService.uploadStream(stream, streamLength)
    .then(
        ()=>{
            res.redirect('/');
        }
    ).catch(
        (err)=>{
        if(err) {
            handleError(err);
            return;
        }
    })
});

module.exports = router;