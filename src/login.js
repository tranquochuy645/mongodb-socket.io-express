const { new_database_connection, close_database_connection } = require('./database_connection.js');

function removeDuplicates(arr) {
    /*
    This function takes an array as input and returns a new array with duplicates removed.
    */
    return Array.from(new Set(arr));
};
async function login(req, res) {

    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Invalid content-type' });
    };
    try{
    const mongo_connection = await new_database_connection();
    const username = req.body.username;
    const password = req.body.password;
    const db = mongo_connection.db('database-app');
    db.collection('users').findOne({
        'username': username,
        'password': password
    })
        .then(user => {

            if (user) {
                var token = user.databaseId;
                // Successful login

                // console.log(token);
                // console.log(token);
                console.log(`User "${username}" logged in`);

                res.status(200).send(token);

                close_database_connection(mongo_connection);


                global.valid_token.push(token);
                global.valid_token = removeDuplicates(global.valid_token);
                console.log(global.valid_token);



            } else {
                // Invalid username/password
                console.log(`Invalid username/password for user "${username}"`);
                res.status(401).send('Invalid username/password');
                close_database_connection(mongo_connection);
            };
            // console.log(token);


        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error logging in');
            close_database_connection(mongo_connection);
        });
    }catch (errror){
        return res.status(400).json({ error: 'Malformed JSON' });

    }

}
async function logout(req, res) {
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Invalid content-type' });
    }

    try {
        function removeValueFromArray(arr, value) {
            return arr.filter(function (elem) {
                return elem !== value;
            });
        };

        const delete_token = req.headers.token;
        removeValueFromArray(global.valid_token, delete_token);
        
        console.log(global.valid_token);
        res.status(200).send('Logged out');
    } catch (error) {
        return res.status(400).json({ error: 'Malformed JSON' });
    }

}

module.exports = {
    login,
    logout
}