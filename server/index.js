import express from 'express';
import { pool } from './db.js';

const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/get-list', async (req, res) => {
  try {
    const list = await pool.query('SELECT * FROM list');

    res.status(200).json({
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

    res.status(200).json({
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

    res.status(200).json({
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

    res.status(200).json({
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

    res.status(200).json({
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

    res.status(200).json({
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

    res.status(200).json({
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

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});