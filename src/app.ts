import express from "express";
import type { Request, Response } from "express";
import cors from "cors";



const app = express();

// global middleware
app.use(cors());
app.use(express.json()); // parses incoming JSON payload

// heath check (aws/docker uses this to know if ypu app is alive or not)

app.get('/health', (req : Request, res:Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Rush API is running',
    timestamp:new Date().toISOString()
  })
})

export default app;