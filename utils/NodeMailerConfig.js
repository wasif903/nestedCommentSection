import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL if required
    auth: {
        user: 'wasifmehmood903@gmail.com',
        pass: 'cdwc usjl mrys gkzy'
    },
    tls: { rejectUnauthorized: false }
});


export default transporter;
