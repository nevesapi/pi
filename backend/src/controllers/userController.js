import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    const [existingUser] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    console.log("Encontrando user: " + existingUser);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "E-mail já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [rows] = await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    console.log("Cadastrando Usuário: " + rows);

    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      res.status(401).json({ message: "Ops, credenciais inválidas!" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    console.log(rows);

    isMatch
      ? res.json({ message: "Login bem-sucedido!" })
      : res.status(401).json({ message: "Ops, credenciais inválidas!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};
