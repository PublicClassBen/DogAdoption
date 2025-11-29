import mongoose from "mongoose";

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isAdopted: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
  },
  registeredUser: {
    type: String,
    required: true
  }
});

const Dog = mongoose.model("dog", dogSchema);

export { Dog };
