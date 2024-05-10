import mongoose from "mongoose";

const WareHouseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 32,
        },
        address: {
            type: String,
            required: true,
            maxlength: 32,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('WareHouse', WareHouseSchema);
