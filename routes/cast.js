const express = require('express');
const router = express.Router();
const ChromecastAPI = require('chromecast-api');
const client = new ChromecastAPI();
const path = require('path');

let devices = [];
let device;
let ip, ifaces = require('os').networkInterfaces();
for (let dev in ifaces) {
    ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? ip = details.address: undefined);
}

client.on('device', function (d) {
  devices.push(d);
});

router.get('/device', function(req, res, next) {
    res.send(device);
});

router.get('/devices', function(req, res, next) {
    res.send(devices.map(d => d.friendlyName));
});

router.post('/choose-device', function(req, res, next) {
    device = devices.find(d => d.friendlyName === req.body.device);
    res.send(device);
});

router.post('/launch-media', function(req, res, next) {
    const mediaURL = 'http://' + ip + ':3000/file-manager/file/' + req.body.video;

    device.play(mediaURL, err => {
        if (!err) {
            res.end(); 
        }
        else {
            res.send({ error: 'Failed to launch media on device : ' + device.friendlyName });            
        }
    });
});

router.post('/launch-media-with-subtitles', function(req, res, next) {
    const { subtitles, startTime, video } = req.body;

    const media = {
        url: 'http://' + ip + ':3000/file-manager/file/' + video,
        subtitles: [{
            language: 'en-US',
            url: 'http://' + ip + ':3000/file-manager/file/' + subtitles + '.vtt',
            name: 'English'
        }]
    };

    device.play(media, { startTime }, err =>  {
        if (!err) {
            res.end(); 
        }
        else {
            res.send({ error: 'Failed to launch media on device : ' + device.friendlyName });            
        }
    });
});

router.post('/play', function(req, res, next) {
    device.resume(err =>  {
        if (!err) {
            res.end(); 
        }
        else {
            res.send({ error: 'Failed to resume media on device : ' + device.friendlyName });            
        }
    });
});

router.post('/pause', function(req, res, next) {
    device.pause(err =>  {
        if (!err) {
            res.end(); 
        }
        else {
            res.send({ error: 'Failed to pause media on device : ' + device.friendlyName });            
        }
    });
});

router.post('/stop', function(req, res, next) {
    device.stop(err =>  {
        if (!err) {
            res.end(); 
        }
        else {
            res.send({ error: 'Failed to stop media on device : ' + device.friendlyName });            
        }
    });
});

router.post('/go-to/:time', function(req, res, next) {
    device.seekTo(req.params.time, err =>  {
        if (!err) {
            res.end(); 
        }
        else {
            res.send({ error: 'Failed to got to time [' + time + '] on media. Device : [' + device.friendlyName + ']' });            
        }
    });
});

module.exports = router;
  