const express=require("express");
const app = express();
const http=require("http").Server(app);
let io = require("socket.io")(http);
const path=require("path")

let users=[];
let userr={
    username:"",
    messages:[],
    color:""
};
let messages=[{user:{},message:"",color:""}];

app.use(express.static(__dirname + "/public/"));; // for serving the HTML file


io.on("connection",(socket)=>{
    console.log("Connected ..")

    socket.on("loggedIn",(user)=>{
        console.log(user.username+" has arrived our party")
        userr=user; 
        socket.user=user;
        users.push(user);
    
        console.log(user)
        io.emit("loggedIn",user);
    });

    socket.on("sendMessage",(data)=>{
        userr.messages.push(data.message)
        messages.push(data);
        io.emit("sendMessage",data);
    })

    socket.on("typing",(data)=>{
        if(data.typing==true){
            io.emit("display",data);
        }else{
            io.emit("display",data);
        }
    })
  
    socket.on("disconnect",()=>{   
        console.log(`${socket.user.username} has left party`)
        io.emit("userLeft", socket.username);
        users.splice(users.indexOf(socket), 1);
    })
})


http.listen(process.env.PORT || 3000 ,(err)=>{
    if (err){
        console.log(err);
    }
})