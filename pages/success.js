export default function Success() {
  return null;
}

export async function getServerSideProps() {
  return {
    notFound: true,
  };
}
