export default function Success() {
  return null;
}

/* ================= ALWAYS 404 PAGE ================= */
export async function getServerSideProps() {
  return {
    notFound: true,
  };
}
