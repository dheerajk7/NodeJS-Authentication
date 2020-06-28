const queue = require('../config/kue');
const verificationEmailMailer = require('../mailers/verification-mailer');

//sending mail into queue to send for verifying account
queue.process('verificationEmail',function(job,done){
    verificationEmailMailer.sendVerification(job.data);
    done();
});