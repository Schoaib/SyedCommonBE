/* @flow */
import express, {Router} from 'express';

const router = Router();

router.get('/', (req, res, next) => {

  res.json('api server running');

});

export default router;
