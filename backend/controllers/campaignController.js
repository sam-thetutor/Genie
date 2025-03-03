const Campaign = require('../models/Campaign');
const { validationResult } = require('express-validator');

exports.createCampaign = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Creating campaign with data:', req.body);
    const campaign = new Campaign(req.body);
    await campaign.save();
    console.log('Campaign created:', campaign);
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    Object.assign(campaign, req.body);
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    console.log('Deleting campaign with id:', req.params)
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    console.log('Campaign deleted:', campaign);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    return res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return res.status(500).json({ message: error.message });
  }
}; 