const { instrument } = require("@socket.io/admin-ui");

const io = require("socket.io")(3002, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});

const userIo = io.of("/user");

userIo.on("connection", (socket) => {
  console.log("connected to user name space " + socket.username);
});

userIo.use((socket, next) => {
  console.log(socket.handshake.auth.token, "socket.handshake.auth.token");
  if (socket.handshake.auth.token) {
    socket.username = socket.handshake.auth.token;
    next();
  } else {
    next(new Error("auth not passed"));
  }
});

io.on("connection", (socket) => {
  console.log(socket.id);

  // socket.on("send-message", (message) => {
  //   console.log(message);

  //   // io.emit("receive-message", message);
  //   socket.broadcast.emit("receive-message", message);
  // });

  socket.on("send-message", (message, room) => {
    if (room === "") {
      socket.broadcast.emit("receive-message", message);
    } else {
      socket.to(room).emit("receive-message", message);
    }
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb("joined room with room id ---- " + room);
  });

  socket.on("ping", (n) => console.log(n));
});

instrument(io, { auth: false });
