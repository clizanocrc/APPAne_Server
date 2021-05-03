const jwt = require("jsonwebtoken");
const vidaToken = "4H";

// Genera Toquen
const generarJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: vidaToken,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el Token");
        }
        resolve(token);
      }
    );
  });
};
//Extrae el payload del token
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

const verificarJWT = (token = "") => {
  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    return [true, uid];
  } catch (error) {
    console.log(error);
    return [false, null];
  }
};

module.exports = {
  generarJWT,
  parseJwt,
  verificarJWT,
};
