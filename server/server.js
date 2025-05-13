// ApolloServer sınıfını apollo-server paketinden import ediyoruz.
const { ApolloServer } = require("apollo-server");

// gql, GraphQL şemasını tanımlamak için kullanılan bir tag fonksiyonudur
const gql = require("graphql-tag");

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
  }
`;

// Resolver fonksiyonları tanımlanır
// makalelerGetir alanı çağrıldığında ne döneceğini belirtiyoruz
const resolvers = {
  Query: {
    makalelerGetir() {
      const makaleler = [
        { id: 1, baslik: "makale baslik 1", icerik: "makale içerik 1" },
        { id: 2, baslik: "makale baslik 2", icerik: "makale içerik 2" },
        { id: 3, baslik: "makale baslik 3", icerik: "makale içerik 3" },
      ];

      return makaleler;
    },
  },
};

// Apollo Server örneği oluşturuluyor
// Şema (typeDefs) ve resolver'lar sunucuya verilir
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Sunucu 5000 portunda dinlenmeye başlar
// Başarıyla başlarsa, terminale sunucu adresini yazar
server.listen({ port: 5000 }).then((res) => {
  console.log(`server ${res.url} adresinde çalışıyor.`);
});

/*


query {
  ilkTip
}

Bu sorgunun yanıtı şöyle olur:

{
  "data": {
    "ilkTip": "ilk tip oluşturuldu"
  }
}


*/
