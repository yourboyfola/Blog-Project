import bcrypt from 'bcryptjs';
import User from '../models/user.js';

export const signup = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send('Passwords do not match');
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.send('Username is already taken');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  req.session.userId = newUser._id;
  res.redirect('/');
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.send('User not found');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.send('Incorrect password');

  req.session.userId = user._id;
  res.redirect('/');
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

export function userRoutes(app) {
  app.get('/signup', (req, res) => res.render('signup'));
  app.post('/signup', signup);

  app.get('/login', (req, res) => res.render('login'));
  app.post('/login', login);

  app.get('/logout', logout);
}
