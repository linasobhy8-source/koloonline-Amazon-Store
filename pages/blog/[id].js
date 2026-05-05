import { useRouter } from "next/router";

export default function Article() {
  const router = useRouter();

  const { id } = router.query;

  return (
    <div style={{ padding: 20 }}>
      <h1>Article #{id}</h1>

      <p>
        ⚠️ دي نسخة Demo — هنربطها بـ Firebase في الخطوة الجاية
      </p>
    </div>
  );
}
