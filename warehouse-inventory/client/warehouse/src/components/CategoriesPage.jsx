import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, createCategory, deleteCategory } from '../redux/slices/categories';
import {
  Container,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories.categories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [searchName, setSearchName] = useState(''); // Состояние для поиска по названию
  const [searchDescription, setSearchDescription] = useState(''); // Состояние для поиска по описанию

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== '') {
      dispatch(createCategory({ name: newCategoryName, description: newCategoryDescription }));
      setNewCategoryName('');
      setNewCategoryDescription('');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteCategory(categoryId));
  };

  // Фильтрация категорий по названию и описанию
  const filteredCategories = categories.filter(category => {
    return category.name.toLowerCase().includes(searchName.toLowerCase()) &&
      category.description.toLowerCase().includes(searchDescription.toLowerCase());
  });

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Управление категориями</Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            label="Поиск по названию"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Поиск по описанию"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" style={{ margin: '20px 0' }}>
        <Grid item>
          <TextField
            label="Название новой категории"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Описание новой категории"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
          >
            Добавить категорию
          </Button>
        </Grid>
      </Grid>

      <List>
        {filteredCategories.map((category) => (
          <ListItem key={category._id}>
            <ListItemText
              primary={category.name}
              secondary={category.description}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteCategory(category._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CategoriesPage;
