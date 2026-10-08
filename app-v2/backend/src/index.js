import { crearApp } from './app.js';
import { config } from './config.js';

const app = crearApp();

app.listen(config.PORT, () => {
  console.log(`leo-perfecto-api escuchando en http://localhost:${config.PORT}`);
});
