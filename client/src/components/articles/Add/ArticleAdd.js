import { useState } from "react"; // React'in useState hook'u ile form verisini tutacağız
import { useNavigate } from "react-router-dom"; // Form gönderildikten sonra yönlendirme yapmak için kullanılır
import { useMutation, gql } from "@apollo/client"; // GraphQL sorgusu/mutasyonu tanımlamak ve kullanmak için Apollo Client kütüphanesi

import "./ArticleAdd.css"; // CSS dosyası içe aktarılıyor (form tasarımı için)

// GraphQL mutation tanımı: makaleOlustur isimli mutation, başlık ve içerik alır, yeni bir makale döner
const ARTICLE_CREATE = gql`
  mutation MakaleOlustur($baslik: String!, $icerik: String!) {
    makaleOlustur(baslik: $baslik, icerik: $icerik) {
      id
      baslik
      icerik
    }
  }
`;

export default function ArticleAdd() {
  // Formdan alınan verileri 'data' nesnesinde tutarız
  const [data, setData] = useState({ baslik: "", icerik: "" });

  // navigate fonksiyonu, başarılı işlemlerden sonra yönlendirme yapmak için kullanılır
  const navigate = useNavigate();


  // useMutation ile mutation fonksiyonu tanımlanır
  const [articleCreate, { loading, error }] = useMutation(ARTICLE_CREATE, {
    // Mutation başarılı olduktan sonra Apollo Cache güncellenir
    update(cache, { data: { makaleOlustur } }) {
      // Önce mevcut makale listesini cache'den okuyoruz
      const existingArticles = cache.readQuery({
        query: gql`
          query GetArticles {
            makalelerGetir {
              id
              baslik
              icerik
            }
          }
        `,
      });

      // Eğer cache'de eski veriler varsa, yeni makaleyi ekleyerek tekrar yazıyoruz
      if (existingArticles) {
        cache.writeQuery({
          query: gql`
            query GetArticles {
              makalelerGetir {
                id
                baslik
                icerik
              }
            }
          `,
          data: {
            // Yeni makaleyi mevcut listeye ekliyoruz
            makalelerGetir: [...existingArticles.makalelerGetir, makaleOlustur],
          },
        });
      }
    },
  });

  // Input ve Textarea'da ki değişiklikleri yakalar ve state'i günceller
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Form submit edildiğinde çalışır
  const handleSubmit = (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller

    // Mutation'u çağırıyoruz ve gerekli değişkenleri gönderiyoruz
    articleCreate({
      variables: { baslik: data.baslik, icerik: data.icerik },
    })
      .then(() => {
        navigate("/"); // Başarılıysa ana sayfaya yönlendirme yapıyoruz
      })
      .catch((err) => {
        console.error("Mutation Error:", err.message); // Hata varsa konsola yazdırıyoruz
      });
  };

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <h2>Makale Ekle</h2>
      <input
        type="text"
        placeholder="Başlık giriniz"
        name="baslik"
        value={data.baslik}
        onChange={handleChange}
        required
      />
      <textarea
        placeholder="İçerik giriniz"
        name="icerik"
        value={data.icerik}
        onChange={handleChange}
        required
        rows={10}
      ></textarea>
      <button type="submit" disabled={loading}>
        {loading ? "Yükleniyor..." : "Ekle"}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
