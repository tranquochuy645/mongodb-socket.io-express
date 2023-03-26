const { new_database_connection, close_database_connection } = require('./database_connection.js');
async function get_data(req, res) {

    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Invalid content-type' });
    }
    try {
        if (req.headers.token != null) {
            const mongo_connection = await new_database_connection();
          
            console.log(global.valid_token);
            global.valid_token.forEach((item) => {
                if (item == req.headers.token) {
                    //write a function to find the actual data to send istead of this =)))

                    res.send(
                        JSON.stringify(
                            {
                                'your-data1': '=)))))))))',
                                'your-data2': '=)))))))))',
                                'your-data3': '=)))))))))',
                                'your-data4': '=)))))))))',
                                'your-data5': '=)))))))))'
                            }
                        )
                    )
                    //send data
                }
            })
        } else {
            console.log('else');
            res.send(
                JSON.stringify(
                    {
                        'your-data': '=)))))))))'
                    }
                )
            )
        }
    } catch (errror) {
        return res.status(400).json({ error: 'Malformed JSON' });

    }
};
module.exports = {
    get_data
};