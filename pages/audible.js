import Head from "next/head";

export default function Audible() {
  return (
    <div style={{fontFamily:"Arial", padding:20, background:"#f3f3f3"}}>

      <Head>
        <title>Audible Free Trial | Start Listening Now</title>
        <meta name="description" content="Get Audible free trial. Listen to books instead of reading." />
      </Head>

      <div style={{maxWidth:600, margin:"auto", background:"#fff", padding:20, borderRadius:10}}>

        <h1>🎧 اسمع الكتب بدل ما تقرأ</h1>
        <p>جرّب Audible مجانًا واستمتع بآلاف الكتب الصوتية</p>

        <ul>
          <li>✔️ أول شهر مجاني</li>
          <li>✔️ آلاف الكتب</li>
          <li>✔️ مناسب للشغل والمواصلات</li>
        </ul>

        {/* زر أمازون */}
        <a href="https://www.amazon.com/dp/B07L5CHS6S?tag=koloonlinesto-20" target="_blank">
          <button style={{
            width:"100%",
            padding:15,
            background:"#ff9900",
            border:"none",
            fontSize:18,
            marginTop:10
          }}>
            🎧 ابدأ التجربة المجانية
          </button>
        </a>

        {/* زر واتساب */}
        <a href="https://wa.me/201XXXXXXXXX" target="_blank">
          <button style={{
            width:"100%",
            padding:12,
            background:"#25D366",
            color:"#fff",
            border:"none",
            marginTop:10
          }}>
            اسألني على واتساب
          </button>
        </a>

      </div>
    </div>
  );
}
