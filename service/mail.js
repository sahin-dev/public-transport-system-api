const mailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'farewell@gmail.com',
      pass: 'farewell'
    }
  });

  const mailSender = (to,subject,text)=>{
    transporter.sendMail({
        from:'farewell@gmail.com',
        to,
        subject,
        text
    } ,function (error,info){
        if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
    });
  }
  

  module.exports = mailSender;