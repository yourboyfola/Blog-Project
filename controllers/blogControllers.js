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
          const posts = await BlogPost.find(); 
          res.render('index', { posts });
        } catch (error) {
          console.log('❌ Error:', error);
          res.status(500).send("Error detected");
        }
      });

      app.get('/new', async (req, res) => {
        try {
          res.render('new'); 
        } catch (error) {
          console.log('❌ Error:', error);
          res.status(500).send("Error detected");
        }
      });
    
      app.get('/posts/:id', async (req, res) => {
        try {
          const post = await BlogPost.findById(req.params.id); 
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

          const { title, content } = req.body;  
          if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
          }
          
          const newPost = new BlogPost({
            title,
            content,
            date: new Date().toLocaleDateString(), 
          });
      
          await newPost.save();  
          res.redirect('/');  
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
              date: new Date().toLocaleDateString(), 
            },
            { new: true } 
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