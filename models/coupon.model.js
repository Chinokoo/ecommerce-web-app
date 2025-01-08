import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: [0, "Discount percentage must be greater than 0"],
      max: [100, "Discount percentage must be less than 100"],
    },
    expirationDate: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
