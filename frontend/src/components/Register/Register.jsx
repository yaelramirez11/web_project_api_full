import { Link } from "react-router-dom";
import { useState } from "react";
import aroundTheUs from "../../images/Vector.png";
import line from "../../images/Line.png";

const Register = ({ handleRegistration }) => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Declarar una función de gestión de envíos. Esta función solo necesita
  // evitar el comportamiento por defecto del navegador, comprobar que las contraseñas coincidan
  // o de lo contrario marcar error al usuario y sacar confirmPassword del objeto
  // y guarda el resto en registrationData, así confirmPassword no se envía al backend.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // const { username, confirmPassword, ...registrationData } = data;
    handleRegistration(data);
  };

  return (
    <div className="login">
      <div className="login__header">
        <img
          src={aroundTheUs}
          alt="Logo de Around the US"
          className="login__logo"
        />

        <Link to="/signin" className="login__register-link">
          Iniciar sesión
        </Link>
      </div>

      <img src={line} alt="Línea blanca" className="login__line" />

      <h2 className="login__title">Regístrate</h2>

      <form className="login__form" onSubmit={handleSubmit}>
        <input
          className="login__input"
          id="username"
          name="username"
          type="text"
          placeholder="Nombre de usuario"
          value={data.username}
          onChange={handleChange}
          required
        />

        <input
          className="login__input"
          id="email"
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={data.email}
          onChange={handleChange}
          required
        />

        <input
          className="login__input"
          id="password"
          name="password"
          type="password"
          placeholder="Contraseña"
          value={data.password}
          onChange={handleChange}
          required
        />

        <input
          className="login__input"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirma la contraseña"
          value={data.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login__submit-button">
          Regístrate
        </button>
      </form>

      <p className="login__signup">
        ¿Ya eres miembro?{" "}
        <Link to="/signin" className="login__signup-link">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
};

export default Register;
