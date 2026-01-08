const CategoryModel = require('../models/category.model.js');

exports.createCategory = async (req, res) => {
    try{
        const category = new CategoryModel(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
        
    }};

    exports.getAllCategories = async (req, res) => {
        try {
            const categories = await CategoryModel.find(); 
            res.status(200).json({status: "success", data: categories });
         } catch (error) {
            res.status(500).json({ error: error.message });
        }   };