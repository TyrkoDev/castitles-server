const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const srt2vtt = require('srt2vtt');

const pathToFiles = path.resolve(__dirname, '..') + '\\tmp\\';

router.post('/', function(req, res, next) {
  let { file } = req.files;

  file.mv(pathToFiles + file.name);

  fs.readdir(pathToFiles, (err, files) => {
    if (err) throw err;

    if (path.extname(file.name) === '.srt') {
      let srtData = fs.readFileSync(pathToFiles + file.name);
      srt2vtt(srtData, (err, vttData) => {
        if (err) {
          res.send({ error: 'Unable to convert file [' + file.name + '] to vtt' }); 
        }
        fs.writeFileSync(pathToFiles + path.basename(file.name, path.extname(file.name)) + '.vtt', vttData);
        
        for (const f of files) {
          if ((path.extname(f) === path.extname(file.name) && f !== file.name) || path.extname(file.name) === '.srt') {
            fs.unlink(path.join(pathToFiles, f), err => {
              if (err) throw err;
            });
          }
        }
        res.end();
      });
    } else {
      file.mv(pathToFiles + file.name);
      res.end();
    }
  });
});

router.get('/file/:name', function(req, res, next) {
  let { name } = req.params;
  const pathToFile = pathToFiles + name;
  res.download(pathToFile);
});

module.exports = router;
