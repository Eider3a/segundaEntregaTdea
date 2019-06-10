const fs = require('fs');
const path = require('path');
var listadoCursos = [];
const pathCursos = path.join(__dirname, '../', 'data', 'cursos.json');



function obtenerTodosLosCursos(cb) {
    fs.readFile(pathCursos, (err, data) => {
        if (err) {
            console.error(err);
            listadoCursos = [];
            return cb(listadoCursos);
        }

        try {
            //Presenta Error cuando esta vacio.
            listadoCursos = JSON.parse(data);
        }
        catch (err) {
            console.log('------Error: El archivo esta vacio');
            listadoCursos = [];
        }

        return cb(listadoCursos);
    });
}

class Curso {
    constructor(id, nombre, modalidad, precio, descripcion, horas, estado) {
        this.id = id;
        this.nombre = nombre;
        this.modalidad = modalidad;
        this.precio = precio;
        this.descripcion = descripcion;
        this.horas = horas;
        this.estado = estado;

    }


    //Metodo para guardar en el archivo los cursos nuevos.
    save(cb) {
        obtenerTodosLosCursos(cursos => {
            //Verifico que no exista un curso con ese id.
            const existeCurso = cursos.find(curso => curso.id == this.id);
            if (existeCurso) {
                return cb(-1);
            }
            else {
                const nuevoCurso = {
                    id: this.id,
                    nombre: this.nombre,
                    modalidad: this.modalidad,
                    precio: this.precio,
                    descripcion: this.descripcion,
                    horas: this.horas,
                    estado: this.estado
                }
                console.log('--------cursos:', listadoCursos);

                cursos.push(nuevoCurso);
                fs.writeFile(pathCursos, JSON.stringify(cursos), err => {
                    if (!err) {
                        return cb(1);
                    }

                    else {
                        console.log(err, "Error al realizar la inscripcion del curso");
                        return cb(2);
                    }
                });


            }

        });

    }

    //Obtiene todos los cursos que esten en estado disponible
    static obtenerCursosDisponibles(cb) {
        obtenerTodosLosCursos(cursos => {
            const cursosDisponibles = cursos.filter(curso => curso.estado === 'disponible');
            return cb(cursosDisponibles);
        });
    };

    //Obtiene todos los cursos.
    static obtenerCursos(cb) {
        obtenerTodosLosCursos(cb);
    };

    //Cierra o abre el esatdo de un curso
    static abrirOCerrarCurso(estado, cursoId, cb) {
        obtenerTodosLosCursos(cursos => {
            console.log('----------', estado, cursoId);

            var curso = cursos.find(curso => curso.id === cursoId);
            curso.estado = estado;
            const updateCursos = cursos.filter(curso => curso.id !== cursoId);
            updateCursos.push(curso);
            fs.writeFile(pathCursos, JSON.stringify(updateCursos), err => {
                if (!err) {
                    return cb(1);
                }

                else {
                    console.log(err, "Error al cambiar el estado del curso");
                    return cb(2);
                }
            });

        });
    };



    //Obtiene los detalles de un curso.
    static obtenerDetallesCurso(cursoId, cb) {
        obtenerTodosLosCursos(cursos => {
            const curso = cursos.filter(curso => curso.id === cursoId);
            return cb(curso);
        });
    };

}

module.exports = Curso;