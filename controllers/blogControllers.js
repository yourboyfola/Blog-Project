import bodyParser from "body-parser";

import mongoose from 'mongoose';
import BlogPost from "../models/blog.js";

// Connect to MongoDB
console.log("Attempting to connect to MongoDB...");
mongoose.connect('mongodb://localhost:27017/blogPostsDB')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

export function blogShit(app) {

    app.get('/', async (req, res) => {
        try {
          const posts = await BlogPost.find(); // Fetch all posts from the database
          res.render('index', { posts });
        } catch (error) {
          console.log('❌ Error:', error);
          res.status(500).send("Error detected");
        }
      });

      app.get('/new', async (req, res) => {
        try {
          res.render('new'); // No need to fetch posts here, just show the form
        } catch (error) {
          console.log('❌ Error:', error);
          res.status(500).send("Error detected");
        }
      });
    
      app.get('/posts/:id', async (req, res) => {
        try {
          const post = await BlogPost.findById(req.params.id); // Find the post by ID
          if (post) {
            res.render('show', { post });
          } else {
            res.status(404).send("Post not found");
          }
        } catch (error) {
          console.log('❌ Error:', error);
          res.status(500).send("Error detected");
        }
      });

      app.post('/posts', urlencodedParser, async (req, res) => {
        try {

            console.log(req.body);

          const { title, content } = req.body;  // Get data from form
          if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
          }
          
          const newPost = new BlogPost({
            title,
            content,
            date: new Date().toLocaleDateString(), // Set the date of the post
          });
      
          await newPost.save();  // Save post to DB
          res.redirect('/');  // Redirect back to home page (or send JSON response if needed)
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });

    app.post('/posts/edit', urlencodedParser, async (req, res) => {
        const postId = req.body.id;
      
        try {
          const updatedPost = await BlogPost.findByIdAndUpdate(
            postId,
            {
              title: req.body.title,
              content: req.body.content,
              date: new Date().toLocaleDateString(), // Optional
            },
            { new: true } // This returns the updated document
          );
      
          if (updatedPost) {
            res.redirect('/');
          } else {
            res.status(404).send("Post not found");
          }
        } catch (err) {
          res.status(500).send("Something went wrong");
        }
      });
    
app.post('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    await BlogPost.findByIdAndDelete(postId);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting post');
  }
});

app.get('/posts/:id/edit', async (req, res) => {
    try {
      const post = await BlogPost.findById(req.params.id);
      if (post) {
        res.render('edit', { post });
      } else {
        res.status(404).send("Post not found");
      }
    } catch (error) {
      console.error('❌ Error fetching post for edit:', error);
      res.status(500).send("Error loading edit page");
    }
  });
  

}; 