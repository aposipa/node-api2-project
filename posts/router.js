const express = require("express");

const Posts = require("../data/db.js");

const router = express.Router();

// GET list of all posts
router.get("/", (req, res) => {
    Posts.find(req.query)
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ message: "error recieving posts" });
        });
});

// GET post with specific id 
router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then((post) => {
            if(post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "Post is in another castle" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "error retrievin posts" });
        });
});

// GET posts of all comments on an id
router.get("/:id/comments", (req, res) => {
    const postId = req.params.id;
    Posts.findPostComments(postId)
        .then((post) => {
            if(post.length === 0) {
                res.status(404).json({ message: "Post with spec ID doesnt exist" });
            } else {
                res.status(200).json(post);
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "comments couldn't be retrieved" });
        });
});

// POST a new blog post
router.post("/", (req, res) => {
    const post = req.body;
    if(!post.title || !post.contents) {
        res.status(400).json({ message: "Provide title and contents for post"});
    } else {
        Posts.insert(post)
        .then(post => {
            Posts.findById(post.id)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                res.status(500).json({ message: "err while saving to database"});
            });
        });
    }
});

// POST a new comment
router.post("/:id/comments", (req, res) => {
    const { text, post_id } = req.body;
    if(!text || !post_id) {
        res.status(404).json({ message: "post with specified ID does not exist" });
    } else {
        Posts.insertComment(req.body)
        .then(comment => {
            res.status(201).json(comment);
        })
        .catch(err => {
            res.status(500).json({ message: "error adding a new post" });
        });
    }
});

// DELETE dis
router.delete("/:id", (req, res) => {
    Posts.remove(req.params.id)
    .then(count => {
        if(count > 0) {
            res.status(200).json({ message: "wee-oo, your post has been destroyed" });
        } else {
            res.status(404).json({ message: "destruction not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ message: "error with deleting this post?"});
    });
});

// PUT an update to a post with specific id
router.put("/:id", (req, res) => {
    const changes = req.body;
    Posts.update(req.params.id, changes)
    .then(update => {
        if(update) {
            res.status(200).json({ update: changes });
        } else {
            res.status(404).json({ message: "the post you are looking for could not be found at this time"});
        }
    })
    .catch(err => {
        res.status(500).json({ message: "error with updating this post? "});
    });
});

module.exports = router;

