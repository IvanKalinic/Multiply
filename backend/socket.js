const socket = (io) => {
  console.log(`Sockets enabled`);

  io.on("connection", (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id);

    console.log(id);
    socket.on("reqTurn", (data) => {
      // const room = JSON.parse(data).room;
      socket.broadcast.emit("playerTurn", data);
    });

    socket.on("create", (room) => {
      socket.join(room);
    });

    socket.on("join", (room) => {
      socket.join(room);
      socket.broadcast.emit("opponent_joined");
      console.log("OPP JOINED");
    });

    socket.on("reqRestart", (room) => {
      // const room = JSON.parse(data).room;
      socket.emit("restart");
    });
  });
};

module.exports = socket;
