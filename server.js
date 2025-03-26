const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { createAssessment } = require('./createAssessment.js');
const corsOptions = require('./corsOptions.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Portfolio Backend');
});
// Email gönderme endpoint'i
app.post('/api/send-mail', async (req, res) => {
    try {
        const { email, fullName, phoneNumber, subject, message, token } = req.body;
        // Gerekli alanların kontrolü
        if (!email || !fullName || !subject) {
            return res.status(400).json({ message: 'Eksik bilgi. Lütfen tüm gerekli alanları doldurun.' });
        }

        // reCAPTCHA doğrulaması
        const score = await createAssessment(
            process.env.GOOGLE_CLOUD_PROJECT_ID,
            process.env.RECAPTCHA_SITE_KEY,
            token,
        );

        if (score === null || score < 0.5) {
            return res.status(400).json({ message: 'reCAPTCHA doğrulaması başarısız. Lütfen tekrar deneyin.' });
        }

        // Email transporter yapılandırması
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // HTML içerik oluşturma
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <div style="background-color: white; padding: 20px; border-radius: 10px;">
                <img src="cid:uniglogo" width="50" height="50" />
                <p><strong>Konu:</strong> ${subject}</p>
                <p><strong>Gönderen:</strong> ${fullName}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${phoneNumber ? `<p><strong>Telefon:</strong> ${phoneNumber}</p>` : ''}         
                ${message ? `<p><strong>Telefon:</strong> ${message}</p>` : ''} 
            </div>
        </div>
        `;

        // Mail seçenekleri
        const mailOptions = {
            from: `${fullName} <${email}>`,
            to: process.env.EMAIL_USER,
            subject: `Yeni İletişim: ${subject}`,
            attachments: [
                {
                    filename: "logo.png",
                    path: "./public/logo.png",  // Resmin yolu
                    cid: "uniglogo",  // HTML içinde kullanılacak CID değeri
                }
            ],
            html: htmlContent,
        };

        // Email gönderme
        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Email başarıyla gönderildi' });

    } catch (error) {
        console.error("Email gönderim hatası:", error);
        return res.status(500).json({ message: 'Email gönderimi başarısız oldu', error: error.message });
    }
});

// Sunucuyu başlatma
app.listen(port, () => console.log(`server running on port ${process.env.PORT}`));