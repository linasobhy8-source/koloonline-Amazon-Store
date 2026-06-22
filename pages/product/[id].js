export default function ProductPage() {
return (
<div style={{ padding: 20 }}>
Product Test
</div>
);
}

export async function getStaticProps() {
return {
props: {},
revalidate: 60,
};
}

export async function getStaticPaths() {
return {
paths: [
{
params: {
id: "B0GWTCCHFZ",
},
},
],
fallback: false,
};
}
