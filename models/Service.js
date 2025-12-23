import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL to image
      required: false,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Baby Care", "Elderly Care", "Special Care", "Pet Care", "Household", "Education"],
      required: true,
    },
    features: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);
