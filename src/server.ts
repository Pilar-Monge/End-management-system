import express from 'express';
import userRoutes from './modules/user/user.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});