const Homey = require( 'homey' );
const MyApp = require('./app');

module.exports = [
    {
        method: 'POST',
        path: '/GetRooms/',
        fn: function (args, callback) {
            return Homey.app.onGetRooms(callback);
        }
    },
    {
        method: 'POST',
        path: '/SetCount/',
        fn: function (args, callback) {
            return Homey.app.onSetCount(args.body, callback);
        }
    }
]