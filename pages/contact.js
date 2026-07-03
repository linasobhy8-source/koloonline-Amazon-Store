export async function getServerSideProps({ res }) {
  res.setHeader("X-Robots-Tag", "noindex, follow");

  return {
    props: {},
  };
}

export default function Contact() {
  return <div>Contact</div>;
}
