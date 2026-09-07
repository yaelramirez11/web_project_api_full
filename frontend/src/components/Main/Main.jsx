import { useContext } from "react";
import EditProfile from "./components/Form/EditProfile/EditProfile";
import Popup from "./components/Popup/Popup";
import NewCard from "./components/Form/NewCard/NewCard";
import EditAvatar from "./components/Form/EditAvatar/EditAvatar";
import Card from "./components/Card/Card";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Main({
  onOpenPopup,
  onClosePopup,
  popup,
  cards,
  onCardLike,
  onCardDelete,
  onAddPlaceSubmit,
}) {
  const { currentUser } = useContext(CurrentUserContext);
  const editProfilePopup = {
    title: "Editar Perfil",
    children: <EditProfile />,
  };
  const newCardPopup = {
    title: "Nuevo lugar",
    children: <NewCard onAddPlaceSubmit={onAddPlaceSubmit} />,
  };
  const editAvatar = {
    title: "Cambiar foto de perfil",
    children: <EditAvatar />,
  };

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__content">
          <div className="profile__avatar">
            <img
              src={currentUser.avatar}
              alt="Foto de perfil del usuario"
              className="profile__image"
            />
            <button
              className="profile__change-photo"
              aria-label="Foto de perfil"
              type="button"
              onClick={() => onOpenPopup(editAvatar)}
            ></button>
          </div>
          <div className="profile__data">
            <h1 className="profile__username">{currentUser.name}</h1>
            <button
              aria-label="Editar Perfil"
              className="profile__edit-info"
              type="button"
              onClick={() => onOpenPopup(editProfilePopup)}
            />
            <h2 className="profile__about-me">{currentUser.about}</h2>
          </div>
        </div>
        <button
          className="profile__add-profile"
          aria-label="Agregar nueva tarjeta"
          type="button"
          onClick={() => onOpenPopup(newCardPopup)}
        >
          +
        </button>
      </section>
      <section className="cards-container">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardLike={onCardLike}
            handleOpenPopup={onOpenPopup}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
      {popup && (
        <Popup onClose={onClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;
