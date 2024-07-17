import { Router } from "express";
import prisma from '../db.js'

const router = Router();

router.get('/subjects', async (req, res) =>{
    try{
        const subjects = await prisma.subjects.findMany();
        res.send(subjects);
    }catch{
        res.status(404).send();
    }
})

router.get('/topics/:subject_id', async (req, res) =>{
    console.log(Number(req.param('subject_id')))
    try{
        const topics = await prisma.topics.findMany({
            where: {
                subject_id: Number(req.param('subject_id'))
            }
        });
        res.send(topics);
    }catch{
        res.status(404).send();
    }
})

router.post('/topics', async (req, res) =>{
    const newTopic = await prisma.topics.create({
        data: req.body
    });
    res.json(newTopic);
})

router.put('/topics', async (req, res) =>{
    const updateTopic = await prisma.topics.update({
        data: req.body,
        where:{
            topic_id: req.body.topic_id
        }
    });
    res.json(updateTopic);
})

export default router;