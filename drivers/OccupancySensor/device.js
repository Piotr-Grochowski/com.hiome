const Homey = require('homey');

const mqtt = require("mqtt")
const util = require('../../lib/util.js');

module.exports = class HiomeOccupancyDevice extends Homey.Device {

	// Device init
	onInit() {	
		this.setAvailable();

		// Determine Hiome Core address
		this.coreAddress = this.homey.settings.get('primaryCore');
		if(this.getSetting('core')=='secondary')
		{
			coreAddress = this.homey.settings.get('secondaryCore');
		}

		// Connect to MQTT
		this.client = mqtt.connect("mqtt://"+this.coreAddress+":1883");
		this.client.on("connect", this.subscribeSensor.bind(this));
		this.client.on("message", this.sensorUpdate.bind(this));

		// Register capabilities
		this.registerCapabilityListener('button.increment', this.onCapabilityIncrement.bind(this));
		this.registerCapabilityListener('button.decrement', this.onCapabilityDecrement.bind(this));
		this.registerCapabilityListener('button.zero', this.onCapabilityZero.bind(this));

	}

	// Inrement people count
	async onCapabilityIncrement( value, opts ) {
		let jsonin = 
		{
				"id": this.getSetting('mqttid'),
				"occupancy_count" : this.getCapabilityValue('measure_ppl_count')+1
		};
		util.sendPutCommand('/api/1/rooms/'+this.getSetting('mqttid'),this.coreAddress,jsonin)
		.catch(error => {
			console.log('Hiome Core is not reachable.');
			console.log(error);
		})    

	}

	// Decrement people count
	async onCapabilityDecrement( value, opts ) {
		if(this.getCapabilityValue('measure_ppl_count')>0)
		{
			let jsonin = 
			{
					"id": this.getSetting('mqttid'),
					"occupancy_count" : this.getCapabilityValue('measure_ppl_count')-1
			};
			util.sendPutCommand('/api/1/rooms/'+this.getSetting('mqttid'),this.coreAddress,jsonin)
			.catch(error => {
				console.log('Hiome Core is not reachable.');
				console.log(error);
			})    
		}
	}

	// Reset people count to 0
	async onCapabilityZero( value, opts ) {
		let jsonin = 
		{
				"id": this.getSetting('mqttid'),
				"occupancy_count" : 0
		};
		util.sendPutCommand('/api/1/rooms/'+this.getSetting('mqttid'),this.coreAddress,jsonin)
		.catch(error => {
			console.log('Hiome Core is not reachable.');
			console.log(error);
		})    

	}

	// Set the number of people in the room to val
	async setOccupancyValue(val) {
		let jsonin = 
		{
				"id": this.getSetting('mqttid'),
				"occupancy_count" : val
		};
		util.sendPutCommand('/api/1/rooms/'+this.getSetting('mqttid'),this.coreAddress,jsonin)
		.catch(error => {
			console.log('Hiome Core is not reachable.');
			console.log(error);
		})    

	}

	// Subscribe to MQTT topics
	async subscribeSensor()
	{
		try{
			this.client.subscribe("hs/1/com.hiome/"+this.getSetting('mqttid')+"/occupancy", {qos: 1})
		}
		catch(err){
			console.log(err);
		}
	}

	// Update the sensor after MQTT message
	async sensorUpdate(topic, msg, packet)
	{
		try{
			const message = JSON.parse(msg)
			if (topic === "hs/1/com.hiome/"+this.getSetting('mqttid')+"/occupancy") 
			{
				let pplCount = message["val"];
				this.setCapabilityValue('measure_ppl_count',pplCount);
				this.setCapabilityValue('alarm_motion', pplCount>0 ? true : false);

				// Update for app config page
				this.homey.api.realtime('com.hiome.UpdateCount', { id: this.getData().id, count: pplCount});
			}	
		}
		catch(error)
		{
			console.log(error);

		}
	}
}