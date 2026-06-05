import "../styles/globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />
    </>
  );
}
