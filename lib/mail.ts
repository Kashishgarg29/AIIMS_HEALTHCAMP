import nodemailer from "nodemailer";

interface SendEmailOptions {
    to: string;
    subject: string;
    text: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_FROM || '"Hospital Admin Portal" <no-reply@hospital.com>',
            to: options.to,
            subject: options.subject,
            text: options.text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email: ", error);
        return { success: false, error };
    }
};
