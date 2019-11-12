class User {
    constructor(name, surname, email, age, isActive, posts) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.age = age;
        this.isActive = isActive;
        this.posts = posts
    }
}

class Post {
    constructor(text, likes, createdOn) {
        this.text = text;
        this.likes = likes;
        this.createdOn = createdOn
    }
}

module.exports = {
    User,
    Post
}