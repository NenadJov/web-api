const connection = require('../database');
const { User, Post } = require('../models');

getAllPostsQuery = (user) => {
    const query = 'SELECT * FROM user JOIN posts ON user.Id = posts.UserId WHERE user.Id = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [user], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    });
};

getAllPosts = async (req, res) => {
    user = req.params.userId;
    try {
        const users = await getAllPostsQuery(user);
        var finalData = users.map(member => {
            postObj = {
                text: member.Text,
                date: member.CreatedOn,
                likes: member.Likes
            }
            return postObj;
        })
        var final = {
            id: users[0].UserId,
            name: users[0].Name,
            surname: users[0].Surname,
            email: users[0].Email,
            age: users[0].Age,
            posts: finalData
        }
        res.status(200).send(final);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

getSpecificPostQuery = (postId) => {
    const query = 'SELECT * FROM posts WHERE Id = ?'; //treba da se smeni kverito!!!
    return new Promise((resolve, reject) => {
        connection.query(query, [postId], (error, results, fields) =>{
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

getSpecificPost = async (req, res, next) => {
    const postId = req.params.id;
    if(postId <= 0) {
        var error = new Error("id can not br less than 1");
        error.status = 401;
        return next(error);
    }
    try {
        const post = await getSpecificPostQuery(postId);
        res.status(200).send(post[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

createPostQuery = (text, likes, userId) => {
    const query = 'INSERT INTO posts (Text, Likes, CreatedOn, UserId) VALUES(?, ?, now(), ?';  //treba da se smeni kverito!!!
    return new Promise((resolve, reject) => {
        connection.query(query, [text, likes, userId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

createPost = async (req, res, next) => {
    const postText = req.body.text;
    const postLikes = req.body.likes;
    const postUserId = req.body.userId;
    try {
        const post = await createPostQuery(postText, postLikes, postUserId);
        res.status(200).send("post is created with id" + post.insertId);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

updatePostQuery = (id, post) => {
    const query = 'UPDATE posts SET Text = ?, Likes = ?, CreatedOn = now() WHERE Id = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [post.text, post.likes, id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

updatePost = async (req, res, next) => {
    const postRequest = req.body;
    const postId= req.params.postId;
    try {
        const post = await updatePostQuery(postId, postRequest);
        res.status(200).send(post); //"post is updated with id" + post
    } catch (error) {
        res.status(500).send(error.message);
    }
};

getPostsForUserQuery = (userId) => {
    const query = 'SELECT u.Name, u.Surname, u.Email, u.Age, p.Text, p.Likes, p.CreatedOn FROM user as u JOIN posts as p ON u.Id = p.UserId WHERE u.Id = ?';
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

getPostsForUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const result = await getPostsForUserQuery(userId);
        const dbUser = result[0];
        let user = new User(dbUser.Name, dbUser.Surname, dbUser.Email, dbUser.Age, dbUser.isActive, []);
        let posts = result.map( x => {
            return new Post(x.Text, x.Likes, x.CreatedOn);
        });
        user.posts = posts;
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getAllPosts,
    getSpecificPost,
    createPost,
    updatePost,
    getPostsForUser
}