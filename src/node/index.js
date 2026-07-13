const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 5964;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_k_umaki",
  host: "localhost",
  database: "db_k_umaki",
  password: "5Rw5YDaWc5jc",
  port: 5432,
});

app.use(express.static("public"));

// 一覧取得
app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// 1件取得(新規追加分)
app.get("/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// 新規登録
app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM customers WHERE customer_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { companyName, industry, contact, location } = req.body;
  try {
    const result = await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4, updated_date = now() WHERE customer_id = $5 RETURNING *",
      [companyName, industry, contact, location, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// サーバー起動(必ず最後)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
