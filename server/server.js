// ApolloServer sınıfını apollo-server paketinden import ediyoruz.
const { ApolloServer } = require("apollo-server");

// gql, GraphQL şemasını tanımlamak için kullanılan bir tag fonksiyonudur
const gql = require("graphql-tag");

const mongoose = require("mongoose");

const MakaleModel = require("./models/MakaleModel");

const DB_URI =
  "server";

// GraphQL şema tanımı yapılır
// Burada sadece bir Query tipi tanımlanıyor: ilkTip adlı bir alan var ve String (zorunlu) döner
const typeDefs = gql`
  type Makale {
    id: ID!
    baslik: String!
    icerik: String!
  }

  type Query {
    makalelerGetir: [Makale]!
    makaleGetir(id: ID): Makale!
  }

  type Mutation {
    makaleOlustur(baslik: String!, icerik: String!): Makale,
    makaleSil(id: ID): Boolean
  }
`;

// Resolver fonksiyonları tanımlanır
// makalelerGetir alanı çağrıldığında ne döneceğini belirtiyoruz
const resolvers = {
  Query: {
    async makalelerGetir() {
      const makaleler = await MakaleModel.find();
      console.log(makaleler);
      return makaleler;
    },
    async makaleGetir(parent, args) {
      try {
        const { id } = args;
        return await MakaleModel.findById(id);
      } catch (error) {
        throw new error();
      }
    },
  },
  Mutation: {
    makaleOlustur: async (parent, args) => {
      try {
        const existing = await MakaleModel.findOne({ baslik: args.baslik });
        if (existing) throw new Error("Bu başlıkta zaten bir makale var");

        const makale = {
          baslik: args.baslik,
          icerik: args.icerik,
        };

        return await MakaleModel.create(makale);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    makaleSil: async (_, {id}) => {
      try {
        const existing = await MakaleModel.findById(id);
        if (!existing) throw new Error("Makale bulunamadı");

        await MakaleModel.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

// Apollo Server örneği oluşturuluyor
// Şema (typeDefs) ve resolver'lar sunucuya verilir
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Mongoose modülü ile MongoDB veritabanına bağlantı kuruyoruz
mongoose
  .connect(DB_URI, {
    // MongoDB bağlantı URL'sini yeni parser ile çözümle
    useNewUrlParser: true,
    // MongoDB sunucusuna tek bir bağlantı noktası üzerinden bağlan (eski topology yapısından daha stabil)
    useUnifiedTopology: true,
  })
  .then(() => {
    // Bağlantı başarılıysa konsola bilgi mesajı yaz
    console.log("mongodb bağlantısı başarılı");

    // Veritabanı bağlantısından sonra GraphQL server'ı başlat
    // server.listen metodu GraphQL sunucusunu belirtilen portta çalıştırır
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    // Sunucu başarıyla başlatıldığında, URL bilgisi konsola yazılır
    // res.url genelde http://localhost:5000 gibi bir adres döner
    console.log(`server ${res.url} adresinde çalışıyor.`);
  })
  .catch((err) => {
    // Herhangi bir hata durumunda hatayı konsola yaz
    console.error("Sunucu başlatılırken hata oluştu:", err);
  });
