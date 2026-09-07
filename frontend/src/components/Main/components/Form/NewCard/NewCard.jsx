import { useRef } from "react";
export default function NewCard({ onAddPlaceSubmit }) {
  const titleRef = useRef();
  const linkRef = useRef();
  function handleSubmit(e) {
    e.preventDefault();
    onAddPlaceSubmit({
      name: titleRef.current.value,
      link: linkRef.current.value,
    });
  }

  return (
    <form className="form form_add-card" onSubmit={handleSubmit}>
      <input
        className="form__input form__input_title"
        type="text"
        placeholder="Título de la imagen"
        minLength="2"
        maxLength="30"
        name="title"
        required
        ref={titleRef}
      />
      <span className="form__input-error"></span>
      <input
        className="form__input form__input_link"
        type="url"
        placeholder="Enlace de la imagen"
        name="link"
        required
        ref={linkRef}
      />
      <span className="form__input-error"></span>
      <button type="submit" className="form__submit">
        Crear
      </button>
    </form>
  );
}
