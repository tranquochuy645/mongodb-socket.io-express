const { new_database_connection, close_database_connection } = require('./database_connection.js');

async function route_create_user(req, res) {
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Invalid content-type' });
    };
    try {
        if (req.body.username == "" || req.body.password == "") {
            res.status(409).send('Empty username or password');
            console.log('empty');
            return;
        };
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

                        var databaseId;

                        db.collection('user_database')
                            .insertOne({})
                            .then((result) => {

                                if (!result) {
                                    console.log('Failed to create user database');
                                    res.status(500);
                                    return;
                                } else {
                                    databaseId = result.insertedId;

                                    db.collection('users').insertOne(
                                        {
                                            username: username,
                                            password: password,
                                            databaseId: databaseId
                                        }
                                    )
                                        .then(
                                            (result) => {
                                                if (!result) {
                                                    console.error('khong biet sao bug luon =)))');
                                                    res.status(500).send('Error creating user');
                                                    close_database_connection(mongo_connection);

                                                } else {
                                                    console.log(`User "${username}" created`);
                                                    res.status(201).send('User created successfully');
                                                    close_database_connection(mongo_connection);
                                                    // User created successfully.
                                                }
                                            }
                                        );
                                }


                            });


                    }
                }
            );
    } catch (error) {

        return res.status(400).json({ error: 'Malformed JSON' });


    }

};



module.exports = {
    route_create_user
};
