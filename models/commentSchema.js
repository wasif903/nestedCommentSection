import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema({

    comment: {
        type: String,
        required: true,
    },
    childComments: [{

        commentId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date().getTime()
        }
    }],

    replies: [{

        commentId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        childCommentsID: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date().getTime()
        }
    }]
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;