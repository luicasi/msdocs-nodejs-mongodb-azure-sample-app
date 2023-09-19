const
      express = require('express')
    , router = express.Router()
    , { BlobServiceClient } = require("@azure/storage-blob")
    , blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)
    , containerName = process.env.AZURE_STORAGE_CONTAINER_NAME
    , config = require('../config')
;

router.get('/', async(req, res) => {
  let viewData;
  try{
      const blobs = blobServiceClient.getContainerClient(containerName).listBlobsFlat()
      viewData = {
        title: 'Home',
        viewName: 'pictures',
        accountName: config.getStorageAccountName(),
        containerName: containerName,
        thumbnails:[]
      };
      for await(let blob of blobs){
          viewData.thumbnails.push(blob);
      }
    
    }catch(err){
      viewData = {
          title: 'Error',
          viewName: 'error',
          message: 'There was an error contacting the blob storage container.',
          error: err
        };
        
        res.status(500);
    }
  res.render(viewData.viewName, viewData);
});

router.post('/delete', (req, res) => {

  const containerClient = blobServiceClient.getContainerClient(containerName);

  containerClient.deleteBlob(req.body.file)
  .then(
      ()=>{
          res.redirect('/pictures');
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
