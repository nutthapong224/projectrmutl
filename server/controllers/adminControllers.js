const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Using bcryptjs instead of bcrypt
const pool = require('../config/db'); // Import database pool
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

exports.adminLoginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Fetch admin details by username
    const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const admin = rows[0];

    // Compare passwords
    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token with role
    const token = jwt.sign(
      { id: admin.id, role: admin.role },  // Include role here
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token, role: admin.role }); // Return role in response
  } catch (err) {
    console.error('Error during admin login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



  exports.adminRegisterController = async (req, res) => {
    const { username, password ,role} = req.body;
  
    // Validate the request data
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
  
    try {
      // Check if username already exists
      const [existingUser] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'Username is already taken.' });
      }
  
      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      // Insert the new user into the database
      const result = await pool.query('INSERT INTO admin (username, password,role) VALUES (?, ?,?)', [
        username,
        hashedPassword,
        role
      ]);
  
      // Generate a JWT token
      const token = jwt.sign({ userId: result[0].insertId }, 'your-secret-key', { expiresIn: '1h' });
  
      // Return the token
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
