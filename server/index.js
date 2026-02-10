import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); // Inayos ang typo sa quote
app.use(express.json());

app.use(cors({
    origin: 'https://to-do-list-ten-gold-45.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Siguradong allowed ang edit at delete
    credentials: true
}));

app.use(
    session({
        name: 'todo_sid',
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: true, // Gawing true kung naka-HTTPS (Render)
            httpOnly: true,
            sameSite: 'none',
        }
    })
);

// --- AUTH ROUTES ---

app.post('/register', async (req, res) => {
    try {
        const { name, password, confirm } = req.body;
        if (!name || !password || !confirm) return res.status(400).json({ success: false, message: "All fields are required" });
        if (password !== confirm) return res.status(400).json({ success: false, message: "Passwords do not match" });

        const existingUser = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [name]);
        if (existingUser.rows.length > 0) return res.status(400).json({ success: false, message: "User already exists" });

        const hashedPassword = await hashPassword(password);
        await pool.query('INSERT INTO user_accounts (name, username, password) VALUES ($1, $2, $3)', [name, name, hashedPassword]);

        res.status(201).json({ success: true, message: "Registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(401).json({ success: false, message: "Invalid username or password" });

        const user = result.rows[0];
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid username or password" });

        req.session.user = { id: user.id, name: user.name };
        res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: "Logout failed" });
        // MAHALAGA: Dapat match ang options sa session cookie para ma-clear
        res.clearCookie('todo_sid', {
            path: '/',
            secure: true,
            sameSite: 'none',
            httpOnly: true
        });
        res.json({ success: true, message: "Logged out successfully" });
    });
});

app.get('/get-session', (req, res) => {
    if (req.session.user) {
        res.json({ session: true, user: req.session.user });
    } else {
        res.json({ session: false });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: "Logout failed" });
        res.clearCookie('todo_sid');
        res.json({ success: true, message: "Logged out successfully" });
    });
});

// --- LIST ROUTES (Para sa ListItem.jsx) ---

app.get('/get-list', async (req, res) => {
    try {
        const list = await pool.query('SELECT * FROM list ORDER BY id DESC');
        res.json({ success: true, list: list.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/add-list', async (req, res) => {
    try {
        const { listTitle } = req.body;
        await pool.query('INSERT INTO list (title, status) VALUES ($1, $2)', [listTitle, 'pending']);
        res.json({ success: true, message: 'List item added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/edit-list/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { listTitle } = req.body; // Inayos para mag-match sa Frontend
        await pool.query('UPDATE list SET title = $1 WHERE id = $2', [listTitle, id]);
        res.json({ success: true, message: 'List updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/delete-list/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Optional: Burahin din ang items sa loob ng list bago burahin ang list
        await pool.query('DELETE FROM items WHERE list_id = $1', [id]);
        await pool.query('DELETE FROM list WHERE id = $1', [id]);
        res.json({ success: true, message: 'List deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- ITEM ROUTES (Para sa ListItemsDetail.jsx) ---

app.get('/get-items/:list_id', async (req, res) => {
    try {
        const { list_id } = req.params;
        const items = await pool.query('SELECT * FROM items WHERE list_id = $1 ORDER BY id DESC', [list_id]);
        res.json({ success: true, items: items.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/add-items', async (req, res) => {
    try {
        const { list_id, description } = req.body;
        await pool.query('INSERT INTO items (list_id, description, status) VALUES ($1, $2, $3)', [list_id, description, 'pending']);
        res.json({ success: true, message: 'Item added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Inayos ang endpoint name: /edit-item para mag-match sa frontend call
app.put('/edit-item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        await pool.query('UPDATE items SET description = $1 WHERE id = $2', [description, id]);
        res.json({ success: true, message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Inayos ang endpoint name: /delete-item para mag-match sa frontend call
app.delete('/delete-item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM items WHERE id = $1', [id]);
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});