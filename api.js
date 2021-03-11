const Homey = require( 'homey' );
const util = require('/lib/util.js');

module.exports = {

	async GetRooms({homey}){
		return new Promise(function (resolve, reject) {
			util.sendGetCommand('/api/1/rooms', homey.settings.get('primaryCore'))
			.then(result => {
				console.log(result);
				return resolve(result);
			})
			.catch(error => {
				console.log('Hiome Core is not reachable.');
				console.log(error);
				return resolve(error);
			})
	  	})

	},

	async SetCount({homey, params, body}) {
		return new Promise(function (resolve, reject) {
			
			let jsonOut = {
				"id": body.id,
				"occupancy_count": body.count
			};
			util.sendPutCommand('/api/1/rooms/' + body.id, homey.settings.get('primaryCore'), jsonOut)
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