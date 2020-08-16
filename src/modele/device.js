const DeviceApi = require('chromecast-api/lib/device');

class Device {
    constructor () {
        this.status = 'not_connected';
        this.deviceApi = new DeviceApi({
            name: '',
            friendlyName: '',
            host: null
        });
    }
}

class Singleton {

    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new Device();
        }
    }

    getInstance() {
        return Singleton.instance;
    }

}

module.exports = Singleton
