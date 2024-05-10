import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStorageLocation, createStorageLocation, updateStorageLocation, deleteStorageLocation } from '../redux/slices/storageLocation';
import { fetchWarehouse } from '../redux/slices/warehouse';
import { Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function StorageWarehouseManager() {
  const dispatch = useDispatch();
  const { storageLocation } = useSelector((state) => state.storageLocation);
  const { warehouse } = useSelector((state) => state.warehouse);
  const [open, setOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [formData, setFormData] = useState({
    shelfNumber: '',
    warehouseId: '',
  });
  const [warehouseSearch, setWarehouseSearch] = useState(''); 

  useEffect(() => {
    dispatch(fetchStorageLocation());
    dispatch(fetchWarehouse());
  }, [dispatch]);

  const handleOpen = (mode, data = null) => {
    setFormMode(mode);
    if (mode === 'edit' && data) {
      setFormData({ ...data });
    } else {
      setFormData({
        shelfNumber: '',
        warehouseId: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setWarehouseSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formMode === 'create') {
      await dispatch(createStorageLocation({
        ...formData,
        warehouse: formData.warehouseId,
      }));
    } else {
      await dispatch(updateStorageLocation({
        id: formData._id,
        updatedData: {
          ...formData,
          warehouse: formData.warehouseId,
        },
      }));
    }
    handleClose();
    dispatch(fetchStorageLocation());
  };

  const handleDelete = async (id) => {
    await dispatch(deleteStorageLocation(id));
    dispatch(fetchStorageLocation());
  };

  // Filter warehouses based on the search term
  const filteredWarehouses = warehouse.filter((wh) => wh.name.toLowerCase().includes(warehouseSearch.toLowerCase()));

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleOpen('create')}>Add New</Button>
      <TextField
        margin="normal"
        variant="outlined"
        label="Search Warehouse by Name"
        fullWidth
        onChange={handleSearchChange}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер стелажа</TableCell>
              <TableCell>Склад</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storageLocation.map((location) => (
              <TableRow key={location._id}>
                <TableCell>{location.shelfNumber}</TableCell>
                <TableCell>{filteredWarehouses.find(w => w._id === location.warehouse)?.name || 'Not Found'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen('edit', location)}>Изменить</Button>
                  <Button onClick={() => handleDelete(location._id)}>Удалить</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formMode === 'create' ? 'Create New' : 'Edit'} Место хранения</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="shelfNumber"
            label="Номер стелажа"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.shelfNumber}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="warehouse-select-label">Склад</InputLabel>
            <Select
              labelId="warehouse-select-label"
              id="warehouse-select"
              name="warehouseId"
              value={formData.warehouseId}
              label="Warehouse"
              onChange={handleChange}
            >
              {filteredWarehouses.map((wh) => (
                <MenuItem key={wh._id} value={wh._id}>{`${wh.name} - ${wh.address}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSubmit}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StorageWarehouseManager;
