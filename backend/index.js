const main =  require('./db');
const cors =require('cors')
const express =require('express');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoute")
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// const { body } = require('express-validator');
main;

const app = express()
const port = 6001

app.use(express.json())
app.use(cors())


//Available Routes
app.use('/api/auth',require('./routes/auth'))
 app.use('/api/cases',require('./routes/cases'))
app.use('/api/autharbitrator',require('./routes/authArbitrator'))
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes)
// app.use('/api/message',require('./routes/messages'));
const server = app.listen(port,()=>{
  console.log(`example app listening at http://localhost:${port}`)
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
    methods:["GET","POST"]
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
 
  // messages
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", (userData) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});