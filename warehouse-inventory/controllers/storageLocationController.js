import StorageLocationModel from '../models/storageLocation.js';

export const create = async (req, res) => {
    try {
        const { shelfNumber } = req.body;
        const { warehouse } = req.body;

        const storageLocation = new StorageLocationModel({
            shelfNumber,
            warehouse,
        });

        await storageLocation.save();

        res.status(201).json(storageLocation);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create storage location',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const storageLocations = await StorageLocationModel.find();
        res.json(storageLocations);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve storage locations',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const storageLocationId = req.params.id;
        const storageLocation = await StorageLocationModel.findById(storageLocationId);

        if (!storageLocation) {
            return res.status(404).json({ message: 'Storage location not found' });
        }

        res.json(storageLocation);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving storage location' });
    }
};

export const update = async (req, res) => {
    try {
        const storageLocationId = req.params.id;
        const { shelfNumber } = req.body;
        const { warehouse } = req.body;

        const updatedStorageLocation = await StorageLocationModel.findByIdAndUpdate(storageLocationId, {
            shelfNumber,
            warehouse,
        }, { new: true });

        if (!updatedStorageLocation) {
            return res.status(404).json({ message: 'Storage location not found' });
        }

        res.json(updatedStorageLocation);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update storage location',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const storageLocationId = req.params.id;
        const deletedStorageLocation = await StorageLocationModel.findByIdAndDelete(storageLocationId);

        if (!deletedStorageLocation) {
            return res.status(404).json({ message: 'Storage location not found' });
        }

        res.json({ message: 'Storage location successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete storage location' });
    }
};