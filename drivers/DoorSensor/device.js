const Homey = require('homey');

const mqtt = require("mqtt")

module.exports = class HiomeDoorDevice extends Homey.Device {

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
	}
	
	async subscribeSensor()
	{
		try{
			this.client.subscribe("hs/1/com.hiome/"+this.getSetting('mqttid')+"/door", {qos: 1})
			this.client.subscribe("hs/1/com.hiome/"+this.getSetting('mqttid')+"/battery", {qos: 1})
			this.client.subscribe("hs/1/com.hiome/"+this.getSetting('mqttid')+"/*", {qos: 1})
		}
		catch(err){
			console.log(err);
		}
	}

	async sensorUpdate(topic, msg, packet)
	{
		const message = JSON.parse(msg)
		if (topic === "hs/1/com.hiome/"+this.getSetting('mqttid')+"/door") {
			if(message["val"]=='open' || message["val"]=='opened')
			{
				this.setCapabilityValue('alarm_contact', true);
			}
			else
			{
				this.setCapabilityValue('alarm_contact', false);
			}
		}	
		else
		if (topic === "hs/1/com.hiome/"+this.getSetting('mqttid')+"/battery") {
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