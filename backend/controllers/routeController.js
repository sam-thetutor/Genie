const Route = require('../models/Route');
const { validationResult } = require('express-validator');

exports.createRoute = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const route = new Route(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const { principal } = req.query;
    
    if (!principal) {
      return res.status(400).json({ message: 'Principal is required' });
    }
    
    const routes = await Route.find({ principal });
    res.json(routes);
  } catch (error) {
    console.error('Error getting routes:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Check ownership
    if (route.principal !== req.body.principal) {
      return res.status(403).json({ message: 'Not authorized to update this route' });
    }

    Object.assign(route, req.body);
    await route.save();
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Check ownership
    if (route.principal !== req.body.principal) {
      return res.status(403).json({ message: 'Not authorized to delete this route' });
    }

    await route.deleteOne();
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 