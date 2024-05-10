import mongoose from "mongoose";

const SupplierShema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            maxlength: 132,
        },
        address: {
            type: String,
            required: true,
            maxlength: 132,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Supplier', SupplierShema);