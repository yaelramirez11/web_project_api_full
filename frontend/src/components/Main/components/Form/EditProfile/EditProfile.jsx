import { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";

export default function EditProfile() {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, handleUpdateUser } = userContext;
  const [formData, setFormData] = useState({
    name: "",
    about: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        about: currentUser.about || "",
      });
    }
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateUser({
      name: formData.name,
      about: formData.about,
    });
  };
  return (
    <form className=" form" onSubmit={handleSubmit}>
      <input
        className="form__input form__input_name"
        type="text"
        placeholder="Nombre"
        minLength="2"
        maxLength="40"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <span className="form__input-error"></span>
      <input
        className="form__input form__input_about"
        type="text"
        placeholder="Acerca de mí"
        minLength="2"
        maxLength="200"
        name="about"
        value={formData.about}
        onChange={handleChange}
        required
      />
      <span className="form__input-error"></span>
      <button type="submit" className="form__submit">
        Guardar
      </button>
      <div className="loader" id="loader">
        <div className="loader__id" id="loader__circle"></div>
      </div>
    </form>
  );
}
