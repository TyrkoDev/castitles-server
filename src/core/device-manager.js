const ChromecastAPI = require('chromecast-api');
const Device = require('../modele/device');
const Network = require('../modele/network');
const client = new ChromecastAPI();

class DeviceManager {
    constructor() {
        this.devices = [];
        this.device = new Device();
        this.network = new Network();

        client.on('device', (deviceDetected) => {
            this.devices.push(deviceDetected);
        });

        client.on('status', (status) => {
            this.device.getInstance().status = status;
        });

        client.on('finished', (value) => {
            console.log(value);
        });
    }

    chooseDevice(name) {
        this.device.getInstance().deviceApi = this.devices.find(d => d.friendlyName === name);
        return this.device.getInstance();
    }

    api() {
        return this.device.getInstance().deviceApi;
    }

    getStatus() {
        return this.device.getInstance().status;
    }

    requestPlayOnCast(media, res, startTime = 0) {
        this.device.getInstance().deviceApi.play(media, { startTime }, err => {
            if (!err) {
                res.end();
            }
            else {
                res.send({ error: 'Failed to launch media on device : ' + this.device.getInstance().deviceApi.friendlyName });
            }
        });
    }

    play(file, res) {
        const mediaURL = this.network.buildUrlToFile(file);
        this.requestPlayOnCast(mediaURL, res);
    }

    playWithSubtitles(subtitles, startTime, file, res) {
        const media = {
            url: this.network.buildUrlToFile(file),
            subtitles: [{
                language: 'en-US',
                url: this.network.buildUrlToFile(subtitles) + '.vtt',
                name: 'English'
            }]
        };

        this.requestPlayOnCast(media, res, startTime);
    }
}

module.exports = DeviceManager


