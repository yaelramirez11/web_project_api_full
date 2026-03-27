const jwt = require("jsonwebtoken");
const { JWT_SECRET = "dev-secret" } = process.env;
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  // 1. Verificar que exista el token
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).send({
      message: "Acceso prohibido",
    });
  }
  // 2. Extraer token real (sin "Bearer ")
  const tokenValue = token.replace("Bearer ", "");

  try {
    // 3. Verificar token
    const payload = jwt.verify(tokenValue, JWT_SECRET);

    // 4. Guardar payload (que contiene el JWT) en req.user
    req.user = payload;

    // 5. Continuar
    next();
  } catch (err) {
    return res.status(403).send({
      message: "Acceso prohibido",
    });
  }
};

module.exports = auth;
