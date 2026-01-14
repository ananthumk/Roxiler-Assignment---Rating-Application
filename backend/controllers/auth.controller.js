const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '7d' });
};

//New User Signup
const signup = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    const existingUser = await db.get(userQuery, [email]);

   
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });


    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery =
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
    const result = await db.run(insertUserQuery, [name, email, hashedPassword, address, role]);

    const newUser = await db.get(
      'SELECT id, name, email, address, role FROM users WHERE id = ?',
      [result.lastID]
    );
    const token = generateToken({ id: newUser.id, role: newUser.role });

    return res
      .status(201)
      .json({ message: 'User Registered Successfully', user: newUser, token });
  } catch (error) {
    console.log('Register:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
};

//Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = 'SELECT * FROM users WHERE email = ?';
    const existingUser = await db.get(userQuery, [email]);

    if (!existingUser) return res.status(400).json({ message: 'User not found' });

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = generateToken({ id: existingUser.id, role: existingUser.role });

    return res
      .status(200)
      .json({ message: 'Logged In', token,
         user: { id: existingUser.id, name: existingUser.name, email: existingUser.email, role: existingUser.role } });
  } catch (error) {
    console.log('Login:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}

//change user password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const userQuery = 'SELECT * FROM users WHERE id = ?';
    const user = await db.get(userQuery, [userId]);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const matchPassword = await bcrypt.compare(oldPassword, user.password);
    if (!matchPassword)
      return res.status(400).json({ message: 'Invalid Old Password' });

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(newPassword))
      return res.status(400).json({
        message:
          'New password must be 8–16 characters long, include at least one uppercase letter and one special character',
      });

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const passwordUpdateQuery = 'UPDATE users SET password = ? WHERE id = ?';
    await db.run(passwordUpdateQuery, [newHashedPassword, userId]);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.log('Update Password:', error.message);
    return res.status(500).json({ message: 'Something went wrong! Try again' });
  }
}

module.exports = {
  signup: [require('../middleware/validate.middleware').validateSignup, signup],  
  login: [require('../middleware/validate.middleware').validateLogin, login],
  updatePassword: [require('../middleware/validate.middleware').validateUpdatePassword, updatePassword]
};