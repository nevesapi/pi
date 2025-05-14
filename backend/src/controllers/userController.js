import { pool } from "../config/db.js";

export const registerUser = async (req, res) => {
  const { nome, email, password } = req.body;

  if (!nome || !email || !password) {
    res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    const [rows] = await pool.execute(
      "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, password]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ? AND senha = ?",
      [email, password]
    );

    rows.length > 0
      ? res.json({ message: "Login bem-sucedido!" })
      : res.status(401).json({ message: "Ops, credenciais inválidas!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};
