const User = require('../../models/User');
const Librarian = require('../../models/Librarian');
const jwt = require('jsonwebtoken');
const config = require('../../config');

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({ name, email, password });
    await user.save();

    // Create token
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Register a librarian
// @route   POST /api/auth/register/librarian
// @access  Public
const registerLibrarian = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if librarian exists
    let librarian = await Librarian.findOne({ email });
    if (librarian) {
      return res.status(400).json({ message: 'Librarian already exists' });
    }

    // Create librarian
    librarian = new Librarian({ name, email, password });
    await librarian.save();

    // Create token
    const token = jwt.sign({ id: librarian._id }, config.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Login user/librarian
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing fields',
        message: 'Email and password are required'  
      });
    }

    console.log('Login attempt for email:', email);
    console.log('Password received:', password);
    
    // Check for user
    let user = await User.findOne({ email });
    let isLibrarian = false;
    console.log('User found:', user ? user.email : 'none');

    // If not user, check for librarian
    if (!user) {
      user = await Librarian.findOne({ email });
      isLibrarian = true;
      console.log('Librarian found:', user ? user.email : 'none');
    if (!user) {
      console.log('No user/librarian found with email:', email);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials',
        message: 'No account found with this email address' 
      });
    }
    }

    // Check password
    console.log('Stored password hash:', user.password);
    console.log('Comparing password for:', user.email);
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Password mismatch for:', user.email);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials',
        message: 'Incorrect password' 
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, isLibrarian },
      config.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({ 
      success: true,
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: isLibrarian ? 'librarian' : 'user'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear all auth cookies with proper configuration
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });
    
    return res.status(200).json({ 
      success: true,
      message: 'Logged out successfully',
      data: null
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Logout failed',
      details: error.message 
    });
  }
};

module.exports = {
  registerUser,
  registerLibrarian,
  loginUser,
  logoutUser
};
