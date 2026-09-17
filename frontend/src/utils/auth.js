// Especifica la BASE_URL para la API.
export const BASE_URL = "https://api.aroundx.chickenkiller.com";

// La función registrada acepta los datos necesarios como argumentos,
// y envía una solicitud POST al endpoint dado.
export const signup = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  });
};

// La función de autorización acepta los datos necesarios como parámetros.
export const signin = (email, password) => {
  // Se envía una solicitud POST a /auth/local.
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // Los parámetros se envuelven en un objeto, convertido en un string
    // JSON y se envían en el cuerpo de la solicitud.
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  });
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  });
};
