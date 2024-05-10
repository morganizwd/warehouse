import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProducts,
    createProducts,
    updateProducts,
    deleteProducts,
} from '../redux/slices/products';
import {
    fetchCategories,
} from '../redux/slices/categories';
import {
    fetchStorageLocation,
} from '../redux/slices/storageLocation';
import {
    fetchSupplier,
} from '../redux/slices/supplier';
import {
    fetchWarehouse,
} from '../redux/slices/warehouse';
import axios from '../redux/axios';
import { Grid, Card, CardContent, Typography, CardMedia, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProductsPage = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);
    const categories = useSelector(state => state.categories.categories);
    const storageLocations = useSelector(state => state.storageLocation.storageLocation);
    const suppliers = useSelector(state => state.supplier.supplier);
    const warehouses = useSelector(state => state.warehouse.warehouse);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', amount: '', categories: [], storageLocation: '', supplier: '', warehouse: '', imageUrl: '' });
    const [imageFile, setImageFile] = useState(null);

    const [searchName, setSearchName] = useState('');
    const [searchDescription, setSearchDescription] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
        dispatch(fetchStorageLocation());
        dispatch(fetchSupplier());
        dispatch(fetchWarehouse());
    }, [dispatch]);

    const handleOpenDialog = (product) => {
        setCurrentProduct(product);
        setOpenDialog(true);
        if (product) {
            setNewProduct({
                name: product.name,
                description: product.description,
                price: product.price,
                amount: product.amount,
                categories: product.categories,
                storageLocation: product.storageLocation,
                supplier: product.supplier,
                warehouse: product.wareHouse,
                imageUrl: product.imageUrl,
            });
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentProduct(null);
        setNewProduct({ name: '', description: '', price: '', amount: '', categories: [], storageLocation: '', supplier: '', warehouse: '', imageUrl: '' });
        setImageFile(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const uploadImage = async (formData) => {
        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const handleSaveProduct = async () => {
        let productData = currentProduct ? { ...currentProduct, ...newProduct } : newProduct;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            const uploadedImageData = await uploadImage(formData);
            if (uploadedImageData && uploadedImageData.url) {
                productData = { ...productData, imageUrl: `${window.location.protocol}//localhost:4444${uploadedImageData.url}` };
            }
        }

        if (currentProduct) {
            dispatch(updateProducts({ id: currentProduct._id, updatedData: productData }));
        } else {
            dispatch(createProducts(productData));
        }
        handleCloseDialog();
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchName.toLowerCase()) &&
        product.description.toLowerCase().includes(searchDescription.toLowerCase())
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>Управление товарами</Typography>
            <Button color="primary" onClick={() => handleOpenDialog(null)}>Добавить товар</Button>
            <TextField
                label="Поиск по названию"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
            />
            <TextField
                label="Поиск по описанию"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchDescription}
                onChange={(e) => setSearchDescription(e.target.value)}
            />
            <Grid container spacing={3}>
                {filteredProducts.map(product => (
                    <Grid item key={product._id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={product.imageUrl || 'default_product_image.jpg'}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography variant="h5">{product.name}</Typography>
                                <Typography variant="body2">{product.description}</Typography>
                                <Button color="primary" onClick={() => handleOpenDialog(product)}>Изменить</Button>
                                <Button color="secondary" onClick={() => dispatch(deleteProducts(product._id))}>Удалить</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newProduct.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={newProduct.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="price"
                        label="Price"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={newProduct.price}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={newProduct.amount}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="storageLocation-label">Storage Location</InputLabel>
                        <Select
                            labelId="storageLocation-label"
                            id="storageLocation"
                            name="storageLocation"
                            value={newProduct.storageLocation}
                            label="Storage Location"
                            onChange={handleChange}
                        >
                            {storageLocations.map((location) => (
                                <MenuItem key={location._id} value={location._id}>{`Shelf ${location.shelfNumber}, Warehouse ${location.warehouse?.name}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="supplier-label">Supplier</InputLabel>
                        <Select
                            labelId="supplier-label"
                            id="supplier"
                            name="supplier"
                            value={newProduct.supplier}
                            label="Supplier"
                            onChange={handleChange}
                        >
                            {suppliers.map((supp) => (
                                <MenuItem key={supp._id} value={supp._id}>{supp.companyName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="warehouse-label">Warehouse</InputLabel>
                        <Select
                            labelId="warehouse-label"
                            id="warehouse"
                            name="warehouse"
                            value={newProduct.warehouse}
                            label="Warehouse"
                            onChange={handleChange}
                        >
                            {warehouses.map((wh) => (
                                <MenuItem key={wh._id} value={wh._id}>{wh.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="categories-label">Categories</InputLabel>
                        <Select
                            labelId="categories-label"
                            id="categories"
                            name="categories"
                            multiple
                            value={newProduct.categories}
                            onChange={handleChange}
                            renderValue={(selected) => selected.map(id => categories.find(c => c._id === id)?.name).join(', ')}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        type="file"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveProduct}>{currentProduct ? 'Save Changes' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductsPage;
