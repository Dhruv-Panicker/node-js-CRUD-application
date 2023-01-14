const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST, 
    user: process.env.USER, 
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if(err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names;";

                //Call back function for errors
                connection.query(query, (err, results) => {
                    //If error is true create new Error object 
                    if(err) reject(new Error(err.message));
                    //If not resolve the results 
                    resolve(results);
                });
            });

            //console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, date_added) VALUES (?, ?);";

                //Call back function for errors
                connection.query(query, [name, dateAdded], (err, results) => {
                    //If error is true create new Error object 
                    if(err) reject(new Error(err.message));
                    //If not resolve the results 
                    resolve(results.insertId);
                });
            });
            return {
                id: insertId, 
                name: name, 
                dateAdded: dateAdded

            };

        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?;";

                //Call back function for errors
                connection.query(query, [id], (err, results) => {
                    //If error is true create new Error object 
                    if(err) reject(new Error(err.message));
                    //If not resolve the results 
                    resolve(results.affectedRows);
                }) 
            });
            return response === 1 ? true : false; 
        } catch (error) {
            console.log(error);
            return false; 
        }
        
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ?  WHERE id = ?;";

                //Call back function for errors
                connection.query(query, [name, id], (err, results) => {
                    //If error is true create new Error object 
                    if(err) reject(new Error(err.message));
                    //If not resolve the results 
                    resolve(results.affectedRows);
                }) 
            });
            return response === 1 ? true : false; 
        } catch (error) {
            console.log(error);
            return false; 
        }
    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names WHERE name= ?;";

                //Call back function for errors
                connection.query(query, [name], (err, results) => {
                    //If error is true create new Error object 
                    if(err) reject(new Error(err.message));
                    //If not resolve the results 
                    resolve(results);
                });
            });
            return response;

        } catch (error) {
            console.log(error);
        }

    }
}

module.exports = DbService;