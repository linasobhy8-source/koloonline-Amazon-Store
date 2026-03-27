import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("✅ MongoDB Connected 🚀"))
.catch(err=>console.error("❌ MongoDB Connection Error:",err));

const AnalyticsSchema=new mongoose.Schema({
  asin:{type:String,required:true,index:true},
  click:{type:Number,default:0},
  cart:{type:Number,default:0},
  whatsapp:{type:Number,default:0},
  country:{type:Object,default:{}},
  createdAt:{type:Date,default:Date.now}
});
const Analytics=mongoose.model("Analytics",AnalyticsSchema);

app.post("/track",async(req,res)=>{
  try{
    const {asin,type,country} = req.body;
    if(!asin||!type) return res.status(400).json({success:false,message:"Missing asin or type"});
    let doc=await Analytics.findOne({asin});
    if(!doc) doc=new Analytics({asin});
    if(["click","cart","whatsapp"].includes(type)) doc[type]+=1;
    if(country) doc.country[country]=(doc.country[country]||0)+1;
    await doc.save();
    res.json({success:true});
  }catch(err){
    console.error("❌ Track Error:",err);
    res.status(500).json({success:false,error:err.message});
  }
});

app.get("/analytics",async(req,res)=>{
  try{
    const data=await Analytics.find();
    const totals={click:0,cart:0,whatsapp:0,buy:0,conversion:0};
    const countries={};
    const topProducts=[];
    data.forEach(doc=>{
      totals.click+=doc.click;
      totals.cart+=doc.cart;
      totals.whatsapp+=doc.whatsapp;
      for(let c in doc.country) countries[c]=(countries[c]||0)+doc.country[c];
      topProducts.push({asin:doc.asin,clicks:doc.click,orders:doc.cart,whatsapp:doc.whatsapp});
    });
    totals.conversion = totals.click ? ((totals.whatsapp / totals.click)*100).toFixed(2) : 0;
    res.json({success:true,totals,countries,topProducts});
  }catch(err){
    console.error("❌ Analytics Error:",err);
    res.status(500).json({success:false,totals:{},countries:{},topProducts:[]});
  }
});

app.get("/",(req,res)=>{res.send("Koloonline SaaS API Running 🚀");});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`🔥 Server running on port ${PORT}`));
