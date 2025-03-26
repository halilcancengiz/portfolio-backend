const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

// Şifre çözme işlemi için aynı şifreleme anahtarını kullanıyoruz
const secretKey = process.env.SECRET_KEY || 'cok-gizli-bir-anahtar';

// Şifreli dosyanın yolunu belirleyelim
const encryptedFilePath = path.join(__dirname, 'portfolio-454820-4e5c22ed01de.enc');

// Şifreli dosyayı okuyalım
const encryptedData = fs.readFileSync(encryptedFilePath, 'utf8');

// Şifreyi çözelim
const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

// JSON'a dönüştürelim
const credentials = JSON.parse(decryptedData);

async function createAssessment(projectID, recaptchaKey, token) {
    const client = new RecaptchaEnterpriseServiceClient({
        credentials: credentials
    });
    const projectPath = client.projectPath(projectID);

    const request = {
        assessment: {
            event: {
                token: token,
                siteKey: recaptchaKey,
            },
        },
        parent: projectPath,
    };

    const [response] = await client.createAssessment(request);
    if (!response.tokenProperties.valid) {
        console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`);
        return null;
    }

    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
    return response.riskAnalysis.score;
}

module.exports = { createAssessment };
