const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ['Feeding', 'Cleaning', 'Health Check', 'Medication', 'Observation', 'Weight Monitoring'],
    required: true
  },
 
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Farmer or caretaker
    required: true
  },
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  scheduleDate: {
    type: Date,
    required: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
