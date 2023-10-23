import { Schema } from 'mongoose';

const userSchema = new Schema({
    email: { type: String },
    password: { type: String },
    name: { 
        type: String, 
        required: true,
    },
    googleID: { type: String },
    thumbnail: { type: String },
    data: {
        type: Date,
        default: Date.now,
    },
});

export default userSchema;