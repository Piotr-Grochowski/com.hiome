const util = require('./lib/util.js');

module.exports = {

	// used by App Configuration page to get all the rooms with people count
	async GetRooms({homey}){
		return new Promise(function (resolve, reject) {
			// Get all the rooms from primary Hiome Core
			util.sendGetCommand('/api/1/rooms', homey.settings.get('primaryCore'))
			.then(result => {
				result.forEach(element => {
					element.id = 'p_'+element.id;
				});

				// If secondary Hiome Core is configured - get the rooms from it also
				if(homey.settings.get('secondaryCore')!='')
				{
					util.sendGetCommand('/api/1/rooms', homey.settings.get('secondaryCore'))
					.then(result2 => {
						result2.forEach(element => {
							element.id = 's_'+element.id;
						});
						result = result + result2;
						console.log(result);
						return resolve(result);
					})
					.catch(error => {
						console.log('Secondary Home Core is not reachable.');
						console.log(error);
						console.log(result);
						return resolve(result);
					});		
				}
				else
				{
					console.log(result);
					return resolve(result);	
				}	
			})
			.catch(error => {
				console.log('Primary Hiome Core is not reachable.');
				console.log(error);
				return reject(error);
			})
	  	})
	},

	// used by App Configuration page to set the number of people in a room
	async SetCount({homey, params, body}) {
		return new Promise(function (resolve, reject) {
			let jsonOut = {
				"id": body.id.substring(2),
				"occupancy_count": body.count
			};
			util.sendPutCommand('/api/1/rooms/' + body.id.substring(2), body.id.substring(0,1) == 'p' ? homey.settings.get('primaryCore') : homey.settings.get('secondaryCore'), jsonOut)
			.then(result => {
				console.log(result);
				return resolve(result);
			})
			.catch(error => {
				console.log(error);
				return reject(error);
			})
			return resolve();
		})
	}
}