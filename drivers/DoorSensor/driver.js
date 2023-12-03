const Homey = require('homey');
const util = require('../../lib/util.js');

module.exports = class HiomeDoorDriver extends Homey.Driver {

    // Get the devices list
    async onPairListDevices() {

      var devices = [];

      // Get the devices from primary Hiome Core
      await util.sendGetCommand('/api/1/sensors?type=door',this.homey.settings.get('primaryCore'))
			.then(result => {
        result.forEach(element => {
          devices.push({"data": { "id": 'p_'+element.id}, "name": element.name, "settings": {"core": "primary", "mqttid": element.id}});
        });
			})
			.catch(error => {
        this.log('Hiome Core is not reachable.');
			})    

      // Get the devices from secondary Hiome Core if configured
      if(this.homey.settings.get('secondaryCore')!='')
      {
        await util.sendGetCommand('/api/1/sensors?type=door',this.homey.settings.get('secondaryCore'))
        .then(result => {
          result.forEach(element => {
            devices.push({"data": { "id": 's_'+element.id}, "name": element.name, "settings": {"core": "secondary", "mqttid": element.id}});
          });
        })
        .catch(error => {
          this.log('Hiome Core is not reachable.');
        })    
      }

      return devices;

    }
  }