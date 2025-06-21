import express from 'express';

import usuarioRuta from './routes/usuario.rout'

const app = express();
app.use(express.json()); //middleware que transforma la request en un objeto JSON 

const PORT = 3000 

app.get('/ping',(_req, res)=>{
    console.log('')
    res.send('pong')
})

app.use('/api/usuario', usuarioRuta)

app.listen(PORT, () =>{
console.log(`el servidor esta corriendo en el puerto ${PORT}  `+ new Date().toLocaleDateString())
})