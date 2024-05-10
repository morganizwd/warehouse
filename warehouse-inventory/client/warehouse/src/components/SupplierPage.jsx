import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSupplier, createSupplier, deleteSupplier, updateSupplier } from '../redux/slices/supplier';
import { Grid, Card, CardContent, Typography, CardMedia, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from '../redux/axios';

const SupplierPage = () => {
    const dispatch = useDispatch();
    const suppliers = useSelector(state => state.supplier.supplier);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [NewSupplier, setNewSupplier] = useState({ companyName: '', address: '', imageUrl: '', phoneNumber: '' });
    const [imageFile, setImageFile] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');
    const [searchPhoneNumber, setSearchPhoneNumber] = useState('');

    useEffect(() => {
        dispatch(fetchSupplier());
    }, [dispatch]);

    const handleOpenEditDialog = (Supplier) => {
        setCurrentSupplier(Supplier);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentSupplier(null);
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewSupplier({ companyName: '', address: '', imageUrl: '', phoneNumber: '' });
    };

    const handleChange = (e, SupplierType) => {
        const { name, value } = e.target; // Используйте `name`, а не `companyName`
        if (SupplierType === 'new') {
            setNewSupplier({ ...NewSupplier, [name]: value });
        } else {
            setCurrentSupplier({ ...currentSupplier, [name]: value });
        }
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const uploadImage = async (formData) => {
        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multiSupplier/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const handleCreateOrupdateSupplier = async (isCreate) => {
        let SupplierData = isCreate ? NewSupplier : currentSupplier;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            const uploadedImageData = await uploadImage(formData);
            if (uploadedImageData && uploadedImageData.url) {
                SupplierData = { ...SupplierData, imageUrl: `${window.location.protocol}//localhost:4444${uploadedImageData.url}` };
            }
        }

        if (isCreate) {
            dispatch(createSupplier(SupplierData));
            handleCloseCreateDialog();
        } else {
            dispatch(updateSupplier({ id: currentSupplier._id, updatedData: SupplierData }));
            handleCloseEditDialog();
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.companyName.toLowerCase().includes(searchName.toLowerCase()) &&
        supplier.address.toLowerCase().includes(searchAddress.toLowerCase()) &&
        supplier.phoneNumber.includes(searchPhoneNumber) // предполагается, что номер телефона - строка
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>Управление поставщиками</Typography>
            <Button color="primary" onClick={handleOpenCreateDialog}>Добавить поставщика</Button>
            <Grid container spacing={2} alignItems="center" style={{ marginTop: 20, marginBottom: 20 }}>
                <Grid item xs={4}>
                    <TextField
                        label="Поиск по названию компании"
                        variant="outlined"
                        fullWidth
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Поиск по адресу"
                        variant="outlined"
                        fullWidth
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Поиск по номеру телефона"
                        variant="outlined"
                        fullWidth
                        value={searchPhoneNumber}
                        onChange={(e) => setSearchPhoneNumber(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {filteredSuppliers.map(Supplier => (
                    <Grid item key={Supplier._id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="240"
                                image={Supplier.imageUrl || 'default_Supplier_image.jpg'}
                                alt={Supplier.companyName}
                            />
                            <CardContent>
                                <Typography variant="h5">{Supplier.companyName}</Typography>
                                <Typography variant="body2">{Supplier.address}</Typography>
                                <Typography variant="body2">{Supplier.phoneNumber}</Typography>
                                <Button color="primary" onClick={() => handleOpenEditDialog(Supplier)}>Изменить</Button>
                                <Button color="secondary" onClick={() => dispatch(deleteSupplier(Supplier._id))}>Удалить</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog for Creating a New Supplier */}
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                <DialogTitle>Добавить поставщика</DialogTitle>
                <DialogContent>
                    <TextField
                        name="companyName" // Убедитесь, что `name` правильно установлен
                        label="Название компании"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={NewSupplier.companyName}
                        onChange={(e) => handleChange(e, 'new')}
                    />

                    <TextField
                        name="address" // и так далее для каждого поля
                        label="Адрес"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={NewSupplier.address}
                        onChange={(e) => handleChange(e, 'new')}
                    />

                    <TextField
                        name="phoneNumber"
                        label="Номер телефона"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={NewSupplier.phoneNumber}
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
                    <Button onClick={() => handleCreateOrupdateSupplier(true)}>Создать</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Изменить данные о поставщике</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="companyName"
                        label="Название"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currentSupplier?.companyName}
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
                        value={currentSupplier?.address}
                        onChange={(e) => handleChange(e, 'edit')}
                    />
                    <TextField
                        margin="dense"
                        name="phoneNumber"
                        label="Номер телефона"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={currentSupplier?.phoneNumber}
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
                    <Button onClick={() => handleCreateOrupdateSupplier(false)}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SupplierPage;