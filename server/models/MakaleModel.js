const mongoose = require('mongoose');

const makaleSchema = new mongoose.Schema({
    baslik: {
        type: String,
        required: true,
        unique: true
    },
    icerik: {
        type: String,
        required: true
    }
});

const MakaleModel = new mongoose.model('Makale', makaleSchema);
module.exports = MakaleModel;
// Id bilgisi veritabanına ekleme işleminde otomatik olarak oluşuyor.