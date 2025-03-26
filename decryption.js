const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
require('dotenv').config();
// Şifre çözme işlemi için aynı şifreleme anahtarını kullanıyoruz
const secretKey = process.env.SECRET_KEY;

// Şifreli dosyanın yolunu belirleyelim
const encryptedFilePath = path.join(__dirname, 'portfolio-454820-4e5c22ed01de.enc');

// Şifreli dosyayı okuyalım
const encryptedData = fs.readFileSync(encryptedFilePath, 'utf8');

// Şifreyi çözelim
const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

// JSON'a dönüştürelim
const jsonObject = JSON.parse(decryptedData);

console.log('✅ Şifre çözme başarılı:', jsonObject);

// Şifrelenmiş JSON'u çözülmüş haliyle kullanabilirsin (örneğin Google reCAPTCHA için)