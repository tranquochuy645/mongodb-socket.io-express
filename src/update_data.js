const { new_database_connection, close_database_connection } = require('./database_connection.js');
const ObjectId = require('mongodb').ObjectId;
async function update_user_database(id, objectData) {
    try {
        const mongo_connection = await new_database_connection();
        var o_id = new ObjectId(id);
        mongo_connection
            .db('database-app')
            .collection('user_database')
            .updateOne(
                { _id: o_id },
                {
                    $set: objectData
                }
            );
        // close_database_connection(mongo_connection);


    } catch (errror) {
        console.log(error);

    }
};
async function update_user(id, objectData,method='set') {
    try {
        const mongo_connection = await new_database_connection();
        var o_id = new ObjectId(id);
        if(method=='set'){
            mongo_connection
            .db('database-app')
            .collection('users')
            .updateOne(
                { databaseId: o_id },
                {
                    $set: objectData
                }
            );
        };
        if(method=='push'){
            mongo_connection
            .db('database-app')
            .collection('users')
            .updateOne(
                { databaseId: o_id },
                {
                    $push: objectData
                }
            );
        };
        if(method=='addToSet'){
            mongo_connection
            .db('database-app')
            .collection('users')
            .updateOne(
                { databaseId: o_id },
                {
                    $addToSet: objectData
                }
            );
        };
        if(method=='pull'){
            mongo_connection
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