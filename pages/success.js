export async function getServerSideProps({ res }) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  return {
    props: {},
  };
}

export default function Success() {
  return <div>Success</div>;
}
