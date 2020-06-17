const mongoose = require('mongoose');
const config = require('./config');

const URI = 'mongodb://' + config.db.host + '/' + config.db.name;

mongoose.connect(URI)
    .then(db => console.log('DB is connect'))
    .catch(err => console.error(err));

module.exports = mongoose;