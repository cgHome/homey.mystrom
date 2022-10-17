'use strict';

const Homey = require('homey');

module.exports = class Driver extends Homey.Driver {

  onInit(options = {}) {
    super.onInit();
    this.debug('Driver init...');
  }

  // Homey-App Loggers
  log(msg) {
    this.homey.app.log(`${this._logLinePrefix()} ${msg}`);
  }

  error(msg) {
    this.homey.app.error(`${this._logLinePrefix()} ${msg}`);
  }

  debug(msg) {
    this.homey.app.debug(`${this._logLinePrefix()} ${msg}`);
  }

  _logLinePrefix() {
    return `${this.constructor.name} >`;
  }

};
