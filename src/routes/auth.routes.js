import { Router } from "express";

const router = Router();

router.post('/login', async (req, res) =>{
    const {type, username, password} = req.body;

    const myHeaders = new Headers();
    myHeaders.append("Host", "deimos.dgi.uanl.mx");
    myHeaders.append("Origin", "https://deimos.dgi.uanl.mx");
    myHeaders.append("Referer", "https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/login.htm");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("HTMLTipCve", type);
    urlencoded.append("HTMLUsuCve", username);
    urlencoded.append("HTMLPassword", password);

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
    };

    const success = await fetch("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/eselcarrera.htm", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        if (result.includes("Acceso Negado")) return false;
        if (result.includes("Usuario capturado no existe")) return false;
        //if (result.includes(username)) res.send("Inicio de sesión exitoso");
        return true;
    })
    .catch((error) => false);

    if (success){
        return res.send("Inicio de sesión exitoso");
    }else{
        return res.status(404).send("Acceso Negado, verifica los datos de acceso.");
    }
})

export default router;