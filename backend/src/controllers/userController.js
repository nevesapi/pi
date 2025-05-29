import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    const [existingUser] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "E-mail já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  } catch (error) {
    console.error("Erro ao cadastrar usuário: ", error);
    res.status(500).json({ error: "Erro interno no servidor" });
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

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Ops, credenciais inválidas!" });
    }

    res.json({ message: "Login bem-sucedido!" });
  } catch (error) {
    console.error("Erro ao tentar fazer login: ", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
