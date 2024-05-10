import mongoose from "mongoose";

const StorageLocationShema = new mongoose.Schema(
    {
        shelfNumber: {
            type: Number,
            required: true,
        },
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WareHouse',
        }
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('StorageLocation', StorageLocationShema);