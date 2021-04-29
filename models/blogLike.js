const { Schema, model } = require("mongoose");

const BloglikeSchema = Schema({
  blogentrada: {
    type: Schema.Types.ObjectId,
    ref: "Blogentrada",
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

BloglikeSchema.methods.toJSON = function () {
  const { __v, _id, estado, ...bloglike } = this.toObject();
  bloglike.id = _id;
  return bloglike;
};

module.exports = model("Bloglike", BloglikeSchema);
