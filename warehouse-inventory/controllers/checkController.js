import CheckModel from '../models/check.js';

export const create = async (req, res) => {
    try {
        const { products } = req.body;

        const check = new CheckModel({
            products,
        });

        await check.save();

        res.status(201).json(check);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create check',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const checks = await CheckModel.find().populate('products');
        res.json(checks);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve checks',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const checkId = req.params.id;
        const check = await CheckModel.findById(checkId).populate('products');

        if (!check) {
            return res.status(404).json({ message: 'Check not found' });
        }

        res.json(check);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving check' });
    }
};

export const update = async (req, res) => {
    try {
        const checkId = req.params.id;
        const { products } = req.body;

        const updatedCheck = await CheckModel.findByIdAndUpdate(checkId, {
            products,
        }, { new: true });

        if (!updatedCheck) {
            return res.status(404).json({ message: 'Check not found' });
        }

        res.json(updatedCheck);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update check',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const checkId = req.params.id;
        const deletedCheck = await CheckModel.findByIdAndDelete(checkId);

        if (!deletedCheck) {
            return res.status(404).json({ message: 'Check not found' });
        }

        res.json({ message: 'Check successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete check' });
    }
};