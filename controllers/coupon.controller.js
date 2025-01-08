import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userid: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log(error.message, "error in getCoupon");
    res.status(500).send(error.message);
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      isActive: true,
      userId: req.user._id,
    });

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    res.status(500).json(error.message);
    console.log(error.message, "error in validateCoupon");
  }
};
