
const addUser =  async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const validRoles = ['admin', 'owner'];
    if (!validRoles.includes(role))
      return res.status(400).json({ message: 'Invalid role specified' });

    const userQuery = 'SELECT * FROM users WHERE email = ?';
    const existingUser = await db.get(userQuery, [email]);
    if (existingUser)
      return res.status(400).json({ message: 'User already exists with this email' });

    

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery =
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
    const result = await db.run(insertUserQuery, [
      name,
      email,
      hashedPassword,
      address,
      role,
    ]);

    const newUser = await db.get('SELECT id, name, email, address, role FROM users WHERE id = ?', [result.lastID]);
    return res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.log('Admin Add User:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}

const dashboard =  async (req, res) => {
  try {
    const totalUsersResult = await db.get('SELECT COUNT(*) as count FROM users');
    const totalStoresResult = await db.get('SELECT COUNT(*) as count FROM stores');
    const totalRatingsResult = await db.get('SELECT COUNT(*) as count FROM ratings');

    return res.status(200).json({
      totalUsers: totalUsersResult.count,
      totalStores: totalStoresResult.count,
      totalRatings: totalRatingsResult.count,
    });
  } catch (error) {
    console.log('Dashboard:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}

const getStores = async (req, res) => {
  try {
    const { search = '', sortBy = 'name', sortOrder = 'ASC', page = 1 } = req.query;
    
    const LIMIT = 6

    const validSorts = ['name', 'email', 'address'];
    const validOrders = ['ASC', 'DESC'];

    const sortField = validSorts.includes(sortBy) ? sortBy : 'name';
    const sortDir = validOrders.includes(sortOrder) ? sortOrder : 'ASC';

    const offset = (Number(page) - 1) * LIMIT;

    // 🔹 total count
    const countQuery = `
      SELECT COUNT(DISTINCT s.id) as total
      FROM stores s
      WHERE s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?
    `;

    const countResult = await db.get(countQuery, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ]);

    const total = countResult.total;
    const totalPages = Math.ceil(total / LIMIT);

    // 🔹 paginated stores
    const dataQuery = `
      SELECT 
        s.id, s.name, s.email, s.address, s.owner_id,
        ROUND(AVG(r.rating), 2) as average_rating,
        COUNT(r.rating) as total_ratings
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?
      GROUP BY s.id
      ORDER BY s.${sortField} ${sortDir}
      LIMIT ? OFFSET ?
    `;

    const stores = await db.all(dataQuery, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      LIMIT,
      offset,
    ]);

    return res.status(200).json({
      stores,
      pagination: {
        total,
        totalPages,
        currentPage: Number(page),
        limit: LIMIT,
      },
    });
  } catch (error) {
    console.log('Filter Stores:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
};

const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const storeCheckQuery = 'SELECT * FROM stores WHERE email = ?';
    const existingStore = await db.get(storeCheckQuery, [email]);
    if (existingStore)
      return res.status(400).json({ message: 'Store already exists' });

    const insertStoreQuery =
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)';
    await db.run(insertStoreQuery, [name, email, address, ownerId]);

    return res.status(201).json({ message: 'Store added successfully' });
  } catch (error) {
    console.log('Add Store:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}

const getUsers = async (req, res) => {
  try {
    const { search = '', sortBy = 'name', sortOrder = 'ASC', page = 1 } = req.query;
    
    const LIMIT = 6

    const validSorts = ['name', 'email', 'address'];
    const validOrders = ['ASC', 'DESC'];

    const sortField = validSorts.includes(sortBy) ? sortBy : 'name';
    const sortDir = validOrders.includes(sortOrder) ? sortOrder : 'ASC';

    const offset = (Number(page) - 1) * LIMIT;

    // 🔹 total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      WHERE name LIKE ? OR email LIKE ? OR address LIKE ?
    `;

    const countResult = await db.get(countQuery, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ]);

    const total = countResult.total;
    const totalPages = Math.ceil(total / LIMIT);

    // 🔹 paginated users
    const dataQuery = `
      SELECT *
      FROM users
      WHERE name LIKE ? OR email LIKE ? OR address LIKE ?
      ORDER BY ${sortField} ${sortDir}
      LIMIT ? OFFSET ?
    `;

    const users = await db.all(dataQuery, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      LIMIT,
      offset,
    ]);

    return res.status(200).json({
      users,
      pagination: {
        total,
        totalPages,
        currentPage: Number(page),
        limit: LIMIT,
      },
    });
  } catch (error) {
    console.log('Filter Users:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
};

const allUsers = async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, role 
      FROM users 
      WHERE role = 'owner'
    `;

    const users = await db.all(query);
    return res.status(200).json({ users });
  } catch (error) {
    console.log('all Users:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
};



const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userQuery = 'SELECT id, name, email, address, role FROM users WHERE id = ?';
    const user = await db.get(userQuery, [id]);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If user is an owner, include their store ratings
    if (user.role === 'owner') {
      const storeRatings = await db.all(
        `SELECT s.id, s.name, s.email, s.address,
                ROUND(AVG(r.rating), 2) as average_rating,
                COUNT(r.rating) as total_ratings
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?
         GROUP BY s.id`,
        [id]
      );
      return res.status(200).json({ user, stores: storeRatings });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log('Get User:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}

module.exports = { addUser: [require('../middleware/validate.middleware').validateSignup, addUser], dashboard, getStores, addStore, allUsers,  getUsers, getUser }