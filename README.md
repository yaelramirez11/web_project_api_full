Around the U.S. — web_project_api_full

Proyecto final del sprint 19 de TripleTen: aplicación full-stack tipo red social de lugares, con registro/login, perfil de usuario y tarjetas (CRUD + likes).

Enlaces de producción:

| Frontend | [https://aroundx.chickenkiller.com](https://aroundx.chickenkiller.com) |

| Backend (API) | [https://api.aroundx.chickenkiller.com](https://api.aroundx.chickenkiller.com) |

Descripción

El frontend (React + Vite) se comunica con una API REST propia (Express + MongoDB). La autenticación usa JWT: el usuario inicia sesión, el servidor firma un token y el cliente lo envía en las peticiones protegidas.

Tecnologías

**Frontend**

- React 19, React Router, Vite

**Backend**

- Node.js, Express 5

- MongoDB + Mongoose

- JWT (jsonwebtoken) + bcrypt

- Validación con Celebrate / Joi

- Logs con Winston

- CORS, dotenv

**Despliegue**

- Google Cloud (VM Ubuntu)

- PM2 (proceso de la API)

- Nginx (proxy inverso + archivos estáticos)

- Let's Encrypt (HTTPS)

- FreeDNS (dominios)

Estructura del repositorio

web_project_api_full/

├── frontend/     # App React (Vite)

├── backend/      # API Express

└── [README.md](http://README.md)