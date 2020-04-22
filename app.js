'use strict';

const Homey = require('homey');

class MyApp extends Homey.App {
	
	onInit() {
		this.log('Hiome App is running...');
	}
}

module.exports = MyApp;