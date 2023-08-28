import mailer from 'nodemailer';

const config = {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'khoi2021242@gmail.com',
    password: 'ezulgibqnzjdbzaf',
    sendAddress: 'khoi2021242@gmail.com',
};
export const sendMail = (to, subject, htmlContent) => {
    const transport = mailer.createTransport({
        host: config.host,
        port: config.port,
        secure: false,
        auth: {
            user: config.username,
            pass: config.password,
        },
    });
    const options = {
        from: `KOMIHO <${config.sendAddress}>`,
        to,
        subject,
        html: htmlContent,
    };
    return transport.sendMail(options);
};
