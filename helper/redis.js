const redis = require('redis');

let client = redis.createClient();

// client.cget = (key) => {
//     return new Promise((resolve, reject) => {
//         client.get(key, function(err, res){
//             console.log('client....', res, key);
//             resolve(res);
//         })
//     })
// }

// client.cset = (...args) => {
//     return new Promise((resolve, reject) => {
//         client.set(...args);
//     })
// }
module.exports = client;

