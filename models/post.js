import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
    title: { 
        type: String, 
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: String,
        required: true,
    }
});

const Post = mongoose.model('post', postSchema);
export default Post;