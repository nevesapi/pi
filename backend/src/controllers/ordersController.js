import { pool } from "../config/db.js";

export const createOrder = async (req, res) => {
  const { user_id, email, items, address } = req.body;

  if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Dados inválidos para criação do pedido." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `INSERT INTO orders 
      (user_id, email, total_price, cep, logradouro, bairro, localidade, uf) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        email || null,
        0,
        address?.cep || null,
        address?.logradouro || null,
        address?.bairro || null,
        address?.localidade || null,
        address?.uf || null,
      ]
    );

    const orderId = orderResult.insertId;
    let totalPrice = 0;

    for (const item of items) {
      const { product_id, quantity } = item;

      const [[product]] = await conn.query(
        "SELECT name, price FROM products WHERE id = ?",
        [product_id]
      );

      if (!product) {
        throw new Error(`Falha ao buscar produto.`);
      }

      const itemTotal = product.price * quantity;
      totalPrice += itemTotal;

      await conn.query(
        `INSERT INTO order_items 
         (order_id, product_id, product_name, quantity, unit_price, total_price) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, product_id, product.name, quantity, product.price, itemTotal]
      );
    }

    await conn.query("UPDATE orders SET total_price = ? WHERE id = ?", [
      totalPrice,
      orderId,
    ]);

    await conn.commit();

    res.status(201).json({
      message: "Pedido criado com sucesso.",
      order_id: orderId,
      total_price: totalPrice,
    });
  } catch (error) {
    await conn.rollback();
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ message: "Erro ao criar pedido." });
  } finally {
    conn.release();
  }
};

export const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const [orders] = await pool.query(
      `SELECT 
        orders.id AS order_id,
        orders.total_price AS order_total,
        orders.created_at AS order_date,
        order_items.product_name AS item_name,
        order_items.quantity AS item_quantity,
        order_items.unit_price AS item_price,
        order_items.total_price AS item_total_price
      FROM orders
      INNER JOIN order_items 
      ON orders.id = order_items.order_id
      WHERE orders.user_id = ?
      ORDER BY orders.created_at`,
      [userId]
    );

    res.json(orders);
  } catch (error) {
    console.error("Falha ao buscar pedidos", error);
    res.status(500).json({ message: "Erro interno ao buscar pedidos" });
  }
};
