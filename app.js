const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ================= DB =================
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log("❌ DB Error:",err));

// ================= MODELS =================
const trackSchema = new mongoose.Schema({
  event:String,
  asin:String,
  timestamp:String
});
const Track = mongoose.model("Track",trackSchema);

// ================= PRODUCTS API =================
app.get("/api/products",(req,res)=>{
  const products=[
    {
      asin:"B09V7Z4TJG",
      title:"Smart Watch Pro",
      image:"https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",
      rating:"4.5"
    },
    {
      asin:"B08G9P7N2X",
      title:"Wireless Earbuds",
      image:"https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg",
      rating:"4.3"
    }
  ];
  res.json({products});
});

// ================= TRACK =================
app.post("/api/track", async (req,res)=>{
  try{
    await Track.create(req.body);
    res.json({success:true});
  }catch{
    res.json({success:false});
  }
});

// ================= ANALYTICS =================
app.get("/api/analytics", async (req,res)=>{
  const data = await Track.find();

  let totalClicks=0,totalOrders=0,totalWhatsApp=0;
  let map={};

  data.forEach(d=>{
    if(!map[d.asin]) map[d.asin]={clicks:0,orders:0,whatsapp:0};

    if(d.event==="product_open"){
      totalClicks++;
      map[d.asin].clicks++;
    }
    if(d.event==="order"){
      totalOrders++;
      map[d.asin].orders++;
    }
    if(d.event==="whatsapp"){
      totalWhatsApp++;
      map[d.asin].whatsapp++;
    }
  });

  res.json({
    success:true,
    totalClicks,
    totalOrders,
    totalWhatsApp,
    topProducts:Object.keys(map).map(k=>({asin:k,...map[k]}))
  });
});

// ================= START =================
app.listen(3000,()=>console.log("🚀 Server running"));
