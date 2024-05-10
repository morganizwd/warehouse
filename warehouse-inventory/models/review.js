import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }, 
        check: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Check',
            required: true,
        },
        text: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Review', ReviewSchema);