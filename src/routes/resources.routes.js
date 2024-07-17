import multer from 'multer';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, unlinkSync } from 'fs';

import { Router } from "express";
import prisma from '../db.js'

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.delete('/resources/:resource_id', async (req, res) =>{
    const resource_id = Number(req.params.resource_id)
    try{
        const topics = await prisma.resources.delete({
            where: {
                resource_id: resource_id
            }
        });
        res.send(topics);
    }catch{
        res.status(404).send();
    }
})

router.get('/resources/:subject_id', async (req, res) =>{
    console.log(Number(req.params.subject_id))
    try{
        const topics = await prisma.resources.findMany({
            where: {
                subject_id: Number(req.params.subject_id)
            }
        });
        res.send(topics);
    }catch{
        res.status(404).send();
    }
})

router.post('/resources/:subject_id', upload.single('file'), async (req, res) => {
    const subjectId = Number(req.params.subject_id);
    const type = Number(req.body.type);
    if (req.body.type == 0){
        const newResource = await prisma.resources.create({
            data: {
                subject_id: subjectId,
                name: req.body.name,
                type: type,
                url: req.body.url
            }
        });
       return res.send(newResource);
    }

    
    const file = req.file;
  
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
  
    try {
      // Leer el archivo subido
      const fileContents = readFileSync(file.path);
  
      // Configurar los headers
      const myHeaders = {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.mimetype,
      };
  
      // Configurar las opciones de la solicitud
      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: fileContents,
        redirect: 'follow',
      };
  
      // URL del blob con el token SAS
      const container = 'https://storage2437c14.blob.core.windows.net/fime'
      const sas_token = 'sp=racwdli&st=2024-07-17T22:48:35Z&se=2024-12-07T06:48:35Z&sv=2022-11-02&sr=c&sig=ktZYlFsmuIxegWgl3guGiwGm2gmr0eJIcMzaOuTzylQ%3D';
      const blobName = `${subjectId}_${file.originalname}`;
      const url = `${container}/${blobName}?${sas_token}`;
  
      // Realizar la solicitud
      const response = await fetch(url, requestOptions);
      const result = await response.text();
  
      // Eliminar el archivo temporal
      unlinkSync(file.path);
  
      if (response.ok) {
        const urlFile = `${container}/${blobName}`
        const newResource = await prisma.resources.create({
            data: {
                subject_id: subjectId,
                name: req.body.name,
                type: type,
                url: urlFile
            }
        });
        res.send(newResource);
      } else {
        res.status(404).send({ message: 'Failed to upload file.', result });
      }
    } catch (error) {
      res.status(404).send({ message: 'An error occurred.', error: error.message });
    }
  });

router.put('/resources/:resource_id', upload.single('file'), async (req, res) => {
const resourceId = Number(req.params.resource_id);
const type = Number(req.body.type);
if (req.body.type == 0){
    const newResource = await prisma.resources.update({
        data: {
            name: req.body.name,
            type: type,
            url: req.body.url
        },
        where:{
            resource_id: resourceId
        }
    });
    return res.send(newResource);
}


const file = req.file;

if (!file) {
    return res.status(400).send('No file uploaded.');
}

try {
    // Leer el archivo subido
    const fileContents = readFileSync(file.path);

    // Configurar los headers
    const myHeaders = {
    'x-ms-blob-type': 'BlockBlob',
    'Content-Type': file.mimetype,
    };

    // Configurar las opciones de la solicitud
    const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: fileContents,
    redirect: 'follow',
    };

    // URL del blob con el token SAS
    const container = 'https://storage2437c14.blob.core.windows.net/fime'
    const sas_token = 'sp=racwdli&st=2024-07-17T22:48:35Z&se=2024-12-07T06:48:35Z&sv=2022-11-02&sr=c&sig=ktZYlFsmuIxegWgl3guGiwGm2gmr0eJIcMzaOuTzylQ%3D';
    const blobName = `${file.originalname}`;
    const url = `${container}/${blobName}?${sas_token}`;

    // Realizar la solicitud
    const response = await fetch(url, requestOptions);
    const result = await response.text();

    // Eliminar el archivo temporal
    unlinkSync(file.path);

    if (response.ok) {
    const urlFile = `${container}/${blobName}`
    const newResource = await prisma.resources.update({
        data: {
            name: req.body.name,
            type: type,
            url: urlFile
        },
        where:{
            resource_id: resourceId
        }
    });
    res.send(newResource);
    } else {
    res.status(404).send({ message: 'Failed to upload file.', result });
    }
} catch (error) {
    res.status(404).send({ message: 'An error occurred.', error: error.message });
}
});


export default router;