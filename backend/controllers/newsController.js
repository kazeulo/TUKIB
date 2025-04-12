const pool = require('../backend');

// Inserting news
const createNews = async (req, res) => {
  const { title, content, category, type } = req.body;

  try {
    if (!title || !content || !category || !type) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Insert the new news into the database
    const result = await pool.query(
      'INSERT INTO news_table (title, content, category, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, category, type]
    );

    res.status(201).json({ success: true, news: result.rows[0] });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ success: false, message: 'Error creating news' });
  }
};

// Controller to get all news posts
const getAllNews = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news_table ORDER BY created_at DESC');
    res.status(200).json({ success: true, news: result.rows });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ success: false, message: 'Error fetching news' });
  }
};

// Get a specific news post by ID
const getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM news_table WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.status(200).json({ success: true, news: result.rows[0] });
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    res.status(500).json({ success: false, message: 'Error fetching news' });
  }
};

// Update a specific news post by ID
const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, type } = req.body;

  try {
    // Validate inputs
    if (!title || !content || !category || !type) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Update the news post in the database
    const result = await pool.query(
      'UPDATE news_table SET title = $1, content = $2, category = $3, type = $4 WHERE id = $5 RETURNING *',
      [title, content, category, type, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.status(200).json({ success: true, news: result.rows[0] });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ success: false, message: 'Error updating news' });
  }
};

// delete a specific news post by ID
const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the news post from the database
    const result = await pool.query('DELETE FROM news_table WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.status(200).json({ success: true, message: 'News post deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ success: false, message: 'Error deleting news' });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
