const socket = (io) => {
  console.log(`Sockets enabled`);

  io.on("connection", (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id);

    console.log(id);
    socket.on("reqTurn", (data) => {
      // const room = data.room;
      // io.to(room).emit("playerTurn", data);
      socket.broadcast.emit("playerTurn", data);
    });

    socket.on("create", (room) => {
      socket.join(room);
    });

    socket.on("join", (room) => {
      socket.join(room);

      // io.to(room).emit("opponent_joined");

      socket.broadcast.emit("opponent_joined");
      console.log("OPP JOINED");
    });

    socket.on("reqRestart", (room) => {
      // const room = JSON.parse(data).room;
      // io.to(room).emit("restart");
      socket.broadcast.emit("restart");
    });
  });
};

module.exports = socket;
