import { Router } from "express";

const router = Router();

router.get('/dummy', (req, res) =>{
    res.send('Hola')
})

export default router;