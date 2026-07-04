import { Schema, model, Types } from "mongoose";

const featureFlagSchema = new Schema(
    {
        featureKey: {
            type: String,
            required: true,
            trim: true,
        },

        enabled: {
            type: Boolean,
            default: false,
        },

        organizationId: {
            type: Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        createdBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

featureFlagSchema.index(
    {
        organizationId: 1,
        featureKey: 1,
    },
    {
        unique: true,
    }
);

export default model("FeatureFlag", featureFlagSchema);