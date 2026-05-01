const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, trim: true },
  membershipId: { type: String, unique: true },
}, { timestamps: true });

// Auto-generate membershipId before saving
memberSchema.pre('save', function(next) {
  if (!this.membershipId) {
    this.membershipId = 'MEM' + Date.now().toString().slice(-6);
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
