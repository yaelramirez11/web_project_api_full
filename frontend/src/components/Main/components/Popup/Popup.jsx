export default function Popup(props) {
  //los hijos son el contenido de la ventana emergente
  const { onClose, title, children } = props;
  return (
    <section className="popup popup_is-opened">
      <div className="popup__content">
        <button
          className="popup__close"
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
        ></button>
        <h3 className="popup__caption">{title}</h3>
        {children}
      </div>
    </section>
  );
}
