import { Schema, model } from "mongoose";

const organizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

export default model("Organization", organizationSchema);