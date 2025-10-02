import { Router } from 'express';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Express API!',
    timestamp: new Date().toISOString()
  });
});

// GET /api/users
router.get('/users', (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length,
    timestamp: new Date().toISOString()
  });
});

// GET /api/users/:id
router.get('/users/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return next(createError('User not found', 404));
  }
  
  res.json({
    success: true,
    data: user,
    timestamp: new Date().toISOString()
  });
});

// POST /api/users
router.post('/users', (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return next(createError('Name and email are required', 400));
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully',
    timestamp: new Date().toISOString()
  });
});

// PUT /api/users/:id
router.put('/users/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return next(createError('User not found', 404));
  }
  
  const { name, email } = req.body;
  
  if (!name || !email) {
    return next(createError('Name and email are required', 400));
  }
  
  users[userIndex] = { ...users[userIndex], name, email };
  
  res.json({
    success: true,
    data: users[userIndex],
    message: 'User updated successfully',
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/users/:id
router.delete('/users/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return next(createError('User not found', 404));
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedUser,
    message: 'User deleted successfully',
    timestamp: new Date().toISOString()
  });
});

export default router;
