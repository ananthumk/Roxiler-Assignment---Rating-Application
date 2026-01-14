const dashboard =  async (req, res) => {
  try {
    const ownerId = req.user.id;

    const stores = await db.all('SELECT id, name FROM stores WHERE owner_id = ?', [ownerId]);

    const ratings = await Promise.all(
      stores.map(async (store) => {
        const ratings = await db.all('SELECT rating FROM ratings WHERE store_id = ?', [store.id]);
        const avgRating =
          ratings.length > 0 ? (ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length).toFixed(2) : 'No ratings';
        return {
          storeId: store.id,
          storeName: store.name,
          averageRating: avgRating,
          totalRatings: ratings.length,
        };
      })
    );

    return res.status(200).json({ stores: ratings });
  } catch (error) {
    console.log('Owner Dashboard:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}


const recentReviews = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    // First get owner's store IDs
    const ownerStores = await db.all('SELECT id FROM stores WHERE owner_id = ?', [ownerId]);
    const storeIds = ownerStores.map(store => store.id).join(',');

    if (storeIds.length === 0) {
      return res.status(200).json({ recentReviews: [] });
    }

    // Get recent reviews with user names (latest first, limit 10)
    const recentReviewsQuery = `
      SELECT 
        r.id,
        r.rating,
       
        r.created_at,
        u.name as userName,
        u.email as userEmail,
        s.name as storeName
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      WHERE r.store_id IN (${storeIds})
      ORDER BY r.created_at DESC
      LIMIT 10
    `;

    const recentReviews = await db.all(recentReviewsQuery);
    
    return res.status(200).json({ 
      recentReviews,
      totalRecentReviews: recentReviews.length
    });
  } catch (error) {
    console.log('Recent Reviews:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
};

module.exports = {dashboard, recentReviews}