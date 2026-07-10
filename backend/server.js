const express=require('express');
const cors=require('cors');

const app=express();
const PORT=5000;

app.use(cors());
app.use(express.json());

app.get("/",(req,resp)=>{
    res.send("Device Management is Runninng");
})

app.get("/api/devices",(req,resp)=>{
    resp.json([
        {id:1,name:"Device 1",status:"Active"},
        {id:2,name:"Device 2",status:"Inactive"},
        {id:3,name:"Device 3",status:"Active"},
        {id:4,name:"Device 4",status:"Inactive"},
        {id:5,name:"Device 5",status:"Active"}
    ])
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})