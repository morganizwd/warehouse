import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWarehouse, createWarehouse, deleteWarehouse, updateWarehouse } from '../redux/slices/warehouse';
import { Grid, Card, CardContent, Typography, CardMedia, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from '../redux/axios';

const WarehousePage = () => {
    const dispatch = useDispatch();
    const warehouses = useSelector(state => state.warehouse.warehouse);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [currentWarehouse, setCurrentWarehouse] = useState(null);
    const [NewWarehouse, setNewWarehouse] = useState({ name: '', address: '', imageUrl: '' });
    const [imageFile, setImageFile] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');

    useEffect(() => {
        dispatch(fetchWarehouse());
    }, [dispatch]);

    const handleOpenEditDialog = (warehouse) => {
        setCurrentWarehouse(warehouse);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentWarehouse(null);
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewWarehouse({ name: '', address: '', imageUrl: '' });
    };

    const handleChange = (e, warehouseType) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        warehouseType === 'new' ? setNewWarehouse({ ...NewWarehouse, [name]: newValue }) : setCurrentWarehouse({ ...currentWarehouse, [name]: newValue });
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const uploadImage = async (formData) => {
        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multiwarehouse/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const handleCreateOrupdateWarehouse = async (isCreate) => {
        let warehouseData = isCreate ? NewWarehouse : currentWarehouse;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            const uploadedImageData = await uploadImage(formData);
            if (uploadedImageData && uploadedImageData.url) {
                warehouseData = { ...warehouseData, imageUrl: `${window.location.protocol}//localhost:4444${uploadedImageData.url}` };
            }
        }

        if (isCreate) {
            dispatch(createWarehouse(warehouseData));
            handleCloseCreateDialog();
        } else {
            dispatch(updateWarehouse({ id: currentWarehouse._id, updatedData: warehouseData }));
            handleCloseEditDialog();
        }
    };

    const filteredWarehouses = warehouses.filter(warehouse =>
        warehouse.name.toLowerCase().includes(searchName.toLowerCase()) &&
        warehouse.address.toLowerCase().includes(searchAddress.toLowerCase())
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>Управление складами</Typography>
            <Button color="primary" onClick={handleOpenCreateDialog}>Добавить склад</Button>
            <Grid container spacing={2} alignItems="center" style={{ margin: '20px 0' }}>
                <Grid item xs={6}>
                    <TextField
                        label="Поиск по названию"
                        variant="outlined"
                        fullWidth
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Поиск по адресу"
                        variant="outlined"
                        fullWidth
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {filteredWarehouses.map(warehouse => (
                    <Grid item key={warehouse._id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="240"
                                image={warehouse.imageUrl || 'default_warehouse_image.jpg'}
                                alt={warehouse.name}
                            />
                            <CardContent>
                                <Typography variant="h5">{warehouse.name}</Typography>
                                <Typography variant="body2">{warehouse.address}</Typography>
                                <Button color="primary" onClick={() => handleOpenEditDialog(warehouse)}>Изменить</Button>
                                <Button color="secondary" onClick={() => dispatch(deleteWarehouse(warehouse._id))}>Удалить</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog for Creating a New warehouse */}
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                <DialogTitle>Добавить склад</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Нзавание"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={NewWarehouse.name}
                        onChange={(e) => handleChange(e, 'new')}
                    />
                    <TextField
                        margin="dense"
                        name="address"
                        label="Адрес"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={NewWarehouse.address}
                        onChange={(e) => handleChange(e, 'new')}
                    />
                    <TextField type="file"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog}>Отмена</Button>
                    <Button onClick={() => handleCreateOrupdateWarehouse(true)}>Создать</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog for Editing a warehouse */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Изменить склад</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Название"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currentWarehouse?.name}
                        onChange={(e) => handleChange(e, 'edit')}
                    />
                    <TextField
                        margin="dense"
                        name="address"
                        label="Адрес"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={currentWarehouse?.address}
                        onChange={(e) => handleChange(e, 'edit')}
                    />
                    <TextField
                        type="file"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Отмена</Button>
                    <Button onClick={() => handleCreateOrupdateWarehouse(false)}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default WarehousePage;