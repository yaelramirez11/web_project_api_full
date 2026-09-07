import Popup from "../../components/Main/components/Popup/Popup";
import successIcon from "../../images/authorized.svg";
import errorIcon from "../../images/notAuthorized.svg";

function InfoTooltip({ isOpen, onClose, isSuccess }) {
  const message = isSuccess
    ? "¡Correcto! Ya estás registrado."
    : "Uy, algo salió mal. Por favor, inténtalo de nuevo.";
  const icon = isSuccess ? successIcon : errorIcon;
  if (!isOpen) return null;

  return (
    <Popup onClose={onClose} title="">
      <div className="infotooltip">
        <img
          src={icon}
          alt={isSuccess ? "Registro exitoso" : "Error en el registro"}
          className="infotooltip__icon"
        />
        <p className="infotooltip__text">{message}</p>
      </div>
    </Popup>
  );
}

export default InfoTooltip;
