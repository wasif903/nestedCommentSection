import express from "express";
import commentSchema from "../models/commentSchema.js";

const router = express.Router();


router.post('/post-comment', async (req, res) => {
    try {
        const parentComment = new commentSchema({
            parentComment: req.body.parentComment
        })

        const saveParentComment = await parentComment.save();

        res.status(201).json({ message: "Comment Posted", saveParentComment });

    } catch (error) {
        res.status(500).json(error);
    }
})


router.post('/:commentId/post-reply', async (req, res) => {
    let id = req.params?.commentId;
    try {
        if (id) {

            const reply = {
                commentId: id,
                text: req.body?.text,
            }

            let comment = await commentSchema.findByIdAndUpdate({ _id: id }, { $push: { childComments: reply } }, { new: true })

            res.json(comment);

        } else {
            res.status(404).json({ message: 'Comment with this id not found!' })
        }

    } catch (error) {
        res.status(401).json({ message: 'Problem with Getting Comment From Server', error: error });
        console.log(error)
    }
})

router.post('/:commentId/:childCommentID/post-reply', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const childCommentId = req.params.childCommentID;

        const reply = {
            commentId: commentId,
            childCommentsID: childCommentId,
            text: req.body.text,
        };

        const comment = await commentSchema.findOneAndUpdate(
            { _id: commentId, 'childComments._id': childCommentId },
            { $push: { replies: reply } },
            { new: true }
        );

        if (comment) {
            res.json(comment);
        } else {
            res.status(404).json({ message: 'Comment or Child Comment not found!' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Problem with Getting Comment From Server', error: error.message });
    }
});





export default router;

