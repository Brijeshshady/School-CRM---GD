// @desc    Check server health
// @route   GET /api/health
// @access  Public
const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'up',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
};

module.exports = { getHealthStatus };
