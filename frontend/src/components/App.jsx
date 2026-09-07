import "../index.css";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import { useState, useEffect } from "react";
import api from "../utils/api.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { signin, signup, checkToken } from "../utils/auth.js";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";

function App() {
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [popup, setPopup] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (loggedIn && token) {
      api
        .getUserinfoFromServer()
        .then((userData) => {
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.error("Error al obtener el usuario:", err);
        });
    }
  }, [loggedIn]);

  function handleOpenPopup(popup) {
    setPopup(popup);
  }
  function handleClosePopup() {
    setPopup(null);
  }

  const handleUpdateUser = (userData) => {
    (async () => {
      await api.updateUserInfo(userData).then((updatedUser) => {
        setCurrentUser(updatedUser);
        handleClosePopup();
      });
    })();
  };

  const handleUpdateAvatar = (userData) => {
    (async () => {
      await api.changePfP(userData.avatar).then((updatedUser) => {
        setCurrentUser(updatedUser);
        handleClosePopup();
      });
    })();
  };
  async function handleCardDelete(card) {
    try {
      await api.deleteCard(card._id);

      setCards((state) =>
        state.filter((currentCard) => currentCard._id !== card._id),
      );
    } catch (error) {
      console.error(error);
    }
  }
  async function handleCardLike(card) {
    const isLiked = card.likes.some((id) => id === currentUser._id);
    await api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard,
          ),
        );
      })
      .catch((error) => console.error(error));
  }

  const [cards, setCards] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (loggedIn && token) {
      api
        .getInitialCards()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => {
          console.error("Error al obtener las tarjetas:", err);
        });
    }
  }, [loggedIn]);

  function handleAddPlaceSubmit({ name, link }) {
    api
      .updateCards(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const navigate = useNavigate();

  // Invocar el hook useLocation. Es necesario invocar el hook en ambos componentes.
  const location = useLocation();

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password !== confirmPassword) {
      setIsSuccess(false);
      setIsInfoTooltipOpen(true);
      return;
    }
    signup(email, password)
      .then(() => {
        setIsSuccess(true);
        setIsInfoTooltipOpen(true);
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      })
      .catch(() => {
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  // handleLogin acepta un parámetro: un objeto con dos propiedades.
  const handleLogin = ({ email, password }) => {
    // si el nombre de usuario o la contraseña están vacíos, no se envía la solicitud.
    if (!email || !password) {
      return;
    }
    // Pasamos el email y la contraseña como argumentos de posición. La
    // antes de enviar una solicitud al servidor porque eso es lo que la
    // API espera.
    signin(email, password)
      .then((data) => {
        // Verifica que se incluyó un jwt antes de iniciar la sesión del usuario.
        if (data.token) {
          localStorage.setItem("jwt", data.token); //guarda el token en el almacenamiento local
          // setUserData({ username: data.user.username, email: data.user.email }); // guardar los datos de usuario en el estado
          setLoggedIn(true); // inicia la sesión del usuario
          // Después de iniciar sesión, en lugar de navegar todo el tiempo a /,
          // navega a la ubicación que se almacena en state. Si
          // no hay ubicación almacenada, por defecto redirigimos a /.
          const redirectPath = location.state?.from?.pathname || "/";
          navigate(redirectPath);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      return;
    }

    checkToken(jwt)
      .then((data) => {
        setLoggedIn(true);
        setUserData({ email: data.email });
      })
      .catch(console.error);
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
    >
      <div className="body">
        <div className="page">
          <Routes>
            <Route
              path="/signup"
              element={
                <ProtectedRoute loggedIn={loggedIn} anonymous>
                  <Register handleRegistration={handleRegistration} />
                </ProtectedRoute>
              }
            />
            {/*esto significa localhost:3000/signup*/}
            <Route
              path="/signin"
              element={
                <ProtectedRoute loggedIn={loggedIn} anonymous>
                  <Login handleLogin={handleLogin} />
                </ProtectedRoute>
              }
            />
            {/*esto significa localhost:3000/login*/}
            <Route
              path="/"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <>
                    <Header />
                    <Main
                      onOpenPopup={handleOpenPopup}
                      onClosePopup={handleClosePopup}
                      popup={popup}
                      cards={cards}
                      onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}
                      onAddPlaceSubmit={handleAddPlaceSubmit}
                    />
                    <Footer />
                  </>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/signin" />} />
            {/*Si el usuario intenta entrar a cualquier ruta que no existe, lo mandamos a /signin.*/}
          </Routes>
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            isSuccess={isSuccess}
            onClose={() => setIsInfoTooltipOpen(false)}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
