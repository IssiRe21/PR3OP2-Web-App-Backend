const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const { sequelize } = require("./config/db");
const { Post } = require("./models/post.model");
const { Comment } = require("./models/comment.model");
const app = express();
const port = 3000;

Post.hasMany(Comment);

// sequelize.sync({force: true});
sequelize.sync({});

app.set("view engine", "ejs");

// Variables

// Rutas
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// Read
app.get("/", (req, res) => {
    (async () => {
        let post = await Post.findAll();

        res.render("pages/index", {
            post: post,
        });
    })();
});

// Create
app.post("/create", (req, res) => {
   
    // Crear una variable para facilitar el acceso al valor introducido
    let username = req.body.username;
    let content = req.body.content;

    (async () => {
        let post = await Post.create({
            username: username,
            content: content,
            com: 0,
        });

        res.redirect('/');
    })();
});


app.get('/comments/:id', (req, res, next) => {
    let id = req.params.id;

    (async () => {
        let post = await Post.findByPk(id);

        let comments = await Comment.findAll({
            where: {
                postId: id,
            },
        });

        res.render('pages/comments', {
            post: post,
            comments: comments,
        });
    })();
});

app.post('/comments/create', (req, res, next) => {
    let postId = req.body.postId;
    let name = req.body.name;
    let comment = req.body.comment;

    (async () => {
        let post = await Post.findByPk(postId);
        let com = post.com + 1;
        await Comment.create({
            name: name,
            comment: comment,
            postId: postId,
        });

        post.com = com;
        await post.save();

        res.redirect('/comments/' + postId);
    })();
});

// Not Found
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    let message = err.message;
    let error = err;

    res.status(err.status || 500);
    res.render("pages/error", {
        message,
        error
    });
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});