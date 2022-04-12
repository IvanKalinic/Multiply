const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io")
const authRoute = require("./routes/auth");
const questionRoute = require("./routes/questions");
const userRoute = require("./routes/users");
const socket = require("./socket")

const app = express();
dotenv.config();

const allowedOrigins = [`${process.env.CLIENT_URL}`];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:`${process.env.CLIENT_URL}`,
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
  }
})

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());

app.use("/auth", authRoute);
app.use("/questions", questionRoute);
app.use("/users", userRoute);

app.get("/", (req, res) => {
  req.header("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
  req.header("Access-Control-Request-Method",`${process.env.CLIENT_URL}`);
});

server.listen("5001", () => {
  console.log("Server is running");
  socket({io})
});
