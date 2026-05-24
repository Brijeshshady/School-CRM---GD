const Lead = require('../models/Lead');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private (Admin or Teacher)
exports.getLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find({}).sort('-createdAt');
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: leads,
  });
});

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private (Admin or Teacher)
exports.createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, gradeInterested, source, notes } = req.body;

  if (!name) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Lead name is required',
    });
  }

  const lead = await Lead.create({
    name,
    email,
    phone,
    gradeInterested,
    source,
    notes,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: lead,
  });
});

// @desc    Update a lead (Pipeline promotions, verification, tests)
// @route   PUT /api/leads/:id
// @access  Private (Admin or Teacher)
exports.updateLead = asyncHandler(async (req, res) => {
  const { stage, entranceTestDate, entranceTestScore, interviewNotes, documentsVerified, notes, name, email, phone } = req.body;

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Lead not found',
    });
  }

  if (name !== undefined) lead.name = name;
  if (email !== undefined) lead.email = email;
  if (phone !== undefined) lead.phone = phone;
  if (stage !== undefined) lead.stage = stage;
  if (entranceTestDate !== undefined) lead.entranceTestDate = entranceTestDate;
  if (entranceTestScore !== undefined) lead.entranceTestScore = entranceTestScore;
  if (interviewNotes !== undefined) lead.interviewNotes = interviewNotes;
  if (documentsVerified !== undefined) lead.documentsVerified = documentsVerified;
  if (notes !== undefined) lead.notes = notes;

  await lead.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: lead,
  });
});

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin)
exports.deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Lead not found',
    });
  }

  await lead.deleteOne();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Lead removed successfully',
  });
});
