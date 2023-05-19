const ObjectId = require('mongodb').ObjectId;

async function update_user_database(id, objectData, method = 'set', socket = null) {
  var o_id = new ObjectId(id);

  // Update user database based on the specified method
  if (method == 'set') {
    global.mongo_connection
      .db('database-app')
      .collection('user_database')
      .updateOne(
        { _id: o_id },
        { $set: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  } else if (method == 'unset') {
    // Update user database by unsetting the specified object data
    global.mongo_connection
      .db('database-app')
      .collection('user_database')
      .updateOne(
        { _id: o_id },
        { $unset: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  } else if (method == 'push') {
    // Update user database by pushing the specified object data
    global.mongo_connection
      .db('database-app')
      .collection('user_database')
      .updateOne(
        { _id: o_id },
        { $push: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  } else if (method == 'addToSet') {
    // Update user database by adding the specified object data to the set
    global.mongo_connection
      .db('database-app')
      .collection('user_database')
      .updateOne(
        { _id: o_id },
        { $addToSet: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  } else if (method == 'pull') {
    // Update user database by pulling the specified object data
    global.mongo_connection
      .db('database-app')
      .collection('user_database')
      .updateOne(
        { _id: o_id },
        { $pull: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  }

  // 
};

async function update_user(id, objectData, method = 'set', socket = null) {
  var o_id = new ObjectId(id);

  // Update user based on the specified method
  if (method == 'set') {
    global.mongo_connection
      .db('database-app')
      .collection('users')
      .updateOne(
        { databaseId: o_id },
        { $set: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  } else if (method == 'unset') {
    // Update user by unsetting the specified object data
    global.mongo_connection
      .db('database-app')
      .collection('users')
      .updateOne(
        { databaseId: o_id },
        { $unset: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  } else if (method == 'push') {
    // Update user by pushing the specified object data
    global.mongo_connection
      .db('database-app')
      .collection('users')
      .updateOne(
        { databaseId: o_id },
        { $push: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  } else if (method == 'addToSet') {
    // Update user by adding the specified object data to the set
    global.mongo_connection
      .db('database-app')
      .collection('users')
      .updateOne(
        { databaseId: o_id },
        { $addToSet: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  } else if (method == 'pull') {
    // Update user by pulling the specified object data
    global.mongo_connection
      .db('database-app')
      .collection('users')
      .updateOne(
        { databaseId: o_id },
        { $pull: objectData }
      ).catch((err) => {
        console.log(err);
        if (socket != null) {
          try {
            socket.emit('status', 'Failed to ' + method);
          } catch (socket_err) {
            console.log(socket_err);
          }
        }
      });
  }
}

// 

module.exports = {
  update_user,
  update_user_database
};
