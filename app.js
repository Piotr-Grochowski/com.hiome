'use strict';

const Homey = require('homey');
const mqtt = require("mqtt")
const util = require('/lib/util.js');

class MyApp extends Homey.App {
	
	onInit() {
		this.log('Hiome App is running...');

		if(Homey.ManagerSettings.get('primaryCore')=='')
			Homey.ManagerSettings.set('primaryCore','hiome.local');

		let occupancyIncrementAction = new Homey.FlowCardAction('occupancy_increment');
		let occupancyDecrementAction = new Homey.FlowCardAction('occupancy_decrement');
		let occupancyZeroAction = new Homey.FlowCardAction('occupancy_zero');
		let occupancySetAction = new Homey.FlowCardAction('occupancy_set');

		occupancyIncrementAction
		  .register()
		  .registerRunListener(( args, state ) => {
			return args.my_device.onCapabilityIncrement(null,null);
		  });

		  occupancyDecrementAction
		  .register()
		  .registerRunListener(( args, state ) => {
			return args.my_device.onCapabilityDecrement(null,null);
		  });

		  occupancyZeroAction
		  .register()
		  .registerRunListener(( args, state ) => {
			return args.my_device.onCapabilityZero(null,null);
		  });

		  occupancySetAction
		  .register()
		  .registerRunListener(( args, state ) => {
			return args.my_device.setOccupancyValue(args.val);
		  });


	}

	onGetRooms(callback){
		util.sendGetCommand('/api/1/rooms', 'hiome.local')
		.then(result => {
			this.log(result);
			callback(null, result);
		})
		.catch(error => {
			this.log('Hiome Core is not reachable.');
			callback('Hiome Core is not reachable.', null);
		})
	}

	onSetCount(args, callback) {
		let jsonOut = {
		  "id": args.id,
		  "occupancy_count": args.count
		};
		util.sendPutCommand('/api/1/rooms/' + args.id, 'hiome.local', jsonOut)
		.then(result => {
		  this.log(result);
		  callback(null, result);
		})
		.catch(error => {
		  this.log('Hiome Core is not reachable.');
		  callback('Hiome Core is not reachable.', null);
		})
	}
}

module.exports = MyApp;