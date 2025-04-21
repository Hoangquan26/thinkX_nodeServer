const mongoose = require("mongoose");
const { Schema } = mongoose;

const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "carts";

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  courses: [{
    type: Schema.Types.ObjectId,
    ref: "course"
  }]
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});
CartSchema.index({ user: 1 }); 
module.exports = mongoose.model(DOCUMENT_NAME, CartSchema);
