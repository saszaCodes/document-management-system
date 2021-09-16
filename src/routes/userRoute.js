import express from 'express';
import { dmsService } from '../services';

const userRouter = express.Router();

userRouter.get('/users', dmsService.fetchAllUsers);

export default userRouter;
