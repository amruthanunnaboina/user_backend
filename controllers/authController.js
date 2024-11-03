const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.register = async (req, res) => {
  try {
    console.log("i am here")
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("ia , here,")
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.lastLoginTime = new Date();
    console.log("i came here")
    await user.save();
    console.log("after saving")

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        lastLoginTime: user.lastLoginTime,
        activityFeed: user.activityFeed,
        friends: user.friends,
        photo: user.photo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.uploadPhoto = (req, res) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: 'Photo upload failed', error: err });

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.photo = req.file.buffer.toString('base64');
      await user.save();

      res.json({ message: 'Photo uploaded successfully', photo: user.photo });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
};
exports.getUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    
      const { password, ...userData } = user.toObject();
      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
 
  exports.updateUser = async (req, res) => {
    const { name } = req.body;
    try {
      const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
