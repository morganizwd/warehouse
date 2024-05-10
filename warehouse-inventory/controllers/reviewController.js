import ReviewModel from '../models/review.js';

export const create = async (req, res) => {
    try{
        const doc = new ReviewModel({
            user: req.userId,
            check: req.body.check,
            text: req.body.text,
        });

        const review = await doc.save();

        res.json(review);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Create attempt failed',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json({ message: 'Review doesn\'t exist' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error in delete review:', error);
        res.status(500).json({ message: 'Remove attempt failed', error: error.toString() });
    }
};

export const update = async (req, res) => {
    try{
        const reviewId = req.params.id;

        await ReviewModel.updateOne(
            {
                _id: reviewId,
            },
            {
                check: req.body.check,
                text: req.body.text,
            },
        );
        
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Update attempt failed',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const checkId = req.params.id;

        const reviews = await ReviewModel.find({ check: checkId }).populate('user', 'userName');

        res.json(reviews);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve reviews',
        });
    }
};