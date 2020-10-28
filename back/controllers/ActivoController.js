var Activo = require('../models/activo');
var fs = require('fs');
var path = require('path');


function registrar(req, res) {

    var data = req.body;

    if (req.files) {
        var imagen_path = req.files.imagen.path;
        var name = imagen_path.split('\\');
        var imagen_name = name[2];
 
        var activo = new Activo();
        activo.titulo = data.titulo;
        activo.descripcion = data.descripcion;
        activo.imagen = imagen_name;
        activo.precio_compra = data.precio_compra;
        // activo.precio_venta = data.precio_venta;
        activo.stock = data.stock;
        activo.pertenece = data.pertenece;
        activo.idcategoria = data.idcategoria;
        activo.modelo = data.modelo;
        activo.marca = data.marca;
        activo.nroSerie = data.nroSerie;
        activo.codigoDBC = data.codigoDBC;
        activo.fechaCompra= data.fechaCompra;
 
        activo.save((err, activo_save) => { 
            if (err) {
                res.status(500).send({ message: 'Error en el servidor' });
            } else {
                if (activo_save) {
                    res.status(200).send({ produto: activo_save });
                } else {
                    res.status(403).send({ message: 'No se registro el activo' });
                }
            }
        });
    } else {
        var activo = new Activo();
        activo.titulo = data.titulo;
        activo.descripcion = data.descripcion;
        activo.imagen = null;
        activo.precio_compra = data.precio_compra;
        //activo.precio_venta = data.precio_venta;
        activo.stock = data.stock;
        activo.pertenece = data.pertenece;
        activo.idcategoria = data.idcategoria;
        activo.modelo = data.modelo;
        activo.marca = data.marca;
        activo.nroSerie = data.nroSerie;
        activo.codigoDBC = data.codigoDBC;
        activo.fechaCompra= data.fechaCompra;

        activo.save((err, activo_save) => {
            if (err) {
                res.status(500).send({ message: 'Error en el servidor' });
            } else {
                if (activo_save) {
                    res.status(200).send({ produto: activo_save });
                } else {
                    res.status(403).send({ message: 'No se registro el activo' });
                }
            }
        });
    }

}

function listar(req, res) {
    var titulo = req.params['titulo'];

    Activo.find({ titulo: new RegExp(titulo, 'i') }).populate('idcategoria').exec((err, activos_listado) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (activos_listado) {
                res.status(200).send({ activos: activos_listado });
            } else {
                res.status(403).send({ message: 'No hay ningun registro con ese titulo' });
            }
        }
    });
}

function editar(req, res) {
    var data = req.body;
    var id = req.params['id'];
    var img = req.params['img'];

    if (req.files.imagen) {

        if (img || img != null || img != undefined) {
            fs.unlink('./uploads/activos/' + img, (err) => {
                if (err) throw err;
            });
        }

        var imagen_path = req.files.imagen.path;
        var name = imagen_path.split('\\');
        var imagen_name = name[2];

        Activo.findByIdAndUpdate({ _id: id }, {
            titulo: data.titulo,
            descripcion: data.descripcion,
            imagen: imagen_name,
            precio_compra: data.precio_compra,
            puntos: data.puntos,
            idcategoria: data.idcategoria,
            modelo: data.modelo,
            marca: data.marca,
            nroSerie: data.nroSerie,
            codigoDBC: data.codigoDBC,
            fechaCompra: data.fechaCompra

        }, (err, activo_edit) => {
            if (err) {
                res.status(500).send({ message: 'Error en el servidor' });
            } else {
                if (activo_edit) {
                    res.status(200).send({ activo: activo_edit });
                } else {
                    res.status(403).send({ message: 'No se edito el activo' });
                }
            }
        });
    } else {
        Activo.findByIdAndUpdate({ _id: id }, {
            titulo: data.titulo,
            descripcion: data.descripcion,
            precio_compra: data.precio_compra,
            pertenece: data.pertenece,
            idcategoria: data.idcategoria,
            modelo: data.modelo,
            marca: data.marca,
            nroSerie: data.nroSerie,
            codigoDBC: data.codigoDBC,
            fechaCompra: data.fechaCompra
        }, (err, activo_edit) => {
            if (err) {
                res.status(500).send({ message: 'Error en el servidor' });
            } else {
                if (activo_edit) {
                    res.status(200).send({ activo: activo_edit });
                } else {
                    res.status(403).send({ message: 'No se edito el activo' });
                }
            }
        });
    }



}

function obtener_activo(req, res) {
    var id = req.params['id'];

    Activo.findOne({ _id: id }, (err, activo_data) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (activo_data) {



                res.status(200).send({ activo: activo_data });
            } else {
                res.status(403).send({ message: 'No existe el registro' });
            }
        }
    });
}

function eliminar(req, res) {
    var id = req.params['id'];

    Activo.findOneAndRemove({ _id: id }, (err, activo_delete) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (activo_delete) {
                fs.unlink('./uploads/activos/' + activo_delete.imagen, (err) => {
                    if (err) throw err;
                });
                res.status(200).send({ produto: activo_delete });
            } else {
                res.status(403).send({ message: 'No se elimino ningun registro' });
            }
        }
    })
}

function update_stock(req, res) {
    let id = req.params['id'];
    let data = req.body;

    Activo.findById(id, (err, activo_data) => {
        if (activo_data) {
            Activo.findByIdAndUpdate(id, { stock: parseInt(activo_data.stock) + parseInt(data.stock) }, (err, activo_edit) => {
                if (activo_edit) {
                    res.status(200).send({ activo: activo_edit });
                }
            })
        } else {
            res.status(500).send(err);
        }
    })
}

function get_img(req, res) {
    var img = req.params['img'];

    if (img != "null") {
        let path_img = './uploads/activos/' + img;
        res.status(200).sendFile(path.resolve(path_img));
    } else {
        let path_img = './uploads/activos/default.jpg';
        res.status(200).sendFile(path.resolve(path_img));
    }
}


module.exports = {
    registrar,
    listar,
    editar,
    obtener_activo,
    eliminar,
    update_stock,
    get_img

}