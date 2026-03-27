const express = require("express");
const app = express();
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(express.json());

const allowedCors = ["http://localhost:3000", "http://localhost:3001"];

const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  const { method } = req;

  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);

    const requestHeaders = req.headers["access-control-request-headers"];
    res.header("Access-Control-Allow-Headers", requestHeaders);

    return res.end();
  }

  next();
});

// MIDDLEWARE TEMPORAL DE USUARIO
app.use((req, res, next) => {
  req.user = {
    _id: "699e320d22afa209b211e08d",
  };
  next();
});

// Rutas
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Recurso solicitado no encontrado" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
