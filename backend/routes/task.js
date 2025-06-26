const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// CREATE task
router.post('/add', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all tasks
router.get('/getAll', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo').populate('animalId');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET tasks by assigned user
router.get('/user/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId }).populate('animalId');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE task status
// UPDATE a task (edit task details)
router.put('/edit/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    const updatedData = {
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      assignedTo: req.body.assignedTo,
      animalId: req.body.animalId,
      scheduleDate: req.body.scheduleDate,
      status: req.body.status,
      isRecurring: req.body.isRecurring
    };

    // Add completedAt if marked completed
    if (req.body.status === 'Completed') {
      updatedData.completedAt = new Date();
    } else {
      updatedData.completedAt = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
