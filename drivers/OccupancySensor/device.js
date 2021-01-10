const Homey = require('homey');

const mqtt = require("mqtt")
const util = require('/lib/util.js');

module.exports = class HiomeOccupancyDevice extends Homey.Device {

	// Device init
	onInit() {	
		this.setAvailable();
		let coreAddress = Homey.ManagerSettings.get('primaryCore');
		if(this.getSetting('core')=='secondary')
		{
			coreAddress = Homey.ManagerSettings.get('secondaryCore');
		}
		this.client = mqtt.connect("mqtt://"+coreAddress+":1883");
		this.client.on("connect", this.subscribeSensor.bind(this));
		this.client.on("message", this.sensorUpdate.bind(this));

		this.registerCapabilityListener('button.increment', this.onCapabilityIncrement.bind(this));
		this.registerCapabilityListener('button.decrement', this.onCapabilityDecrement.bind(this));
		this.registerCapabilityListener('button.zero', this.onCapabilityZero.bind(this));

	}

	async onCapabilityIncrement( value, opts ) {
		let jsonin = 
		{
				"id": this.getSetting('mqttid'),
				"occupancy_count" : this.getCapabilityValue('measure_ppl_count')+1
		};
		util.sendPutCommand('/api/1/rooms/'+this.getSetting('mqttid'),'hiome.local',jsonin)
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
					"id": this.getSetting('mqttid'),
					"occupancy_count" : this.getCapabilityValue('measure_ppl_count')-1
			};
			util.sendPutCommand('/api/1/rooms/'+this.getSetting('mqttid'),'hiome.local',jsonin)
			.catch(error => {
				console.log('Hiome Core is not reachable.');
				console.log(error);
			})    
		}
	}

	async onCapabilityZero( value, opts ) {
		let jsonin = 
		{
				"id": this.getSetting('mqttid'),
				"occupancy_count" : 0
		};
		util.sendPutCommand('/api/1/rooms/'+this.getSetting('mqttid'),'hiome.local',jsonin)
		.catch(error => {
			console.log('Hiome Core is not reachable.');
			console.log(error);
		})    

	}

	async setOccupancyValue( val) {
		let jsonin = 
		{
				"id": this.getSetting('mqttid'),
				"occupancy_count" : val
		};
		util.sendPutCommand('/api/1/rooms/'+this.getSetting('mqttid'),'hiome.local',jsonin)
		.catch(error => {
			console.log('Hiome Core is not reachable.');
			console.log(error);
		})    

	}


	async subscribeSensor()
	{
		try{
			this.client.subscribe("hs/1/com.hiome/"+this.getSetting('mqttid')+"/occupancy", {qos: 1})
		}
		catch(err){
			console.log(err);
		}
	}

	async sensorUpdate(topic, msg, packet)
	{
		try{
		const message = JSON.parse(msg)
		if (topic === "hs/1/com.hiome/"+this.getSetting('mqttid')+"/occupancy") {
			let pplCount = message["val"];
			this.setCapabilityValue('measure_ppl_count',pplCount);
			if(pplCount>0)
			{
				this.setCapabilityValue('alarm_motion', true);
			}
			else
			{
				this.setCapabilityValue('alarm_motion', false);
			}
			Homey.ManagerApi.realtime('com.hiome.UpdateCount', { id: this.getSetting('mqttid'), count: pplCount});
		}	
		}
		catch(error)
		{
			console.log(error);

		}
	}
}