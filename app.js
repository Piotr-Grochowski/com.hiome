'use strict';

const Homey = require('homey');
const mqtt = require("mqtt")
const util = require('/lib/util.js');

class MyApp extends Homey.App {
	
	onInit() {
		this.log('Hiome App is running...');

		if(this.homey.settings.get('primaryCore')=='')
			this.homey.settings.set('primaryCore','hiome.local');

		this.homey.flow.getActionCard('occupancy_increment')
			.registerRunListener(( args, state ) => {
				return args.my_device.onCapabilityIncrement(null,null);
			});

		this.homey.flow.getActionCard('occupancy_decrement')
			.registerRunListener(( args, state ) => {
				return args.my_device.onCapabilityDecrement(null,null);
			});

		this.homey.flow.getActionCard('occupancy_zero')
			.registerRunListener(( args, state ) => {
				return args.my_device.onCapabilityZero(null,null);
			});

		this.homey.flow.getActionCard('occupancy_set')
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