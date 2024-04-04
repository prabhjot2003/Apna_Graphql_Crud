import { status } from "../utils/enum/enum";
import shortid from "shortid";

export default {
  _id: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: status,
    default: status.ACTIVE,
  },
}
