const express =require("express");
const cors=require("cors");
const app=express();
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Hello world👋");
});

app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from the API👋" });
});

const PORT=5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});