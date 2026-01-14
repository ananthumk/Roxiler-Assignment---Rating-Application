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




module.exports = app;
