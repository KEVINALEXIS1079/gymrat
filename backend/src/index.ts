import express from 'express';

// Importar las rutas de los controladores
import usuarioRuta from './routes/usuario.rout'
import ejercicioRuta from './routes/ejercicio.rout'
import rutinaRuta from './routes/rutina.rout'
import rutinaEjercicioRuta from './routes/rutina_ejercicio.rout'
import progresoRuta from './routes/progreso.rout'

const app = express();
app.use(express.json());
 //middleware que transforma la request en un objeto JSON 
const PORT = 3000 

app.get('/ping',(_req, res)=>{
    console.log('')
    res.send('pong')
})

app.use('/api/usuario', usuarioRuta)
app.use('/api/ejercicio', ejercicioRuta)
app.use('/api/rutina', rutinaRuta)
app.use('/api/rutinaEjercicio', rutinaEjercicioRuta)
app.use('/api/progreso', progresoRuta)

app.listen(PORT, () =>{
console.log(`el servidor esta corriendo en el puerto ${PORT}  `+ new Date().toLocaleDateString())
})


// creando las validaaciones de los controldadores para hacer verificacio de los datos antes hacer cualquier movimiento
// pendietes todos los controladores  por el momentos ya que no he configurado el helper con otras configuraciones