export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = await user.cartItems.find(
      (item) => item.id === productId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("error in addToCart", error);
    res.status(500).send(error.message);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res.status(500).send(error.message);
    console.log("error in removeFromCart", error);
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const user = req.user;

    const existingItem = await user.cartItems.find((item) => item.id === id);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== id);
        await user.save();
        res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).send("Item not found in cart");
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log("error in updateCartQuantity", error);
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    //adding quantity to each product object
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJson(), quantity: item.quantity };
    });
    res.json(cartItems);
  } catch (error) {
    console.log("error in getCartProducts", error);
    res.status(500).send(error.message);
  }
};
