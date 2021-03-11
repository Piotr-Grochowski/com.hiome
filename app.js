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
}

module.exports = MyApp;