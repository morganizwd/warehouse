import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChecks, createCheck, updateCheck, deleteCheck } from '../redux/slices/check';
import { fetchProducts } from '../redux/slices/products';
import { fetchReviewsById, createReview, deleteReview } from '../redux/slices/reviews';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ChecksPage = () => {
  const dispatch = useDispatch();
  const { checks } = useSelector(state => state.checks);
  const { products } = useSelector(state => state.products);
  const { review, currentReview } = useSelector(state => state.review);
  const [openCheckDialog, setOpenCheckDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCheckId, setCurrentCheckId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    dispatch(fetchChecks());
    dispatch(fetchProducts());
    checks.forEach(check => {
      dispatch(fetchReviewsById(check._id));
    });
  }, [dispatch, checks.length]);

  const handleOpenCheckDialog = (checkId = null) => {
    setOpenCheckDialog(true);
    if (checkId) {
      setEditMode(true);
      setCurrentCheckId(checkId);
      const check = checks.find(check => check._id === checkId);
      if (check) {
        setSelectedProducts(check.products);
      }
    } else {
      setEditMode(false);
      setSelectedProducts([]);
    }
  };

  const handleCloseCheckDialog = () => setOpenCheckDialog(false);

  const handleAddOrUpdateCheck = () => {
    const checkData = { products: selectedProducts.map(product => product._id) };
    if (editMode) {
      dispatch(updateCheck({ id: currentCheckId, updatedData: checkData }));
    } else {
      dispatch(createCheck(checkData));
    }
    handleCloseCheckDialog();
  };

  const handleDeleteCheck = (checkId) => {
    dispatch(deleteCheck(checkId));
  };

  const handleProductChange = (event) => {
    const selectedProductIds = event.target.value;
    const selectedProducts = products.filter(product => selectedProductIds.includes(product._id));
    setSelectedProducts(selectedProducts);
  };

  const handleOpenReviewDialog = (checkId) => {
    setCurrentCheckId(checkId);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewText("");
  };

  const handleAddReview = () => {
    const reviewData = { check: currentCheckId, text: reviewText };
    dispatch(createReview(reviewData));
    handleCloseReviewDialog();
  };

  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

  const filteredChecks = checks.filter(check => {
    const checkDate = new Date(check.createdAt).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;
    return (!start || checkDate >= start) && (!end || checkDate <= end);
  });

  return (
    <div>
      <Typography variant="h4" gutterBottom>Управление проверками</Typography>
      <Button variant="contained" onClick={() => handleOpenCheckDialog()}>Добавить новый чек</Button>

      <TextField
        label="Дата начала"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Дата конца"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      
      {filteredChecks.map((check) => (
        <div key={check._id}>
          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Typography variant="h6" style={{ margin: 20 }}>Check ID: {check._id}</Typography>
            <Typography variant="h6" style={{ margin: 20 }}>Дата начала проверки: {check.createdAt}</Typography>
            <Typography variant="h6" style={{ margin: 20 }}>Дата последних изменений проверки: {check.updatedAt}</Typography>
            <Button onClick={() => handleOpenCheckDialog(check._id)}>Изменить</Button>
            <Button onClick={() => handleDeleteCheck(check._id)}>Удалить</Button>
            <Button onClick={() => handleOpenReviewDialog(check._id)}>Добавить отзыв</Button>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Название товара</TableCell>
                  <TableCell align="right">Количество</TableCell>
                  <TableCell align="right">Цена</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {check.products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell align="right">{product.amount}</TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {currentReview && currentReview.map((rev) => (
              rev.check === check._id && (
                <div key={rev._id}>
                  <Typography variant="body2">{rev.text}</Typography>
                  <Button onClick={() => handleDeleteReview(rev._id)}>Delete Review</Button>
                </div>
              )
            ))}
          </TableContainer>
        </div>
      ))}
      <Dialog open={openCheckDialog} onClose={handleCloseCheckDialog}>
        <DialogTitle>{editMode ? 'Edit Check' : 'Add a New Check'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="select-products-label">Select Products</InputLabel>
            <Select
              labelId="select-products-label"
              id="select-products"
              multiple
              value={selectedProducts.map(product => product._id)}
              onChange={handleProductChange}
              renderValue={(selected) => selected.map(productId => products.find(product => product._id === productId)?.name || productId).join(', ')}
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckDialog}>Cancel</Button>
          <Button onClick={handleAddOrUpdateCheck}>{editMode ? 'Update Check' : 'Add Check'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
        <DialogTitle>Add a Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="reviewText"
            label="Review Text"
            type="text"
            fullWidth
            variant="outlined"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button onClick={handleAddReview}>Add Review</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChecksPage;
