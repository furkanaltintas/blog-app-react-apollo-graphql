import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>&copy; {new Date().getFullYear()} Makale Blog. Tüm hakları saklıdır.</p>
      <p>Developed by Furkan Altıntaş</p>
    </footer>
  );
}