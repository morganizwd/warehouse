import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import SuppliersIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ProductIcon from '@mui/icons-material/LocalMall';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Информация о разделах для динамического создания карточек
const sections = [
  { title: 'Управление категориями', icon: <CategoryIcon />, link: '/categories' },
  { title: 'Управление складами', icon: <WarehouseIcon />, link: '/warehouses' },
  { title: 'Управление поставщиками', icon: <SuppliersIcon />, link: '/suppliers' },
  { title: 'Управление местами хранения', icon: <LocationOnIcon />, link: '/storage-location' },
  { title: 'Управление товарами', icon: <ProductIcon />, link: '/products' },
  { title: 'Управление проверками', icon: <CheckCircleIcon />, link: '/checks' },
];

const HubPage = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom style={{ margin: '20px 0' }}>
        ХАБ ЦДО
      </Typography>
      <Grid container spacing={4}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.title}>
            <Card>
              <CardActionArea component={Link} to={section.link}>
                <CardMedia>
                  {section.icon}
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {section.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HubPage;
