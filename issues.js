const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Book = require('../models/Book');

// GET all issues
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    const issues = await Issue.find(query)
      .populate('book', 'title author isbn')
      .populate('member', 'name email membershipId')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST issue a book
router.post('/', async (req, res) => {
  try {
    const { bookId, memberId, daysToReturn = 14 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ error: 'No copies available' });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(daysToReturn));

    const issue = new Issue({
      book: bookId,
      member: memberId,
      dueDate,
    });

    await issue.save();

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    const populated = await Issue.findById(issue._id)
      .populate('book', 'title author isbn')
      .populate('member', 'name email membershipId');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT return a book
router.put('/:id/return', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue record not found' });
    if (issue.status === 'returned') return res.status(400).json({ error: 'Book already returned' });

    issue.returnDate = new Date();
    issue.status = 'returned';
    await issue.save();

    // Increase available copies
    await Book.findByIdAndUpdate(issue.book, { $inc: { availableCopies: 1 } });

    const populated = await Issue.findById(issue._id)
      .populate('book', 'title author isbn')
      .populate('member', 'name email membershipId');

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET dashboard stats
router.get('/stats/summary', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalMembers = await (require('../models/Member')).countDocuments();
    const activeIssues = await Issue.countDocuments({ status: 'issued' });

    // Check and update overdue issues
    await Issue.updateMany(
      { status: 'issued', dueDate: { $lt: new Date() } },
      { status: 'overdue' }
    );
    const overdueIssues = await Issue.countDocuments({ status: 'overdue' });

    res.json({ totalBooks, totalMembers, activeIssues, overdueIssues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
