// Ecommerce.jsx
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Button, Switch } from "@mui/material";
import { Card, CardMedia, CardContent } from "@mui/material";
import { AppBar, Toolbar } from "@mui/material";

import { useMaterialUIController } from "context";
import { setDarkMode } from "context";

const Ecommerce = () => {
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Books",
    "Toys & Games",
  ];
  
  const featuredProducts = [
    { id: 1, name: "Product 1", image: "src/assets/images/home-decor-1.jpg" },
    { id: 2, name: "Product 2", image: "src/assets/images/home-decor-2.jpg" },
    { id: 3, name: "Product 3", image: "src/assets/images/home-decor-4.jpeg" },
  ];

  return (
    <Box>
      <Navbar />
      <Box display="flex" flexDirection="column" padding={4}>
        <Typography variant="h1" color="text.primary">
          Welcome to Our Ecommerce Site
        </Typography>
        <Typography variant="h3" color="text.secondary">
          Shop till you drop
        </Typography>
        <Categories categories={categories} />
        <FeaturedProducts products={featuredProducts} />
      </Box>
    </Box>
  );
};

export default Ecommerce;

// Navbar.jsx
export const Navbar = () => {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;
  const handleDarkMode = () => setDarkMode(dispatch, !darkMode);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h4" color="inherit" sx={{ flexGrow: 1 }}>
          Ecommerce Site
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ ml: 2 }}
        >
          <Typography variant="body2" color="inherit" sx={{ flexGrow: 1 }}>
            Dark Mode
          </Typography>
          <Switch checked={darkMode} onChange={handleDarkMode} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Categories.jsx
export const Categories = ({ categories }) => (
  <Box mt={4}>
    <Typography variant="h4" color="secondary" mb={2}>
      Shop by Category
    </Typography>
    <Grid container spacing={2}>
      {categories.map((category, index) => (
        <Grid item key={index}>
          <Button variant="outlined" color="primary">
            {category}
          </Button>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// FeaturedProducts.jsx
export const FeaturedProducts = ({ products }) => (
  <Box mt={4}>
    <Typography variant="h4" color="secondary">
      Featured Products
    </Typography>
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={product.image}
              alt={product.name}
            />
            <CardContent sx={{ mt: 1 }}>
              <Typography variant="h5">{product.name}</Typography>
              <Typography variant="body3" component="p">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Nesciunt, eos. Placeat, perspiciatis non! Est saepe eos
                praesentium placeat maiores, quis culpa obcaecati veritatis
                reiciendis minus? Aliquam, magni! Quasi, autem dolores!
              </Typography>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                sx={{ borderRadius: "4px" }}
              >
                View Product
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);
