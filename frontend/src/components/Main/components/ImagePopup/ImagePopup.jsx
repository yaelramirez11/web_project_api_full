export default function ImagePopup({ card }) {
  return (
    <div className="popup__content-show-image">
      <img className="popup__image" src={card.link} alt="Imagen del lugar" />
      <p className="popup__image-caption">{card.name}</p>
    </div>
  );
}
