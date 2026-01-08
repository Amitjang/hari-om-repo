import cartItemSchema from "../models/cartItem.model";
import mongoose from "mongoose";
const CartItem = mongoose.model("CartItem", cartItemSchema);
/** * @desc    Create cart item
 */
export const createCartItem = async (req, res) =>{
    try {
        const cartItem = await CartItem.create(req.body);
        res.status(201).json({
            success: true,
            data: cartItem
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }      
};