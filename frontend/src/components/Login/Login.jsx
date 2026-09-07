import { Link } from "react-router-dom";
import { useState } from "react";
import aroundTheUs from "../../images/Vector.png";
import line from "../../images/Line.png";

const Login = ({ handleLogin }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(data);
  };

  return (
    <div className="login">
      <div className="login__header">
        <img
          src={aroundTheUs}
          alt="Logo de Around the US"
          className="login__logo"
        />

        <Link to="/signup" className="login__register-link">
          Regístrate
        </Link>
      </div>
      <img src={line} alt="Línea blanca" className="login__line" />
      <h2 className="login__title">Inicia sesión</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <input
          className="login__input"
          name="email"
          type="email"
          placeholder="Correo electrónico"
          required
          value={data.email}
          onChange={handleChange}
        />

        <input
          className="login__input"
          name="password"
          type="password"
          placeholder="Contraseña"
          required
          value={data.password}
          onChange={handleChange}
        />

        <button className="login__submit-button" type="submit">
          Inicia sesión
        </button>
      </form>

      <p className="login__signup">
        ¿Aún no eres miembro?{" "}
        <Link to="/signup" className="login__signup-link">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

export default Login;
