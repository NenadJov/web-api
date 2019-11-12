const connection = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

getAllUsersQuery = () => {
    const query = 'SELECT * FROM user';
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersQuery();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

getSpecificUserQuery = (userId) => {
    const query = 'SELECT * FROM user WHERE Id = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [userId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

getSpecificUser = async (req, res, next) => {
    const userId = req.params.id;
    if (userId <= 0) {
        var error = new Error("id can not be less than 1 !!!");
        error.status = 403;
        next(error);
    } 
    try {
        const user = await getSpecificUserQuery(userId);
        res.status(200).send(user[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

createUserQuery = (name, surname, email, age, isActive, pass) => {
    const query = 'INSERT INTO user (Name, Surname, Email, Age, IsActive, Password) VALUES (?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        connection.query(query, [name, surname, email, age, isActive, pass], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

createUser = async (req, res, next) => {
    const userName = req.body.Name;
    const userSurname = req.body.Surname;
    const userEmail = req.body.Email;
    const userAge = req.body.Age;
    const userIsActive = req.body.IsActive;
    const userPassword = req.body.Password;
    try {
        const passHash = bcrypt.hashSync(userPassword, 10);
        const user = await createUserQuery(userName, userSurname, userEmail, userAge, userIsActive, passHash);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

changeUserQuery = (id, user) => {
    const query = 'UPDATE user SET Name = ?, Surname = ?, Email = ?, Age = ?, IsActive = ? WHERE Id = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [user.name, user.surname, user.email, user.age, user.isActive, id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                if (results.affectesRows == 0) {
                    reject('nema user so takvo Id')
                } else {
                    resolve(results);
                }
            }
        });
    });
};

changeUser = async (req, res, next) => {
    const user = req.body;
    const id = req.params.id;
    try {
        const users = await changeUserQuery(id, user);
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// changePartUser = (req, res) => {
//     let rawdata = fs.readFileSync('users.json');
//     let users = JSON.parse(rawdata);

//     users.forEach(member => {
//         if (member.id === parseInt(req.params.id)) {
//             member.age = req.body.age;
//             member.isActive = req.body.isActive;
//             let data = JSON.stringify(users, null, 2);
//             fs.writeFileSync('users.json', data);
//             return;
//         }
//     })
//     res.send("Partial update for user with id = " + req.params.id);
// };

deleteUserQuery = (userId) => {
    const query = 'DELETE FROM user WHERE Id = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [userId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

deleteUser = async (req, res, next) => {
    var userId = req.params.id;
    try {
        const users = await deleteUserQuery(userId)
        res.status(200).send("Delete user with id = " + userId);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

getUserByEmailQuery = (email) => {
    const query = 'SELECT * FROM user WHERE Email = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [email], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

loginUser = async (req, res) => {
    const email = req.body.Email;
    const pass = req.body.Password;
    try {
        var user = await getUserByEmailQuery(email);
        var dbUser = user[0];
        const matchPass = bcrypt.compareSync(pass, dbUser.Password);
        if (matchPass) {
            const token = jwt.sign({ dbUser }, 'abcd', { expiresIn: '1h' });
            res.status(200).send(token);
        } else {
            res.status(401).send('wrong pass');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}; 

module.exports = {
    getAllUsers,
    getSpecificUser,
    createUser,
    changeUser,
    changePartUser,
    deleteUser,
    loginUser
}