const socket = ({ io }) => {
  console.log(`Sockets enabled`);

  io.on("connection", (socket) => {
    socket.on("reqTurn", (data) => {
      const room = JSON.parse(data).room;
      io.to(room).emit("playerTurn", data);
    });

    socket.on("create", (room) => {
      socket.join(room);
      console.log(room);
    });

    socket.on("join", (room) => {
      socket.join(room);
      io.to(room).emit("opponent_joined");
    });

    socket.on("reqRestart", (data) => {
      const room = JSON.parse(data).room;
      io.to(room).emit("restart");
    });
  });
};

module.exports = socket;
