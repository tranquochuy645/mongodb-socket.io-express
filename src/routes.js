const { new_database_connection, close_database_connection } = require('./database_connection.js');

async function route_create_user (req, res) {
    const mongo_connection = await new_database_connection();
    
    const username = req.body.username;
    const password = req.body.password;
    // console.log(req.headers);
    const db = mongo_connection.db('database-app');
    db.collection('users').findOne(
        {
            'username': username
        }
    )
        .then(
            (user) => {//callback//
                if (user) {
                    console.log(`Username "${username}" already exists`);
                    res.status(409).send('Username already exists');
                    close_database_connection(mongo_connection);
                   
                } else {
                    db.collection('users').insertOne(
                        {
                            username: username,
                            password: password
                        })
                        .then(
                            (err, result) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send('Error creating user');
                                    close_database_connection(mongo_connection);
                                   
                                } else {
                                    console.log(`User "${username}" created`);
                                    res.status(201).send('User created successfully');
                                    close_database_connection(mongo_connection);
                            }
                        });

                        
                }
            }
        );
        

};


async function route_update_user_data(req, res) {
    const mongo_connection = await new_database_connection();

    const username = req.headers.username;
    const password = req.headers.password;
    const user_data = req.body;

    const db = mongo_connection.db('database-app');

    // Check if username and password are correct
    const user = await db.collection('users').findOne({ 'username': username });
    if (!user || user.password !== password) {
        res.status(401).send('Incorrect username or password');
        close_database_connection(mongo_connection);
        return;
    }

    // Update user data in users-database collection
    db.collection('users-database').updateOne({ 'username': username }, { $set: user_data }, { upsert: true })
        .then(() => {
            console.log(`User data for "${username}" updated`);
            res.status(200).send('User data updated successfully');
            close_database_connection(mongo_connection);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error updating user data');
            close_database_connection(mongo_connection);
        });
};


module.exports = {
    route_create_user,
    route_update_user_data
};
