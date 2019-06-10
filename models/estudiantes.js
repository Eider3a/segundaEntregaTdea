const fs = require('fs');
const path = require('path');
var listadoEstudiantes = [];
var cursos = [];
const pathEstudiantes = path.join(__dirname, '../', 'data', 'estudiantes.json');



function obtenerTodosLosEstudiantes(cb) {
    fs.readFile(pathEstudiantes, (err, data) => {
        if (err) {
            console.error(err);
            listadoEstudiantes = [];
            return cb(listadoEstudiantes);
        }

        try {
            //Presenta Error cuando esta vacio.
            listadoEstudiantes = JSON.parse(data);
        }
        catch (err) {
            console.log('------Error: El archivo esta vacio');
            listadoEstudiantes = [];
        }

        return cb(listadoEstudiantes);
    });
}

class Estudiante {
    //Variable para almacenar los cursos del estudiante.

    constructor(cedula, nombre, email, telefono, curso) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.curso = curso;


    }


    //Metodo para registar un estudiante.
    registrar(cb) {
        obtenerTodosLosEstudiantes(estudiantes => {
            //Verifico que no exista un curso con ese id.
            const existeEstudiante = estudiantes.find(est => est.cedula === this.cedula);
            if (existeEstudiante) {//Si existe el estudiante debo verificar que no este matriculado en el curso.

                cursos = existeEstudiante.cursos;//Esto es un arreglo.
                const cursoMatriculado = cursos.find(curso => curso === this.curso);
                if (cursoMatriculado) {//Ya esta matriculado en ese curso.
                    return cb(-1);
                }
                else {
                    cursos.push(this.curso);//Añado el nuevo curso en el arreglo.
                    //ecisteEstudiante a punta a la direccion de memoria.
                    existeEstudiante.cursos = cursos;//Actualizo el estudiante.
                    var anterioresEstudiantes = estudiantes.filter(est => est.cedula != this.cedula);
                    anterioresEstudiantes.push(existeEstudiante);
                    fs.writeFile(pathEstudiantes, JSON.stringify(anterioresEstudiantes), err => {
                        if (!err) {
                            return cb(1);
                        }

                        else {
                            console.log(err, "Error al realizar la inscripcion al curso");
                            return cb(2);
                        }
                    });
                }

                //return cb(1);
            }
            else {
                const nuevoEstudiante = {
                    cedula: this.cedula,
                    nombre: this.nombre,
                    email: this.email,
                    telefono: this.telefono,
                    cursos: [this.curso]

                }
                //console.log('--------cursos:', listadoCursos);

                estudiantes.push(nuevoEstudiante);
                fs.writeFile(pathEstudiantes, JSON.stringify(estudiantes), err => {
                    if (!err) {
                        return cb(1);
                    }

                    else {
                        console.log(err, "Error al realizar la inscripcion al curso");
                        return cb(2);
                    }
                });


            }

        });

    }

    //Obtiene todos los cursos que esten en estado disponible
    static obtenerEstudiantes(cb) {
        obtenerTodosLosEstudiantes(cb);
    };

    //Obtiene todos los cursos que esten en estado disponible
    static obtenerEstudiantesXcurso(idCurso, cb) {
        obtenerTodosLosEstudiantes(estudiantes => {
            var estudiantesinscritos = estudiantes.filter(estudiante => {
                for (let i = 0; i < estudiante.cursos.length; i++) {
                    if (estudiante.cursos[i] == idCurso) {
                        return true;
                    }

                }
                return false;
            });
            cb(estudiantesinscritos);
        });

    };

    // static obtenerDetallesCurso(cursoId, cb) {
    //     obtenerTodosLosCursos(cursos => {
    //         const curso = cursos.filter(curso => curso.id === cursoId);
    //         return cb(curso);
    //     });
    // };

}

module.exports = Estudiante;