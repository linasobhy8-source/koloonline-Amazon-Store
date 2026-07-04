
export async function getServerSideProps({ res }) {
  // منع الفهرسة (مهم لصفحات التواصل)
  res.setHeader("X-Robots-Tag", "noindex, follow");

  return {
    props: {},
  };
}

export default function Contact() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>

      <p style={styles.text}>
        This page is for support and communication only. It is not indexed by search engines.
      </p>

      <div style={styles.card}>
        <h3>📩 Support</h3>
        <p>Email: support@koloonline.online</p>
      </div>

      <
