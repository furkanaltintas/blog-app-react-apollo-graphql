import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import ArticleList from "./components/articles/List/ArticleList";
import ArticleAdd from "./components/articles/Add/ArticleAdd";
import ArticleDetail from "./components/articles/Detail/ArticleDetail";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";

import "./App.css";

// Modern Apollo Client tanımı
const client = new ApolloClient({
  uri: "http://localhost:5000/", // GraphQL sunucu adresi (// ❗️Sunucunun doğru endpoint’i olduğuna dikkat et)
  cache: new InMemoryCache(), // ✅ Zorunlu: Apollo'nun cache mekanizması
});

function App() {
  return (
    <div className="app-wrapper">
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ArticleList />} />
              <Route path="/makale-ekle" element={<ArticleAdd />} />
              <Route path="/makale/:id" element={<ArticleDetail />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
