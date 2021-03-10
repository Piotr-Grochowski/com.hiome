const Homey = require( 'homey' );

module.exports = {

	async GetRooms(){
		util.sendGetCommand('/api/1/rooms', 'hiome.local')
		.then(result => {
			this.log(result);
            return result;
		})
		.catch(error => {
			this.log('Hiome Core is not reachable.');
			return reject('Hiome Core is not reachable.');
		})
	},

	async SetCount(homey, args) {
		let jsonOut = {
		  "id": args.id,
		  "occupancy_count": args.count
		};
		util.sendPutCommand('/api/1/rooms/' + args.id, 'hiome.local', jsonOut)
		.then(result => {
		  this.log(result);
		  return result;
		})
		.catch(error => {
		  this.log('Hiome Core is not reachable.');
		  return reject('Hiome Core is not reachable.');
		})
	}


}