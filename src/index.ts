import express, { Request, Response } from 'express';

const app = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from hpc_drive!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

