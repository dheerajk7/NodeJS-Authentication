const kue = require('kue');

//creating queue for delayed jobs
const queue = kue.createQueue();

module.exports = queue;