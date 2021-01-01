const Homey = require('homey');

const mqtt = require("mqtt")
const util = require('/lib/util.js');

module.exports = class HiomeOccupancyDevice extends Homey.Device {

	// Device init
	onInit() {	
		this.setAvailable();
		this.client = mqtt.connect("mqtt://hiome.local:1883")
		this.client.on("connect", this.subscribeSensor.bind(this));
		this.client.on("message", this.sensorUpdate.bind(this));

		this.registerCapabilityListener('button.increment', this.onCapabilityIncrement.bind(this));
		this.registerCapabilityListener('button.decrement', this.onCapabilityDecrement.bind(this));
		this.registerCapabilityListener('button.zero', this.onCapabilityZero.bind(this));

	}

	async onCapabilityIncrement( value, opts ) {
		let jsonin = 
		{
				"id": this.getData().id,
				"occupancy_count" : this.getCapabilityValue('measure_ppl_count')+1
		};
		util.sendPutCommand('/api/1/rooms/'+this.getData().id,'hiome.local',jsonin)
		.catch(error => {
			console.log('Hiome Core is not reachable.');
			console.log(error);
		})    

	}

	async onCapabilityDecrement( value, opts ) {
		if(this.getCapabilityValue('measure_ppl_count')>0)
		{
			let jsonin = 
			{
					"id": this.getData().id,
					"occupancy_count" : this.getCapabilityValue('measure_ppl_count')-1
			};
			util.sendPutCommand('/api/1/rooms/'+this.getData().id,'hiome.local',jsonin)
			.catch(error => {
				console.log('Hiome Core is not reachable.');
				console.log(error);
			})    
		}
	}

	async onCapabilityZero( value, opts ) {
		let jsonin = 
		{
				"id": this.getData().id,
				"occupancy_count" : 0
		};
		util.sendPutCommand('/api/1/rooms/'+this.getData().id,'hiome.local',jsonin)
		.catch(error => {
			console.log('Hiome Core is not reachable.');
			console.log(error);
		})    

	}

	async setOccupancyValue( val) {
		let jsonin = 
		{
				"id": this.getData().id,
				"occupancy_count" : val
		};
		util.sendPutCommand('/api/1/rooms/'+this.getData().id,'hiome.local',jsonin)
		.catch(error => {
			console.log('Hiome Core is not reachable.');
			console.log(error);
		})    

	}


	async subscribeSensor()
	{
		try{
			this.client.subscribe("hiome/1/sensor/"+this.getData().id+":occupancy", {qos: 1})
		}
		catch(err){
			console.log(err);
		}
	}

	async sensorUpdate(topic, msg, packet)
	{
		try{
		const message = JSON.parse(msg)
		if (message["meta"]["type"] === "occupancy") {
			let count = message["val"]; 
			this.setCapabilityValue('measure_ppl_count', count);
			if(count>0)
			{
				this.setCapabilityValue('alarm_motion', true);
			}
			else
			{
				this.setCapabilityValue('alarm_motion', false);
			}

			Homey.ManagerApi.realtime('com.hiome.UpdateCount', { id: this.getData().id, count: count});
		}	
		}
		catch(error)
		{
			console.log(error);

		}
	}
}