import express from "express";
import session from "express-session";
import cors from "cors";
import { pool } from "./db.js";
// Siguraduhin na tama ang path ng hash components mo
import { hashPassword, comparePassword } from "./components/hash.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
}));

const requireLogin = (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ message: "Unauthorized" });
    next();
};

// --- AUTH ROUTES ---
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (result.rows.length === 0) return res.status(401).json({ message: "User not found" });
    
    const user = result.rows[0];
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    req.session.user = { id: user.id, username: user.username };
    res.json({ success: true });
});

// --- LIST ROUTES ---
app.get("/get-list", requireLogin, async (req, res) => {
    const result = await pool.query("SELECT * FROM list WHERE user_id=$1", [req.session.user.id]);
    res.json({ success: true, list: result.rows });
});

app.post("/add-list", requireLogin, async (req, res) => {
    const { listTitle } = req.body;
    await pool.query("INSERT INTO list (title, status, user_id) VALUES ($1, 'pending', $2)", [listTitle, req.session.user.id]);
    res.json({ success: true });
});

app.delete("/delete-list/:id", requireLogin, async (req, res) => {
    await pool.query("DELETE FROM list WHERE id=$1 AND user_id=$2", [req.params.id, req.session.user.id]);
    res.json({ success: true });
});

// --- ITEM ROUTES ---
app.get("/get-items/:id", requireLogin, async (req, res) => {
    const result = await pool.query("SELECT * FROM items WHERE list_id=$1", [req.params.id]);
    res.json({ success: true, items: result.rows });
});

app.post("/add-items", requireLogin, async (req, res) => {
    const { list_id, description } = req.body;
    await pool.query("INSERT INTO items (description, status, list_id) VALUES ($1, 'pending', $2)", [description, list_id]);
    res.json({ success: true });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));