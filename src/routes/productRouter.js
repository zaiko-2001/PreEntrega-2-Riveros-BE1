import { Router } from 'express';
const router = Router();

export default (io, products) => {
  // Ruta para la vista principal de productos
  router.get('/', (req, res) => {
    res.render('home', { products });
  });

  // Ruta para la vista de productos en tiempo real
  router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
  });

  return router;
};
