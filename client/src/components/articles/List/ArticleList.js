import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";

import "./ArticleList.css";

const ARTICLE_LIST = gql`
  query {
    makalelerGetir {
      id
      baslik
      icerik
    }
  }
`;

export default function ArticleList() {
  const { loading, error, data } = useQuery(ARTICLE_LIST);

  if (loading) return <p>Makaleler Yükleniyor</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data.makalelerGetir.length > 0 ? (
        <div className="article-list">
          {data.makalelerGetir.map((makale) => (
            <div className="article-card" key={makale.id}>
              <Link to={`/makale/${makale.id}`}>
                <h2>{makale.baslik}</h2>
              </Link>
              <p>
                {makale.icerik.length > 100
                  ? makale.icerik.substring(0, 100) + "..."
                  : makale.icerik}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="article-empty-container">
          <p className="article-empty">Listede blog bulunmamaktadır</p>
        </div>
      )}
    </>
  );
}
