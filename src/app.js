import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import productRoutes from './routes/productRouter.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Productos almacenados
let products = [];

// Usar el router de productos
app.use('/', productRoutes(io, products));

// Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  // Enviar la lista de productos cuando un cliente se conecta
  socket.emit('productList', products);

  // Recibir nuevos productos y emitir la actualización
  socket.on('newProduct', (product) => {
    products.push(product);
    io.emit('productList', products); // Emitir a todos los clientes
  });

  // Recibir eliminación de productos y emitir la actualización
  socket.on('deleteProduct', (productId) => {
    products = products.filter(product => product.id !== productId);
    io.emit('productList', products);
  });
});

// Iniciar el servidor
const PORT = 5050;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
