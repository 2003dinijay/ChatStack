
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    
    userId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
 
    bio: {
      type: String,
      default: 'Hey there! I am using ChatStack.',
      maxlength: 500
    },
    
  
    avatarUrl: {
      type: String,
      default: null
    },
    

    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zipCode: { type: String, default: '' }
    },
    
  
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Profile', profileSchema);