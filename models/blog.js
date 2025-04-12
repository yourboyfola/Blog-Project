import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model('BlogPost', blogSchema);

export default BlogPost;

