const getStores = async (req, res) => {
  try {
    const { search = '', page = 1 } = req.query;
    const pageNum = Number(page);
    const limitNum = 6;
    const offset = (pageNum - 1) * limitNum;
    const like = `%${search}%`;

    const dataQuery = `
      SELECT 
        s.id, s.name, s.email, s.address, s.owner_id,
        ROUND(COALESCE(AVG(r.rating), 0), 1) AS average_rating,
        COUNT(COALESCE(r.id, 0)) AS rating_count,
        COALESCE((SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id LIMIT 1), 0) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE (
        ? = '' OR
        s.name LIKE ? OR
        s.address LIKE ? OR
        s.email LIKE ?
      )
      GROUP BY s.id
      ORDER BY s.name ASC
      LIMIT ? OFFSET ?
    `;

    
    const stores = await db.all(dataQuery, [
      req.user.id,      
      search,         
      like, like, like,   
      limitNum, offset   
    ]);

    const countQuery = `
      SELECT COUNT(DISTINCT s.id) as total
      FROM stores s
      WHERE (
        ? = '' OR
        s.name LIKE ? OR
        s.address LIKE ? OR
        s.email LIKE ?
      )
    `;

    const [{ total }] = await db.all(countQuery, [search, like, like, like]);

    res.json({
      stores,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('getStores error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




const addRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const store = await db.get('SELECT * FROM stores WHERE id = ?', [storeId]);
    if (!store) return res.status(400).json({ message: 'Store not found' });

    // Check if user already rated this store
    const existingRating = await db.get('SELECT * FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this store. Use PATCH to update your rating.' });
    }

    // Insert new rating
    await db.run('INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)', [userId, storeId, rating]);
    return res.status(201).json({ message: 'Rating added successfully' });
  } catch (error) {
    console.log('Add Rating:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}

const updateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const store = await db.get('SELECT * FROM stores WHERE id = ?', [storeId]);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // Check if user has rated this store
    const existingRating = await db.get('SELECT * FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found. Please add a rating first.' });
    }

    // Update existing rating
    await db.run('UPDATE ratings SET rating = ? WHERE id = ?', [rating, existingRating.id]);
    return res.status(200).json({ message: 'Rating updated successfully' });
  } catch (error) {
    console.log('Update Rating:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}

module.exports = {getStores, addRating, updateRating}