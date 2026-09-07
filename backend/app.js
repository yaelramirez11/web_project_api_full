require("dotenv").config();

const express = require("express");
const app = express();
const { login, createUser } = require("./controllers/users");
const usersRouter = require("./routes/users");
const auth = require("./middlewares/auth");
const cardsRouter = require("./routes/cards");
const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const {validateSignup, validateLogin} = require("./middlewares/validators");
const requestLogger = require("./middlewares/requestLogger");
const errorLogger = require("./middlewares/errorLogger");
const cors = require("cors");

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(express.json());
app.use(requestLogger);

app.use(cors());

// Endpoint para probar el crash test
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});

// Rutas públicas
app.post("/signin", validateLogin, login);
app.post("/signup", validateSignup, createUser);

// Protección global
app.use(auth);

// Rutas protegidas
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Recurso solicitado no encontrado" });
});

app.use(errors());

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
