const Homey = require('homey');
const util = require('/lib/util.js');

module.exports = class HiomeOccupancyDriver extends Homey.Driver {

    // this is the easiest method to overwrite, when only the template 'Drivers-Pairing-System-Views' is being used.
    async onPairListDevices( data, callback ) {

      var devices = [];

      await util.sendGetCommand('/api/1/rooms',Homey.ManagerSettings.get('primaryCore'))
			.then(result => {
        result.forEach(element => {
          devices.push({"data": { "id": 'p_'+element.id}, "name": element.name, "settings": {"core": "primary", "mqttid": element.id}});
        });
			})
			.catch(error => {
        this.log('Hiome Core is not reachable.');
			})    

      if(Homey.ManagerSettings.get('secondaryCore')!='')
      {
        await util.sendGetCommand('/api/1/rooms',Homey.ManagerSettings.get('secondaryCore'))
        .then(result => {
          result.forEach(element => {
            devices.push({"data": { "id": 's_'+element.id}, "name": element.name, "settings": {"core": "secondary", "mqttid": element.id}});
          });
        })
        .catch(error => {
          this.log('Hiome Core is not reachable.');
        })    
      }

      callback( null, devices );

    }
  }