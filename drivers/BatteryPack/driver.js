const Homey = require('homey');
const util = require('../../lib/util.js');

module.exports = class HiomeBatteryPackDriver extends Homey.Driver {

    // Get the devices list
    async onPairListDevices() {

      var devices = [];

      // Get the devices list from primary Hiome Core
      await util.sendGetCommand('/api/1/sensors?type=battery',this.homey.settings.get('primaryCore'))
			.then(result => {
        result.forEach(element => {
          devices.push({"data": { "id": 'p_'+element.id}, "name": element.name, "settings": {"core": "primary", "mqttid": element.id}});
        });
			})
			.catch(error => {
        this.log('Primary Hiome Core is not reachable.');
			})    

      // If secondary Hiome Core is configured - get the devices from it
      if(this.homey.settings.get('secondaryCore')!='')
      {
        await util.sendGetCommand('/api/1/sensors?type=battery',this.homey.settings.get('secondaryCore'))
        .then(result => {
          result.forEach(element => {
            devices.push({"data": { "id": 's_'+element.id}, "name": element.name, "settings": {"core": "secondary", "mqttid": element.id}});
          });
        })
        .catch(error => {
          this.log('Secondary Hiome Core is not reachable.');
        })    
      }

      return devices;

    }
  }