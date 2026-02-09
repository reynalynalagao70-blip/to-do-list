
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy, 1');
app.use(express.json());

app.use(cors({
    origin: 'https://to-do-list-ten-gold-45.vercel.app',
    credentials: true
}));


app.use(
  session({
    name: 'todo_sid',
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: 'none',

     }
  })
);



// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { name, password, confirm } = req.body;

    if (!name || !password || !confirm) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password !== confirm) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // CHECK IF USER EXISTS (name as username)
    const existingUser = await pool.query(
      'SELECT * FROM user_accounts WHERE username = $1',
      [name]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await hashPassword(password);

    await pool.query(
      'INSERT INTO user_accounts (name, username, password) VALUES ($1, $2, $3)',
      [name, name, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "Registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM user_accounts WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const user = result.rows[0];
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    // SAVE SESSION
    req.session.user = {
      id: user.id,
      name: user.name
    };

    res.status(200).json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET SESSION
app.get('/get-session', (req, res) => {
  if (req.session.user) {
    res.json({
      session: true,
      user: req.session.user
    });
  } else {
    res.json({
      session: false
    });
  }
});

// LOGOUT
app.post('/logout', (req, res) => {
  if (!req.session) {
    return res.status(400).json({
      success: false,
      message: "No active session"
    });
  }

  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }

    res.clearCookie('connect.sid');

    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
});


app.get('/get-list', async (req, res) => {
  try {
    const list = await pool.query('SELECT * FROM list');

    res.json({
      success: true,
      list: list.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/add-list', async (req, res) => {
  try {
    const { listTitle } = req.body;

    await pool.query(
      'INSERT INTO list (title, status) VALUES ($1, $2)',
      [listTitle, 'pending']
    );

    res.json({
      success: true,
      message: 'List item added successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/edit-list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    await pool.query(
      'UPDATE list SET title = $1, status = $2 WHERE id = $3',
      [title, status, id]
    );

    res.json({
      success: true,
      message: 'List updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/delete-list/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM list WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'List deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



app.get('/get-items/:list_id', async (req, res) => {
  try {
    const { list_id } = req.params;

    const items = await pool.query(
      'SELECT * FROM items WHERE list_id = $1',
      [list_id]
    );

    res.json({
      success: true,
      items: items.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/add-items', async (req, res) => {
  try {
    const { list_id, description } = req.body;

    await pool.query(
      'INSERT INTO items (list_id, description, status) VALUES ($1, $2, $3)',
      [list_id, description, 'pending']
    );

    res.json({
      success: true,
      message: 'Item added successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/edit-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status } = req.body;

    await pool.query(
      'UPDATE items SET description = $1, status = $2 WHERE id = $3',
      [description, status, id]
    );

    res.json({
      success: true,
      message: 'Item updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/delete-items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM items WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});