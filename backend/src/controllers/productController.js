import { pool } from "../config/db.js";

export const listProducts = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM products");

    const productsURL = rows.map((product) => ({
      ...product,
      image: `${req.protocol}://${req.get("host")}/assets/${product.image_url}`,
    }));

    res.json(productsURL);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar produtos", error: error.message });
  }
};
