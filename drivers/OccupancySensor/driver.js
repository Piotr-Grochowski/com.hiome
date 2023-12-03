const Homey = require('homey');
const util = require('../../lib/util.js');

module.exports = class HiomeOccupancyDriver extends Homey.Driver {

    // Get the rooms
    async onPairListDevices() {

      var devices = [];

      // Get the rooms from pirimary core
      await util.sendGetCommand('/api/1/rooms',this.homey.settings.get('primaryCore'))
			.then(result => {
        result.forEach(element => {
          devices.push({"data": { "id": 'p_'+element.id}, "name": element.name, "settings": {"core": "primary", "mqttid": element.id}});
        });
			})
			.catch(error => {
        this.log('Hiome Core is not reachable.');
			})    

      // Get the rooms from secondary core if configured
      if(this.homey.settings.get('secondaryCore')!='')
      {
        await util.sendGetCommand('/api/1/rooms',this.homey.settings.get('secondaryCore'))
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