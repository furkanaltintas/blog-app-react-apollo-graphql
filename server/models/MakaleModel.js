const { model, Schema } = require('mongoose');

const makaleSchema = new Schema({
    baslik: String,
    icerik: String
});

module.exports = new model('makale', makaleSchema);

// Id bilgisi veritabanına ekleme işleminde otomatik olarak oluşuyor.