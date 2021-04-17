const { request, response } = require("express");

const esAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      ok: false,
      msg: "Verificación del rol sin token validado",
    });
  }
  const { rol, nombre } = req.usuario;
  if (rol !== "SUPER_ADMIN_ROLE" && rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      ok: false,
      msg: `El Usuario ${nombre}, no está autorizado para ejecutar esta acción`,
    });
  }

  next();
};

const tieneRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        ok: false,
        msg: "Verificación del rol sin token validado",
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        ok: false,
        msg: `El servicio requiere uno de estos roles: ${roles}`,
      });
    }
    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRole,
};
