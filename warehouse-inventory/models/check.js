import mongoose from "mongoose";

const CheckSchema = new mongoose.Schema(
    {
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        ],
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Check', CheckSchema);