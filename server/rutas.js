const express = require("express");
const router = express.Router();

const mensajes = [
    {
        _id : "1",
        nombre: "goku",
        precio : "500"
    },

];

router.get( "/" , (req, resp) =>{
    resp.json( mensajes );
});

router.post( "/" , (req, resp) =>{

    const mensaje = {
        nombre : req.body.nombre,
        precio : req.body.precio,
        foto: req.body.foto
    }

    mensajes.push( mensaje );

    console.log("Mis mensajes:" , mensajes);

    resp.json( {
        ok : true,
        mensaje
    } );
});

module.exports = router;