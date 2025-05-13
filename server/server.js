// ApolloServer sınıfını apollo-server paketinden import ediyoruz.
const { ApolloServer } = require('apollo-server');

// gql, GraphQL şemasını tanımlamak için kullanılan bir tag fonksiyonudur
const gql = require("graphql-tag");


// GraphQL şema tanımı yapılır
// Burada sadece bir Query tipi tanımlanıyor: ilkTip adlı bir alan var ve String (zorunlu) döner
const typeDefs = gql`
    type Query {
        ilkTip: String!
    }
`;

// Resolver fonksiyonları tanımlanır
// ilkTip alanı çağrıldığında ne döneceğini belirtiyoruz
const resolvers = {
    Query : {
        // ilkTip sorgusu çalıştırıldığında bu fonksiyon çalışır
        // Geriye bir metin döner
        ilkTip: () => {
            return 'ilk tip oluşturuldu';
        }
    }
}

// Apollo Server örneği oluşturuluyor
// Şema (typeDefs) ve resolver'lar sunucuya verilir
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Sunucu 5000 portunda dinlenmeye başlar
// Başarıyla başlarsa, terminale sunucu adresini yazar
server.listen({ port: 5000 }).then((res) => {
    console.log(`server ${res.url} adresinde çalışıyor.`)
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