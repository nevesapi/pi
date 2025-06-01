import express from "express";

import {
  registerUser,
  loginUser,
  getUserByEmail,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/cadastro", registerUser);
router.post("/login", loginUser);
router.get("/", getUserByEmail);

export default router;
