import nodemailer from 'nodemailer'


export const sendEmail = async (to, subject, html, attachments) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `"Maddison Foo Koch 👻" <${process.env.EMAIL}>`, // sender address
            to: to ? to : null,
            subject: subject ? subject : "Hello ✔", // Subject line
            html: html ? html : null,
            attachments: attachments ? attachments : []
        });

        if (info.accepted.length){
            return true
        }else{
            return false

        }
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

}
