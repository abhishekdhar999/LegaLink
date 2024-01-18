const nodemailer =  require('nodemailer')

module.exports = async(email,subject,text)=>{
    try {
      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "bcbf1898e60a49",
          pass: "056b92a4840dfa"
        }
      });
        

        await transport.sendMail({
            from:process.env.AUTH_EMAIL,
            to:email,
            subject:subject,
             html:`<a>${text}</a>`
        });
        console.log("email sent successfully" );
    } catch (error) {
        console.log("email not sent")
        console.log(error)
    }
}