import express from "express";

import {
  registerUser,
  loginUser,
  getUserByEmail,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUserByEmail);
router.post("/login", loginUser);
router.post("/cadastro", registerUser);
router.put("/:id", updateUser);

export default router;
