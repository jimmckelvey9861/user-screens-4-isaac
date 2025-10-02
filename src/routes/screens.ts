import { Router } from 'express';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Sample screen data for Isaac
const screens = [
  {
    id: 1,
    name: 'Login Screen',
    type: 'authentication',
    description: 'User login interface with email and password',
    components: ['email-input', 'password-input', 'login-button', 'forgot-password-link'],
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Dashboard Screen',
    type: 'main',
    description: 'Main user dashboard with navigation and overview',
    components: ['navigation-bar', 'user-profile', 'quick-actions', 'recent-activity'],
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Profile Settings',
    type: 'settings',
    description: 'User profile management and preferences',
    components: ['profile-form', 'avatar-upload', 'preferences-panel', 'save-button'],
    status: 'draft',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

// GET /api/screens - Get all screens
router.get('/', (req, res) => {
  const { type, status } = req.query;
  
  let filteredScreens = screens;
  
  if (type) {
    filteredScreens = filteredScreens.filter(screen => screen.type === type);
  }
  
  if (status) {
    filteredScreens = filteredScreens.filter(screen => screen.status === status);
  }
  
  res.json({
    success: true,
    data: filteredScreens,
    count: filteredScreens.length,
    filters: { type, status },
    timestamp: new Date().toISOString()
  });
});

// GET /api/screens/:id - Get specific screen
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const screen = screens.find(s => s.id === id);
  
  if (!screen) {
    return next(createError('Screen not found', 404));
  }
  
  res.json({
    success: true,
    data: screen,
    timestamp: new Date().toISOString()
  });
});

// POST /api/screens - Create new screen
router.post('/', (req, res, next) => {
  const { name, type, description, components, status = 'draft' } = req.body;
  
  if (!name || !type || !description) {
    return next(createError('Name, type, and description are required', 400));
  }
  
  const newScreen = {
    id: screens.length + 1,
    name,
    type,
    description,
    components: components || [],
    status,
    createdAt: new Date().toISOString()
  };
  
  screens.push(newScreen);
  
  res.status(201).json({
    success: true,
    data: newScreen,
    message: 'Screen created successfully',
    timestamp: new Date().toISOString()
  });
});

// PUT /api/screens/:id - Update screen
router.put('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const screenIndex = screens.findIndex(s => s.id === id);
  
  if (screenIndex === -1) {
    return next(createError('Screen not found', 404));
  }
  
  const { name, type, description, components, status } = req.body;
  
  if (!name || !type || !description) {
    return next(createError('Name, type, and description are required', 400));
  }
  
  screens[screenIndex] = {
    ...screens[screenIndex],
    name,
    type,
    description,
    components: components || screens[screenIndex].components,
    status: status || screens[screenIndex].status
  };
  
  res.json({
    success: true,
    data: screens[screenIndex],
    message: 'Screen updated successfully',
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/screens/:id - Delete screen
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const screenIndex = screens.findIndex(s => s.id === id);
  
  if (screenIndex === -1) {
    return next(createError('Screen not found', 404));
  }
  
  const deletedScreen = screens.splice(screenIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedScreen,
    message: 'Screen deleted successfully',
    timestamp: new Date().toISOString()
  });
});

// GET /api/screens/types - Get available screen types
router.get('/meta/types', (req, res) => {
  const types = [...new Set(screens.map(screen => screen.type))];
  
  res.json({
    success: true,
    data: types,
    count: types.length,
    timestamp: new Date().toISOString()
  });
});

export default router;
