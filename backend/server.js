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

const app = express();

// Render SQLite path
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/app/db/mydatabase.db'  
  : path.join(__dirname, 'mydatabase.db');  

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

let db;
const initializeDb = async () => {
  try {
    console.log('📁 Using DB:', dbPath);
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  
    // Make globally available
    global.db = db;
    global.bcrypt = bcrypt;
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`✅ SQLite ready at: ${dbPath}`);
    });
  } catch (error) {
    console.error('❌ DB Connection failed:', error);
    process.exit(1);
  }
};

// Initialize DB 
initializeDb();

//  Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/user', userRouter);


app.get('/api/test-db', async (req, res) => {
  try {
    const version = await db.get('SELECT sqlite_version() as version');
    res.json({ 
      success: true, 
      dbPath,
      sqliteVersion: version.version 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
