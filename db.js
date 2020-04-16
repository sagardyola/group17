const mongoose = require('mongoose');


//connect or createconnection any methods can be used

// USING CALLBACK
// mongoose.connect('mongodb://localhost:27017/group17db', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, function (err, done) {
//     if (err) {
//         console.log('Error connecting to db');
//     } else {
//         console.log('DB connection success');
//     }
// });


// USING EVENT
mongoose.connect('mongodb://localhost:27017/group17db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


mongoose.connection.once('open', function () {
    console.log('DB connection OPEN');
})

mongoose.connection.on('err', function (err) {
    console.log('DB connection FAILED');
})