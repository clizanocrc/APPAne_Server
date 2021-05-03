const { Router } = require("express");
const { check } = require("express-validator");
const {
  getBlogs,
  getBlogByID,
  postBlog,
  putBlog,
  deleteBlog,
  postLike,
  postcomentario,
  putComentario,
  deleteComentario,
} = require("../controllers");
const { existeBlogID, existeBlogCommentID } = require("../helpers");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const router = Router();

router.get("/", [validarJWT, validarCampos], getBlogs);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeBlogID),
    validarCampos,
  ],
  getBlogByID
);

//Blog
router.post(
  "/",
  [
    validarJWT,
    check("titulo", "El título es obligatorio").not().isEmpty(),
    check("categoria", "La categoría es obligatoria").not().isEmpty(),
    check("categoria", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  postBlog
);

router.put(
  "/:id",
  [
    validarJWT,
    // check("titulo", "El título es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeBlogID),
    validarCampos,
  ],
  putBlog
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeBlogID),
    validarCampos,
  ],
  deleteBlog
);

// Likes
router.post(
  "/like/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeBlogID),
    validarCampos,
  ],
  postLike
);

//Comentarios

router.post(
  "/comment/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeBlogID),
    validarCampos,
  ],
  postcomentario
);

router.put(
  "/comment/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeBlogCommentID),
    validarCampos,
  ],
  putComentario
);

router.delete(
  "/comment/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeBlogCommentID),
    validarCampos,
  ],
  deleteComentario
);

module.exports = router;
