const Homey = require('homey');

const mqtt = require("mqtt")

module.exports = class HiomeBatteryPackDevice extends Homey.Device {

	// Helper funcion - delay ms miliseconds
	async delay(ms)
	{ 
		return new Promise(resolve => this.homey.setTimeout(resolve, ms));
	}

	// Device init
	onInit() {	
		this.setAvailable();
		this.lastSeen = 0;		
		
		// Determine Hiome Core address
		let coreAddress = this.homey.settings.get('primaryCore');
		if(this.getSetting('core')=='secondary')
		{
			coreAddress = this.homey.settings.get('secondaryCore');
		}

		// Connect to MQTT Broker in Hiome Core
		this.client = mqtt.connect("mqtt://"+coreAddress+":1883");
		this.client.on("connect", this.subscribeSensor.bind(this));
		this.client.on("message", this.sensorUpdate.bind(this));	

		// Enable the loop that checks the avaibility of the device
		this.addListener('poll', this.pollDevice);
		this.emit('poll');	
	}
	
	// Check if we received heartbeat from the sensor within last 3.5h (via MQTT)
	async pollDevice()
	{
		if((this.lastSeen >0) && (Date.now() - this.lastSeen > 1000*3600*3.5))
		{
			this.setUnavailable("Device didn't report it's state since "+this.getSetting("last_seen"));
		} 
		else
			this.setAvailable();

		await this.delay(1000*3600);
		this.emit('poll');
	}

	// Subscribe to MQTT topics
	async subscribeSensor()
	{
		try{
			this.client.subscribe("hs/1/com.hiome/"+this.getSetting('mqttid')+"/battery", {qos: 1})
			this.client.subscribe("hs/1/com.hiome/"+this.getSetting('mqttid')+"/connected", {qos: 1})
			this.client.subscribe("hs/1/com.hiome/"+this.getSetting('mqttid')+"/version", {qos: 1})
		}
		catch(err){
			console.log(err);
		}
	}

	// Update the sensor after MQTT message
	async sensorUpdate(topic, msg, packet)
	{
		try
		{		
			const message = JSON.parse(msg)

			// Battery level update
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
			else
			// Heartbeat
			if (topic === "hs/1/com.hiome/"+this.getSetting('mqttid')+"/connected") {
				this.setSettings({
					"last_seen": (new Date(message["ts"])).toISOString()	
				});
				this.lastSeen = message["ts"];

				if(Date.now() - this.lastSeen > 1000*3600*3.5)
				{
					this.setUnavailable("Device didn't report it's state since "+this.getSetting("last_seen"));
				} 
				else
					this.setAvailable();

			}	
			// Firmware version
			else
			if (topic === "hs/1/com.hiome/"+this.getSetting('mqttid')+"/version") {
				this.setSettings({
					"fv": message["val"]	
				});
			}	
		}
		catch(error)
		{
			console.log(error);

		}
	
	}
}