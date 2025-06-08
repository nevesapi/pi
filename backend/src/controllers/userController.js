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

    const [rows] = await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      user: {
        id: rows.insertId,
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário: ", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      res
        .status(401)
        .json({ message: "Ops, falha ao fazer login. Tente novamente" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res
        .status(401)
        .json({ message: "Ops, falha ao fazer login. Tente novamente" });
    }

    res.json({
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro ao tentar fazer login: ", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email é obrigatório" });
  }

  try {
    const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (result.length > 0) {
      const user = result[0];
      return res.json({
        message: "Busca executada com exito",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      return res.status(404).json({ message: "Ops! Falha ao buscar usuário!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ message: "Dados atualizados com sucesso!" });
  }

  try {
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (email) {
      const [emailExists] = await pool.query(
        "SELECT * FROM users WHERE email = ? AND id !== ?",
        [email, id]
      );

      if (emailExists.length > 0) {
        return res
          .status(409)
          .json({ message: "Ops, falha ao atualizar dados! Tente novamente!" });
      }
    }

    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }

    if (email) {
      fields.push("email = ?");
      values.push(email);
    }

    values.push(id);

    const updateQuery = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    await pool.query(updateQuery, values);

    return res.status(200).json({ message: "Dados atualizados com sucesso." });
  } catch (error) {
    console.error("Falha ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro no servidor." });
  }
};
