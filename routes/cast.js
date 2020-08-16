const express = require('express');
const DeviceManager = require('../src/core/device-manager');

const router = express.Router();
const deviceManager = new DeviceManager();

router.get('/device', function(req, res, next) {
    res.send(deviceManager.device);
});

router.get('/devices', function(req, res, next) {
    res.send(deviceManager.devices.map(d => d.friendlyName));
});

router.post('/choose-device', function(req, res, next) {
    res.send(deviceManager.chooseDevice(req.body.device));
});

router.get('/health-check-device', function(req, res, next) {
    res.send(deviceManager.getStatus());
});

router.post('/launch-media', function(req, res, next) {
    deviceManager.play(req.body.video, res);
});

router.post('/launch-media-with-subtitles', function(req, res, next) {
    const { subtitles, startTime, video } = req.body;
    deviceManager.playWithSubtitles(subtitles, startTime, video, res);
});

router.post('/play', function(req, res, next) {
    deviceManager.api().resume(err =>
        err ? res.send({ error: 'Failed to resume media on device : ' + deviceManager.api().friendlyName }) : res.end()
    );
});

router.post('/pause', function(req, res, next) {
    deviceManager.api().pause(err =>
        err ? res.send({ error: 'Failed to pause media on device : ' + deviceManager.api().friendlyName }) : res.end()
    );
});

router.post('/stop', function(req, res, next) {
    deviceManager.api().stop(err =>
        err ? res.send({ error: 'Failed to stop media on device : ' + deviceManager.api().friendlyName }) : res.end()
    );
});

router.post('/go-to/:time', function(req, res, next) {
    deviceManager.api().seekTo(req.params.time, err =>
        err ? res.send({ error: 'Failed to got to time [' + req.params.time + '] on media. Device : [' + deviceManager.api().friendlyName + ']' }) : res.end()
    );
});

module.exports = router;
