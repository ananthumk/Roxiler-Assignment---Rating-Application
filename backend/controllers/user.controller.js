const getStores = async (req, res) => {
  try {
    const { search = '' } = req.query;
    console.log(`Get stores user: ${search}`)
    const query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id, 
             ROUND(AVG(r.rating), 2) as average_rating,
             COUNT(r.rating) as rating_count,
             (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id LIMIT 1) as user_rating
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.name LIKE ? AND s.address LIKE ?
      GROUP BY s.id
    `;
    const stores = await db.all(query, [req.user.id, `%${search}%`, `%${search}%`]);

    return res.status(200).json({ stores });
  } catch (error) {
    console.log('User Stores:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}

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