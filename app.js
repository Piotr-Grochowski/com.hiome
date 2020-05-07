'use strict';

const Homey = require('homey');

class MyApp extends Homey.App {
	
	onInit() {
		this.log('Hiome App is running...');

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
}

module.exports = MyApp;