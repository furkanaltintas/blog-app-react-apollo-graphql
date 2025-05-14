import { Link } from "react-router-dom";

import "./Header.css";

export default function Header() {
  return (
    <nav className="header">
      <div className="logo">
        <Link to="/">📝 Blog</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Makale Listesi</Link>
        <Link to="/makale-ekle">Makale Ekle</Link>
      </div>
    </nav>
  );
}
