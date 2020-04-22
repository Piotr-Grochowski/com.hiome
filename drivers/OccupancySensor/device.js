const Homey = require('homey');

const mqtt = require("mqtt")

module.exports = class HiomeOccupancyDevice extends Homey.Device {

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
			this.client.subscribe("hiome/1/sensor/"+this.getData().id+":occupancy", {qos: 1})
		}
		catch(err){
			console.log(err);
		}
	}

	async sensorUpdate(topic, msg, packet)
	{
		const message = JSON.parse(msg)
		if (message["meta"]["type"] === "occupancy") {
			this.setCapabilityValue('measure_ppl_count',message["val"]);
			if(message["val"]>0)
			{
				this.setCapabilityValue('alarm_motion', true);
			}
			else
			{
				this.setCapabilityValue('alarm_motion', false);
			}
		}	
	}
}