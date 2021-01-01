const Homey = require('homey');

const mqtt = require("mqtt")

module.exports = class HiomeDoorDevice extends Homey.Device {

	// Device init
	onInit() {	
		this.setAvailable();
		this.client = mqtt.connect("mqtt://hiome.local:1883")
		this.client.on("connect", this.subscribeSensor.bind(this));
		this.client.on("message", this.sensorUpdate.bind(this));		
	}
	
	async subscribeSensor()
	{
		try{
			this.client.subscribe("hiome/1/sensor/"+this.getData().id+":door", {qos: 1})
			this.client.subscribe("hiome/1/sensor/"+this.getData().id+":battery", {qos: 1})
		}
		catch(err){
			console.log(err);
		}
	}

	async sensorUpdate(topic, msg, packet)
	{
		const message = JSON.parse(msg)
		if (message["meta"]["type"] === "door") {
			if(message["val"]=='opened' || message["val"]=='open')
			{
				this.setCapabilityValue('alarm_contact', true);
			}
			else
			{
				this.setCapabilityValue('alarm_contact', false);
			}
		}	
		else
		if (message["meta"]["type"] === "battery") {
			if(message["val"]==0)
			{
				this.setCapabilityValue('measure_battery', null);
			}
			else
			{
				this.setCapabilityValue('measure_battery', Math.round((message["val"]-330)*10/9));
				if(message["val"]<350)
					this.setCapabilityValue('alarm_battery', true);
				else
					this.setCapabilityValue('alarm_battery', false);
			}
		}	
			
	}
}