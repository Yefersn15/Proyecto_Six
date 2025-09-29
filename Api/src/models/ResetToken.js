// src/models/ResetToken.js
const mongoose = require('mongoose');

const ResetTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  codeHash: { type: String, required: true },
  used: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

const ResetTokenModel = mongoose.model('ResetToken', ResetTokenSchema);
module.exports = ResetTokenModel;