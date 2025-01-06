import { Router, Request, Response } from 'express';

const router:Router = Router();

//test route
router.get('/hello', (req: Request, res: Response) => {
    res.send('Hello from my Express Router!');
})

export default router;