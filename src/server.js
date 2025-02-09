const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const contactsRouter = require('./routers/contacts');
const authRouter = require('./routers/auth');
const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

dotenv.config();

const app = express();
const { DB_HOST } = process.env;
const PORT = process.env.PORT || 10000;

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Ana rota (root route) için karşılama mesajı
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Bu, Node.js kursunun altıncı ev ödevi. Bu ödevde şifre sıfırlama işlevselliğini gerçekleştireceğiz ve öğrenciler için resim yükleme imkanı ekleyeceğiz. E-posta ve resim yönetimi için sırasıyla Brevo ve Cloudinary hizmetlerini kullanacağız.",
        learnings: [
            "Token kullanarak şifre sıfırlama işlevselliğini uygulamak.",
            "E-posta göndermek için Brevo hizmetini kullanmak.",
            "Cloudinary hizmetini kullanarak resim yüklemeyi entegre etmek.",
            "Yeni işlevsellikleri desteklemek için modelleri ve uç noktaları genişletmek."
        ],
        note: "Bu ödev, Node.js'de e-posta ve resimlerle çalışma konusundaki yeni kavramları öğrenmenize yardımcı olacak ve dış hizmetlerle çalışma konusunda etkili uygulamaları keşfetmenizi sağlayacaktır.",
        encouragement: "O halde, zaman kaybetmeyin — Hadi pratik yapın! 🚀"
    });
});

app.use('/auth', authRouter);
app.use('/contacts', authenticate, contactsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

mongoose.connect(DB_HOST)
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı');
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch(error => {
    console.error('Veritabanı bağlantı hatası:', error);
    process.exit(1);
  });

// ... mevcut kod ...
