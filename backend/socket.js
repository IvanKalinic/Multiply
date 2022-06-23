const socket = (io) => {
  console.log(`Sockets enabled`);

  io.on("connection", (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id);

    socket.on("reqTurn", (data) => {
      socket.broadcast.emit("playerTurn", data);
    });

    socket.on("create", (room) => {
      socket.join(room);
    });

    socket.on("join", (payload) => {
      socket.broadcast.emit("opponent_joined", payload);
    });

    socket.on("reqRestart", (room) => {
      socket.broadcast.emit("restart");
    });

    socket.on("nextGame", (gameNumber) => {
      socket.broadcast.emit("nextGame", gameNumber);
    });

    socket.on("battleWinner", (gameNumber) => {
      socket.broadcast.emit("battleWinner", gameNumber);
    });
  });
};

module.exports = socket;
