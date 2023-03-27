
const ObjectId = require('mongodb').ObjectId;
async function update_user_database(id, objectData, method = 'set') {
    try {
        if (method == 'set') {
            var o_id = new ObjectId(id);
            global.mongo_connection
                .db('database-app')
                .collection('user_database')
                .updateOne(
                    { _id: o_id },
                    {
                        $set: objectData
                    }
                );
        }
        if (method == 'push') {
            var o_id = new ObjectId(id);
            global.mongo_connection
                .db('database-app')
                .collection('user_database')
                .updateOne(
                    { _id: o_id },
                    {
                        $push: objectData
                    }
                );
        }
        if (method == 'addToSet') {
            global.mongo_connection
                .db('database-app')
                .collection('user_database')
                .updateOne(
                    { databaseId: o_id },
                    {
                        $addToSet: objectData
                    }
                );
        }
        if (method = 'pull') {
            global.mongo_connection
                .db('database-app')
                .collection('user_database')
                .updateOne(
                    { databaseId: o_id },
                    {
                        $pull: objectData
                    }
                );
        }

        // close_database_connection(mongo_connection);


    } catch (errror) {
        console.log(error);

    }
};
async function update_user(id, objectData, method = 'set') {
    try {

        var o_id = new ObjectId(id);
        if (method == 'set') {
            global.mongo_connection
                .db('database-app')
                .collection('users')
                .updateOne(
                    { databaseId: o_id },
                    {
                        $set: objectData
                    }
                );
        };
        if (method == 'push') {
            global.mongo_connection
                .db('database-app')
                .collection('users')
                .updateOne(
                    { databaseId: o_id },
                    {
                        $push: objectData
                    }
                );
        };
        if (method == 'addToSet') {
            global.mongo_connection
                .db('database-app')
                .collection('users')
                .updateOne(
                    { databaseId: o_id },
                    {
                        $addToSet: objectData
                    }
                );
        };
        if (method == 'pull') {
            global.mongo_connection
                .db('database-app')
                .collection('users')
                .updateOne(
                    { databaseId: o_id },
                    {
                        $pull: objectData
                    }
                );
        };

        // close_database_connection(mongo_connection);


    } catch (errror) {
        console.log(error);

    }
};
module.exports = {
    update_user,
    update_user_database
};