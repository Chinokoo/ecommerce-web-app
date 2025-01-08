import Coupon from "../models/coupon.model.js";
import { stripe } from "../utils/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0)
      return res.status(400).json({ error: "invalid or empty products array" });

    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // convert dollars to cents bcoz stripe only allows cents
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
      };
    });
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon)
        return (totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        ));
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      metadata: {
        userId: req.user._id,
        couponCode: coupon.code || "",
      },
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],
    });

    if (totalAmount >= 20000) return await createNewCoupon(req.user._id);

    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.log("error in createCheckoutSession", error.message);
    res.status(500).json({ message: error.message });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userId) {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });

  await newCoupon.save();
}
