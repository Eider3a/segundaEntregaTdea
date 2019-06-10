const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const port = 3000;
const Curso = require('./models/cursos.js');
const Estudiante = require('./models/estudiantes.js');
const hbs = require('hbs');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//Configurando Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Home
app.get('/', (req, res) => {
    res.render('index.hbs');
});


//Creando un helper con hbs para comparar 2 cadenas.
hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('estxcurso', function (v1) {
    Estudiante.obtenerEstudiantesXcurso(v1, estudiantes => {
        var result = "<ul>";
        for (let i = 0; i < estudiantes.length; i++) {
            result = result + `<li>${estudiantes[i].nombre}</li>`;

        }
        result = result + "<ul><br>";
        return result;
    })
})



///-----Coordinador.
//Crear curso(get)
app.get('/crearcurso', (req, res) => {
    res.render('./coordinador/crear-curso.hbs');
});
//Crear curso(post)
app.post('/crearcurso', function (req, res) {
    var { id, nombre, modalidad, precio, descripcion, horas } = req.body;
    var estadoCurso = 'disponible';//(disponible o cerrado) por defecto se deja en estado disponible
    var curso = new Curso(id, nombre, modalidad, precio, descripcion, horas, estadoCurso);
    curso.save((result) => {
        var mensaje;
        if (result === -1) {
            mensaje = "No se pudo registar el curso ya que existe un curso con ese ID";
        } else if (result === 1) {
            mensaje = "Curso registrado satisfactoriamente, visita la pestaña mis cursos";
        }
        else {
            mensaje = "No se pudo registrar el curso.";

        }
        res.render('index.hbs', { mensaje: mensaje });
    });


    //res.send(`Name name, desc description`);
});

//Cargar una lista de cursos en donde les puedo cambiar el estado y puedo eliminar a los que estas
//inscriptos en el.
app.get('/vercursoscoordinador', (req, res) => {
    Curso.obtenerCursos(cursos => {
        //El metodo render ya busca dentro de la carpeta vistas.
        res.render('./coordinador/listar-cursos.hbs', { cursos: cursos });

    });
});

//OPermite abrir o cerrar un curso.
app.post('/cambiarestadocurso', (req, res) => {
    //Cualquiera de los 2 puede trae el valor de id.
    const abrircurso = req.body.abrircurso;//abrircurso es el id.
    const cerrarcurso = req.body.cerrarcurso;
    console.log(abrircurso, cerrarcurso);
    if (abrircurso) {//Si no esta undefined.
        Curso.abrirOCerrarCurso('disponible', abrircurso, result => {
            var mensaje;
            if (result === 1) {
                mensaje = "Se cambio de estado correctamente";
            }
            else {
                mensaje = "No se pudo cambiar el estado del curso.";

            }
            res.render('index.hbs', { mensaje: mensaje });
        })
    }
    else {
        Curso.abrirOCerrarCurso('cerrado', cerrarcurso, result => {
            var mensaje;
            if (result === 1) {
                mensaje = "Se cambio de estado correctamente";
            }
            else {
                mensaje = "No se pudo cambiar el estado del curso.";

            }
            res.render('index.hbs', { mensaje: mensaje });
        })
    }

});

app.get('/listarinscriptoscoordinador', (req, res) => {
    Curso.obtenerCursosDisponibles(cursos => {
        //El metodo render ya busca dentro de la carpeta vistas.
        Estudiante.obtenerEstudiantes(estudiantes => {
            console.log('------', cursos, '********', estudiantes);

            res.render('./coordinador/listar-cursos.hbs', { cursos: cursos, estudiantes: estudiantes });

        });

    });
});




//--------Interesado.
//Carga el hbs para ver los cursos.
app.get('/vercursosinteresado', (req, res) => {
    Curso.obtenerCursosDisponibles(cursos => {
        //El metodo render ya busca dentro de la carpeta vistas.
        res.render('./interesado/listar-cursos.hbs', { cursos: cursos });

    });
});

//Obtiene el id del curso para el cual el interesado desea ver la informacion.
app.post('/vercursosinteresado', (req, res) => {
    const cursoId = req.body.cursoId;
    Curso.obtenerCursosDisponibles(cursos => {
        //req.body son los campos que vienen del formulario.
        console.log('------cursoId', cursoId);
        console.log('------cursos:', cursos);
        const curso = cursos.find(curso => curso.id === cursoId);
        console.log('------curso:', curso);

        res.render('./interesado/detalles-curso.hbs', { curso: curso });

    });
});

//-----aspirante.
app.get('/inscribiraspirante', (req, res) => {
    Curso.obtenerCursosDisponibles(cursos => {
        //El metodo render ya busca dentro de la carpeta vistas.
        res.render('./aspirante/inscribirme.hbs', { cursos: cursos });

    });
});

//Obtiene la informacion del aspirante que se va a inscribir.
app.post('/inscribiraspirante', (req, res) => {
    var { cedula, nombre, email, cursoseleccionado, telefono } = req.body;
    var estudiante = new Estudiante(cedula, nombre, email, telefono, cursoseleccionado);
    estudiante.registrar((result) => {
        var mensaje;
        if (result === -1) {
            mensaje = "Error, ya estas registrado en este curso";
        } else if (result === 1) {
            mensaje = "Te inscribiste satisfactoriamente";
        }
        else {
            mensaje = "No se pudo inscribir el curso.";

        }
        res.render('index.hbs', { mensaje: mensaje });
    });

});

app.get('*', (req, res) => {
    res.render('index.hbs', { mensaje: 'Error 404, pagina no encontrada' });
});





app.listen(port);










