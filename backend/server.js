const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const { open } = require('sqlite');
const sqlite3 = require('sqlite3');


const cors = require('cors');
const authRouter = require('./routes/auth.routes');
const adminRouter = require('./routes/admin.routes');
const ownerRouter = require('./routes/owner.routes');
const userRouter = require('./routes/user.routes');




const dbPath = path.join(__dirname, 'mydatabase.db');
const app = express();
app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 4000;

let db;
const initializeDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    // Make db and bcrypt globally available to controllers
    global.db = db;
    global.bcrypt = bcrypt;
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (error) {
    console.log(`Error while connecting: ${error}`);
    process.exit(1);
  }
};

initializeDb();

app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/user', userRouter)


// // Authentication middleware
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: 'No token provided' });

//   const token = authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Invalid token format' });

//   try {
//     const decoded = jwt.verify(token, 'Key');
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };



// Register user
// app.post('/register', async (req, res) => {
//   try {
//     const { name, email, address, password } = req.body;
//     const userQuery = 'SELECT * FROM users WHERE email = ?';
//     const existingUser = await db.get(userQuery, [email]);

//     const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (existingUser)
//       return res.status(400).json({ message: 'User already exists' });

//     if (name.length < 20 || name.length > 60)
//       return res.status(400).json({ message: 'The length of name should be between 20 to 60' });

//     if (address.length > 400)
//       return res.status(400).json({ message: 'Address length should not be greater than 400 characters' });

//     if (!passwordRegex.test(password))
//       return res.status(400).json({
//         message:
//           'Password must be 8–16 characters long, include at least one uppercase letter and one special character',
//       });

//     if (!emailRegex.test(email))
//       return res.status(400).json({ message: 'Invalid email format' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const insertUserQuery =
//       'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
//     const result = await db.run(insertUserQuery, [name, email, hashedPassword, address, 'user']);

//     const newUser = await db.get(
//       'SELECT id, name, email, address, role FROM users WHERE id = ?',
//       [result.lastID]
//     );
//     const token = generateToken({ id: newUser.id, role: newUser.role });

//     return res
//       .status(201)
//       .json({ message: 'User Registered Successfully', user: newUser, token });
//   } catch (error) {
//     console.log('Register:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// Login
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const userQuery = 'SELECT * FROM users WHERE email = ?';
//     const existingUser = await db.get(userQuery, [email]);

//     if (!existingUser) return res.status(400).json({ message: 'User not found' });

//     const matchPassword = await bcrypt.compare(password, existingUser.password);
//     if (!matchPassword) return res.status(400).json({ message: 'Invalid password' });

//     const token = generateToken({ id: existingUser.id, role: existingUser.role });

//     return res
//       .status(200)
//       .json({ message: 'Logged In', token,
//          user: { id: existingUser.id, name: existingUser.name, email: existingUser.email, role: existingUser.role } });
//   } catch (error) {
//     console.log('Login:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// Update password
// app.put('/users/:id/password', authenticate, async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     const { id } = req.params;

//     // Only allow user to change their own password or admins
//     if (id != req.user.id && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied.' });
//     }

//     const userQuery = 'SELECT * FROM users WHERE id = ?';
//     const user = await db.get(userQuery, [id]);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const matchPassword = await bcrypt.compare(oldPassword, user.password);
//     if (!matchPassword)
//       return res.status(400).json({ message: 'Invalid Old Password' });

//     const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
//     if (!passwordRegex.test(newPassword))
//       return res.status(400).json({
//         message:
//           'New password must be 8–16 characters long, include at least one uppercase letter and one special character',
//       });

//     const newHashedPassword = await bcrypt.hash(newPassword, 10);

//     const passwordUpdateQuery = 'UPDATE users SET password = ? WHERE id = ?';
//     await db.run(passwordUpdateQuery, [newHashedPassword, id]);

//     return res.status(200).json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.log('Update Password:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// Admin add user (admin or owner)
// app.post('/admin/user', authenticate, authorize(['admin']), async (req, res) => {
//   try {
//     const { name, email, password, address, role } = req.body;

//     const validRoles = ['admin', 'owner'];
//     if (!validRoles.includes(role))
//       return res.status(400).json({ message: 'Invalid role specified' });

//     const userQuery = 'SELECT * FROM users WHERE email = ?';
//     const existingUser = await db.get(userQuery, [email]);
//     if (existingUser)
//       return res.status(400).json({ message: 'User already exists' });

//     const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (name.length < 20 || name.length > 60)
//       return res.status(400).json({ message: 'Name length must be between 20 and 60' });

//     if (address.length > 400)
//       return res.status(400).json({ message: 'Address length should not exceed 400' });

//     if (!passwordRegex.test(password))
//       return res.status(400).json({
//         message:
//           'Password must be 8–16 characters long, include one uppercase letter and one special character',
//       });

//     if (!emailRegex.test(email))
//       return res.status(400).json({ message: 'Invalid email format' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const insertUserQuery =
//       'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
//     const result = await db.run(insertUserQuery, [
//       name,
//       email,
//       hashedPassword,
//       address,
//       role,
//     ]);

//     const newUser = await db.get('SELECT id, name, email, address, role FROM users WHERE id = ?', [result.lastID]);
//     return res.status(201).json({ message: 'User added successfully', user: newUser });
//   } catch (error) {
//     console.log('Admin Add User:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// Add store
// app.post('/stores', authenticate, authorize(['admin']), async (req, res) => {
//   try {
//     const { name, email, address, ownerId } = req.body;

