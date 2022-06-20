const socket = (io) => {
  console.log(`Sockets enabled`);

  io.on("connection", (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id);

    socket.on("reqTurn", (data) => {
      // const room = data.room;
      // io.to(room).emit("playerTurn", data);
      socket.broadcast.emit("playerTurn", data);
    });

    socket.on("create", (room) => {
      socket.join(room);
    });

    socket.on("join", (payload) => {
      socket.broadcast.emit("opponent_joined", payload);
      console.log("OPP JOINED");
    });

    socket.on("reqRestart", (room) => {
      // const room = JSON.parse(data).room;
      // io.to(room).emit("restart");
      socket.broadcast.emit("restart");
    });

    socket.on("nextGame", (gameNumber) => {
      // const room = JSON.parse(data).room;
      // io.to(room).emit("restart");
      socket.broadcast.emit("nextGame", gameNumber);
    });

    socket.on("battleWinner", (gameNumber) => {
      // const room = JSON.parse(data).room;
      // io.to(room).emit("restart");
      socket.broadcast.emit("battleWinner", gameNumber);
    });
  });
};

module.exports = socket;
