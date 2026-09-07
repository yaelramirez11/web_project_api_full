import { useRef, useContext } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";
export default function EditAvatar() {
  const avatarRef = useRef();
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateAvatar({
      avatar: avatarRef.current.value, // Obtener el valor usando la ref
    });
  };
  return (
    <form className="form form_update-avatar" onSubmit={handleSubmit}>
      <input
        className="form__input form__input_avatar-link"
        type="url"
        name="avatar"
        placeholder="Enlace de la nueva imagen"
        required
        ref={avatarRef}
      />
      <span className="form__input-error"></span>
      <button type="submit" className="form__submit">
        Guardar
      </button>
    </form>
  );
}
