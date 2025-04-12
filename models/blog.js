import mongoose from "mongoose";

// Define the schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Create a model from the schema
const BlogPost = mongoose.model('BlogPost', blogSchema);

export default BlogPost;

