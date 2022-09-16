

// Set enabled domain for cors
let whitelist = ['localhost:3000', 'localhost:3333']

// exports.corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

exports.corsOptions = {
    origin: 'http://localhost:3333',
    optionsSuccessStatus: 200 
}

