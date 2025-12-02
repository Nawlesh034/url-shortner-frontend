// config.js
const isProduction = window.location.hostname !="localhost";

const apiUrl = isProduction
  ? "https://url-shortner-backend-0aqe.onrender.com"
  : "http://localhost:8001";

export default apiUrl;
