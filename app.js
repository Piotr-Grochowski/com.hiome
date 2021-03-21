'use strict';

const Homey = require('homey');

class MyApp extends Homey.App {
	
	onInit() {
		this.log('Hiome App is running...');

		// If no one has set primary Homey Core in the configuration
		// then assume it's in standard location: hiome.local
		if(this.homey.settings.get('primaryCore')=='')
			this.homey.settings.set('primaryCore','hiome.local');

		// Registed Action Flow cards:

		// The flow card used to increment people count
		this.homey.flow.getActionCard('occupancy_increment')
			.registerRunListener(( args, state ) => {
				return args.my_device.onCapabilityIncrement(null,null);
			});

		// The flow card used to decrement people count
		this.homey.flow.getActionCard('occupancy_decrement')
			.registerRunListener(( args, state ) => {
				return args.my_device.onCapabilityDecrement(null,null);
			});
		
		// The flow card used to reset people count to 0
		this.homey.flow.getActionCard('occupancy_zero')
			.registerRunListener(( args, state ) => {
				return args.my_device.onCapabilityZero(null,null);
			});

		// The flow card used to set people count a particular number
		this.homey.flow.getActionCard('occupancy_set')
			.registerRunListener(( args, state ) => {
				return args.my_device.setOccupancyValue(args.val);
			});
	}
}

module.exports = MyApp;