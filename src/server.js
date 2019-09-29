const mb = require('mountebank');
const settings = require('./settings');
const lotteryService = require('./lottery-service');

const mbServiceInstance = mb.create({
    port: settings.port,
    pidfile: '../mb.pid',
    logfile: '../mb.log',
    protofile: '../protofile.json',
    ipWhitelist: ['*'],
    allowInjection: true
});

mbServiceInstance.then(() => {
    lotteryService.addService();
});