'use strict';

const Device = require('../device');

module.exports = class ButtonDevice extends Device {

  async onInit(options = {}) {
    super.onInit(options);

    // Temp - added for app v1.1.0
    if (!this.hasCapability('button')) {
      try {
        await this.addCapability('button');
      } catch (error) {
        this.error(error);
      }
    }

    this.registerCapabilityListener('button', this.onCapabilityButton.bind(this));

    this.log('Device initiated');
  }

  onAdded() {
    super.onAdded();
    this.setDeviceActions();
  }

  setDeviceActions() {
    this.homey.cloud.getLocalAddress()
      .then((localAddress) => {
        const value = `get://${localAddress.split(':')[0]}/api/app/ch.mystrom.smarthome/deviceGenAction`;
        return this.setDeviceData('action/generic', value)
          .then((data) => this.debug(`setDeviceActions() > ${data || '[none]'}`))
          .catch((err) => this.error(`setDeviceActions() > ${err}`));
      })
      .catch((err) => {
        this.error(`getLocalAddress() > ${err}`);
      });
  }

  async deviceActionReceived(params) {
    super.deviceActionReceived(params);

    if (params.action <= '4') {
      this.debug(`deviceActionReceived() > ${JSON.stringify(params)}`);
      // Battery-Level
      if (params.battery) {
        await this.setCapabilityValue('measure_battery', parseInt(params.battery, 10));
      }
      // Action
      this.driver.triggerButtonPressedFlow(this, {}, { action: params.action });
    }
  }

  onCapabilityButton(value = true, opts) {
    this.debug(`onCapabilityButton() > ${JSON.stringify(value)}`);
    // Software-Button only supports: "short press"
    this.driver.triggerButtonPressedFlow(this, {}, { action: '1' });
    return Promise.resolve(true);
  }

};
