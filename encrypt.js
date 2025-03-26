const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
require('dotenv').config();

// Şifreleme için anahtar (burada sabit olarak koyduk ama, gerçek projede ENV içinde tutmalısın)
const secretKey = process.env.SECRET_KEY;

// JSON dosyasının yolunu belirleyelim
const filePath = path.join(__dirname, 'portfolio-454820-4e5c22ed01de.json');

// JSON dosyasını okuyalım
const jsonData = fs.readFileSync(filePath, 'utf8');

// JSON verisini AES ile şifreleyelim
const encryptedData = CryptoJS.AES.encrypt(jsonData, secretKey).toString();

// Şifreli veriyi .enc dosyasına kaydedelim
const encryptedFilePath = path.join(__dirname, 'portfolio-454820-4e5c22ed01de.enc');
fs.writeFileSync(encryptedFilePath, encryptedData);

console.log('✅ Şifrelenmiş dosya başarıyla oluşturuldu: portfolio-454820-4e5c22ed01de.enc');
