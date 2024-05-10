import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 32,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

UserSchema.index({ phoneNumber: 1 }, { unique: true });

export default mongoose.model('User', UserSchema);