//     const storeCheckQuery = 'SELECT * FROM stores WHERE email = ?';
//     const existingStore = await db.get(storeCheckQuery, [email]);
//     if (existingStore)
//       return res.status(400).json({ message: 'Store already exists' });

//     const insertStoreQuery =
//       'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)';
//     await db.run(insertStoreQuery, [name, email, address, ownerId]);

//     return res.status(201).json({ message: 'Store added successfully' });
//   } catch (error) {
//     console.log('Add Store:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// Get dashboard summary (Admin only)
// app.get('/dashboard', authenticate, authorize(['admin']), async (req, res) => {
//   try {
//     const totalUsersResult = await db.get('SELECT COUNT(*) as count FROM users');
//     const totalStoresResult = await db.get('SELECT COUNT(*) as count FROM stores');
//     const totalRatingsResult = await db.get('SELECT COUNT(*) as count FROM ratings');

//     return res.status(200).json({
//       totalUsers: totalUsersResult.count,
//       totalStores: totalStoresResult.count,
//       totalRatings: totalRatingsResult.count,
//     });
//   } catch (error) {
//     console.log('Dashboard:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// Filter users (Admin only)
// app.get('/users', authenticate, authorize(['admin']), async (req, res) => {
//   try {
//     const { name = '', email = '', address = '', role = '' } = req.query;
//     const filterQuery =
//       'SELECT * FROM users WHERE name LIKE ? AND email LIKE ? AND address LIKE ? AND role LIKE ?';
//     const users = await db.all(filterQuery, [
//       `%${name}%`,
//       `%${email}%`,
//       `%${address}%`,
//       `%${role}%`,
//     ]);
//     return res.status(200).json({ users });
//   } catch (error) {
//     console.log('Filter Users:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// Get specific user (Admin only)
// app.get('/users/:id', authenticate, authorize(['admin']), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userQuery = 'SELECT id, name, email, address, role FROM users WHERE id = ?';
//     const user = await db.get(userQuery, [id]);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     return res.status(200).json({ user });
//   } catch (error) {
//     console.log('Get User:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// Get stores with filters (Admin only)
// app.get('/stores', authenticate, authorize(['admin']), async (req, res) => {
//   try {
//     const { name = '', email = '', address = '' } = req.query;
//     const filterQuery =
//       'SELECT * FROM stores WHERE name LIKE ? AND email LIKE ? AND address LIKE ?';
//     const stores = await db.all(filterQuery, [
//       `%${name}%`,
//       `%${email}%`,
//       `%${address}%`,
//     ]);
//     return res.status(200).json({ stores });
//   } catch (error) {
//     console.log('Filter Stores:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// List stores for normal user with search
// app.get('/user/stores', authenticate, authorize(['user', 'admin', 'owner']), async (req, res) => {
//   try {
//     const { name = '', address = '' } = req.query;
//     const query = `
//       SELECT s.id, s.name, s.email, s.address, s.owner_id, 
//              ROUND(AVG(r.rating), 2) as average_rating,
//              COUNT(r.rating) as rating_count
//       FROM stores s 
//       LEFT JOIN ratings r ON s.id = r.store_id
//       WHERE s.name LIKE ? AND s.address LIKE ?
//       GROUP BY s.id
//     `;
//     const stores = await db.all(query, [`%${name}%`, `%${address}%`]);

//     return res.status(200).json({ stores });
//   } catch (error) {
//     console.log('User Stores:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });


// Submit rating
// app.post('/ratings', authenticate, authorize(['user']), async (req, res) => {
//   try {
//     const { storeId, rating } = req.body;
//     const userId = req.user.id;

//     const store = await db.get('SELECT * FROM stores WHERE id = ?', [storeId]);
//     if (!store) return res.status(400).json({ message: 'Store not found' });

//     // Check if user already rated this store
//     const existingRating = await db.get('SELECT * FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);
//     if (existingRating) {
//       // Update existing rating
//       await db.run('UPDATE ratings SET rating = ? WHERE id = ?', [rating, existingRating.id]);
//       return res.status(200).json({ message: 'Rating updated successfully' });
//     } else {
//       // Insert new rating
//       await db.run('INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)', [userId, storeId, rating]);
//       return res.status(201).json({ message: 'Rating added successfully' });
//     }
//   } catch (error) {
//     console.log('Add Rating:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

// // Get Owner Dashboard
// app.get('/owner/dashboard', authenticate, authorize(['owner']), async (req, res) => {
//   try {
//     const ownerId = req.user.id;

//     const stores = await db.all('SELECT id, name FROM stores WHERE owner_id = ?', [ownerId]);

//     const ratings = await Promise.all(
//       stores.map(async (store) => {
//         const ratings = await db.all('SELECT rating FROM ratings WHERE store_id = ?', [store.id]);
//         const avgRating =
//           ratings.length > 0 ? (ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length).toFixed(2) : 'No ratings';
//         return {
//           storeId: store.id,
//           storeName: store.name,
//           averageRating: avgRating,
//           totalRatings: ratings.length,
//         };
//       })
//     );

//     return res.status(200).json({ stores: ratings });
//   } catch (error) {
//     console.log('Owner Dashboard:', error.message);
//     return res.status(500).json({ message: 'Something went wrong! Try again' });
//   }
// });

module.exports = app;
