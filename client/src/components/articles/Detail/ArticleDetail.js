import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";

import "./ArticleDetail.css";

const ARTICLE_LIST = gql`
  query {
    makalelerGetir {
      id
      baslik
      icerik
    }
  }
`;

const ARTICLE_DETAIL = gql`
  query makaleGetir($id: ID!) {
    makaleGetir(id: $id) {
      id
      baslik
      icerik
    }
  }
`;

const ARTICLE_DELETE = gql`
  mutation MakaleSil($id: ID!) {
    makaleSil(id: $id)
  }
`;

export default function ArticleDetail() {
  // URL parametresinden id'yi alıyoruz
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(ARTICLE_DETAIL, {
    variables: { id },
  });

  const [deleteArticle, { loading: deleteLoading, error: deleteError }] =
    useMutation(ARTICLE_DELETE, {
      update(cache) {
        const existingArticles = cache.readQuery({ query: ARTICLE_LIST });
        const newArticles = existingArticles.makalelerGetir.filter(
          (article) => article.id !== id
        );

        cache.writeQuery({
          query: ARTICLE_LIST,
          data: {
            makalelerGetir: newArticles,
          },
        });
      },
    });

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Silmek istediğinizden emin misiniz?");
    if(!isConfirmed) return; // Kullanıcı onaylamazsa işlem yapılmaz

    try {
      await deleteArticle({ variables: { id } });
      navigate("/");
    } catch (err) {
      console.error("Error deleting article:", err.message);
    }
  };

  if (loading) return <p>Makale yükleniyor...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="article-detail-container">
      {data && (
        <div className="article-detail-card">
          <h2 className="article-title">{data.makaleGetir.baslik}</h2>
          <p className="article-content">{data.makaleGetir.icerik}</p>
          <button onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? "Siliniyor" : "Sil"}
          </button>
          {deleteError && (
            <p> Error deleting article: {deleteError.message} </p>
          )}
        </div>
      )}
    </div>
  );
}
