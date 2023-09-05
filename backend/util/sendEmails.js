const nodeMailer= require("nodemailer")

exports.sendEmail= async function(options){
    const transporter= nodeMailer.createTransport({
        service:SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    })
 
    const mailOptions={
        from :SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    

    
    await transporter.sendMail(mailOptions)

}