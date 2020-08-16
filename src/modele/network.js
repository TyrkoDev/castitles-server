class Network {
    constructor() {
        this.ip = undefined;
        this.ifaces = require('os').networkInterfaces();
    }

    getIp() {
        if (!this.ip) {
            for (let dev in this.ifaces) {
                this.ifaces[dev].forEach((details) =>
                    details.family === 'IPv4' && details.internal === false ? this.ip = details.address: undefined);
            }
        }

        return this.ip;
    }

    buildUrlToFile(file) {
        return 'http://' + this.getIp() + ':3000/file-manager/file/' + file;
    }
}

module.exports = Network
