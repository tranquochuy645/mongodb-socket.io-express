const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const authMiddleware = require('../src/authMiddleware.js');

// Endpoint to get data
router.get('/get_data', authMiddleware, (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Invalid content-type' });
  }

  try {
    if (req.headers.databaseId != null) {
      const databaseId = req.headers.databaseId;
      var o_id = new ObjectId(databaseId);

      global.mongo_connection
        .db('database-app')
        .collection('user_database')
        .findOne({ _id: o_id })
        .then(result => {
          res.send(result);
        });
    } else {
      res.status(409).send(); // Added send() to respond with empty body
    }
  } catch (error) {
    return res.status(400).json({ error: 'Malformed JSON' });
  }
});

// Endpoint to get devices
router.get('/get_devices', authMiddleware, (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Invalid content-type' });
  }

  try {
    if (req.headers.databaseId != null) {
      const databaseId = req.headers.databaseId;
      var o_id = new ObjectId(databaseId);

      global.mongo_connection
        .db('database-app')
        .collection('users')
        .findOne({ databaseId: o_id })
        .then(result => {
          res.send(result.devices);
        });
    } else {
      res.status(409).send(); // Added send() to respond with empty body
    }
  } catch (error) {
    return res.status(400).json({ error: 'Malformed JSON' });
  }
});

module.exports = router;
