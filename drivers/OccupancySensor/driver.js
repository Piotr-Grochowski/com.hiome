const Homey = require('homey');
const util = require('/lib/util.js');

module.exports = class HiomeOccupancyDriver extends Homey.Driver {

    // this is the easiest method to overwrite, when only the template 'Drivers-Pairing-System-Views' is being used.
    onPairListDevices( data, callback ) {

      var devices = [];

      util.sendGetCommand('/api/1/rooms','hiome.local')
			.then(result => {
        result.forEach(element => {
          devices.push({"data": { "id": element.id}, "name": element.name});
        });
        callback( null, devices );

			})
			.catch(error => {
        this.log('Hiome Core is not reachable.');
        callback( null, devices );
			})    
    }
  }