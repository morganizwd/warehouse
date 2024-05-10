import SupplierModel from '../models/supplier.js';

export const create = async (req, res) => {
    try {
        const { companyName, address, phoneNumber, imageUrl } = req.body;

        const supplier = new SupplierModel({
            companyName,
            address,
            phoneNumber,
            imageUrl,
        });

        await supplier.save();

        res.status(201).json(supplier);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create supplier',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const suppliers = await SupplierModel.find();
        res.json(suppliers);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve suppliers',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const supplier = await SupplierModel.findById(supplierId);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.json(supplier);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving supplier' });
    }
};

export const update = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const { companyName, address, phoneNumber, imageUrl } = req.body;

        const updatedSupplier = await SupplierModel.findByIdAndUpdate(supplierId, {
            companyName,
            address,
            phoneNumber,
            imageUrl,
        }, { new: true });

        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.json(updatedSupplier);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update supplier',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const deletedSupplier = await SupplierModel.findByIdAndDelete(supplierId);

        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.json({ message: 'Supplier successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete supplier' });
    }
};