import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8090'],
  credentials: true,
};

export { corsOptions };