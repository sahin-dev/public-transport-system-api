const mailer = require('nodemailer');

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'farewell470@gmail.com',
      pass: 'Farewell@470!'
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