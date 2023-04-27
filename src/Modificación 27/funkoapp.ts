// Imports
import express from 'express';
import { MongoClient } from 'mongodb';
import { FunkoPop } from './funkotypes.js';

// Constantes

/**
 * Constante `ruta` utilizada para las operaciones con la base de datos.
 */
const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'funko-app';

// Funciones

/**
 * Función que crea un objeto funko y lo añade a la colección del usuario en la base de datos.
 * @param usuario Usuario al que añadir a su colección el funko.
 * @param id Id del funko.
 * @param nombre Nombre del funko.
 * @param descripcion Descripción del funko.
 * @param tipo Tipo del funko.
 * @param genero Género del funko.
 * @param franquicia Franquicia del funko.
 * @param numero Número del funko.
 * @param exclusivo Exclusivo del funko.
 * @param caracteristicas_especiales Características especiales del funko.
 * @param valor_mercado Valor mercado del funko.
 * @returns True si se ha creado el funko o false si no se ha creado porque ya existe el id.
 */
function AñadirFunko(usuario: string, id: number, nombre: string, descripcion: string, tipo: string, genero: string, franquicia: string, numero: number, exclusivo: boolean, caracteristicas_especiales: string, valor_mercado: number) {
  MongoClient.connect(dbURL).then((client) => {
    const db = client.db(dbName);
    return db.collection<FunkoPop>(`${usuario}`).insertOne({
      id: id,
      nombre: nombre,
      descripcion: descripcion,
      tipo: tipo,
      genero: genero,
      franquicia: franquicia,
      numero: numero,
      exclusivo: exclusivo,
      caracteristicas_especiales: caracteristicas_especiales,
      valor_mercado: valor_mercado
    });
  }).catch((error) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
}

/**
 * Función que modifica un objeto funko y lo actualiza a la colección del usuario en la base de datos.
 * @param usuario Usuario al que modificar el funko de su colección.
 * @param fichero Nombre del fichero json con el funko.
 * @param id Id del funko.
 * @param nombre Nombre del funko.
 * @param descripcion Descripción del funko.
 * @param tipo Tipo del funko.
 * @param genero Género del funko.
 * @param franquicia Franquicia del funko.
 * @param numero Número del funko.
 * @param exclusivo Exclusivo del funko.
 * @param caracteristicas_especiales Características especiales del funko.
 * @param valor_mercado Valor mercado del funko.
 * @returns True si se ha modificado el funko o false si no se ha modificado porque ya existe el id.
 */
function ModificarFunko(usuario: string, id: number, nombre: string, descripcion: string, tipo: string, genero: string, franquicia: string, numero: number, exclusivo: boolean, caracteristicas_especiales: string, valor_mercado: number) {
  MongoClient.connect(dbURL).then((client) => {
    const db = client.db(dbName);
    db.collection<FunkoPop>(`${usuario}`).deleteOne({
      id: id,
    });
    return db.collection<FunkoPop>(`${usuario}`).insertOne({
      id: id,
      nombre: nombre,
      descripcion: descripcion,
      tipo: tipo,
      genero: genero,
      franquicia: franquicia,
      numero: numero,
      exclusivo: exclusivo,
      caracteristicas_especiales: caracteristicas_especiales,
      valor_mercado: valor_mercado
    });
  }).catch((error) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
}

/**
 * Función que elimina un funko de la colección del usuario.
 * @param usuario Usuario al que eliminar el funko de su colección.
 * @param id Id del funko.
 * @returns True si se ha eliminado el funko o false si no se ha modificado.
 */
function EliminarFunko(usuario: string, id: number) {
  MongoClient.connect(dbURL).then((client) => {
    const db = client.db(dbName);
    return db.collection<FunkoPop>(`${usuario}`).deleteOne({
      id: id,
    });
  }).catch((error) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
}

/**
 * Función que retorna los atributos de un funko determinado de la colección del usuario.
 * @param usuario Usuario con el funko a mostrar.
 * @param id Id del funko a mostrar.
 * @returns Colección de Funkos en formato JSON.
 */
function EnseñarFunko(usuario: string, id: number) {
  MongoClient.connect(dbURL).then((client) => {
    const db = client.db(dbName);
    return db.collection<FunkoPop>(`${usuario}`).findOne({
      id: id,
    });
  }).then((result) => {
    return result;
  }).catch((error) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
}

/**
 * Servidor web express utilizado para la aplicación.
 */
const app = express();

/**
 * Aplicación del servidor para las peticiones.
 */
app.get('/funkos', (req, res) => {
  if (req.query.peticion === "get") {
    if (req.query.usuario != undefined && req.query.id !== undefined) {
      EnseñarFunko(req.query.usuario.toString(), parseInt(req.query.id.toString()));
    }
  } else if (req.query.peticion === "post") {
    if (req.query.usuario !== undefined && req.query.id !== undefined && req.query.nombre !== undefined && 
        req.query.descripcion !== undefined && req.query.tipo !== undefined && req.query.genero !== undefined && req.query.franquicia !== undefined
        && req.query.numero  !== undefined && req.query.exclusivo !== undefined && req.query.caracteristicas_especiales !== undefined && req.query.valor_mercado !== undefined) {
      AñadirFunko(req.query.usuario.toString(), parseInt(req.query.id.toString()), req.query.nombre.toString(), 
        req.query.descripcion.toString(), req.query.tipo.toString(), req.query.genero.toString(), req.query.franquicia.toString(), parseInt(req.query.numero.toString()), 
        JSON.parse(req.query.exclusivo.toString()), req.query.caracteristicas_especiales.toString(), parseInt(req.query.valor_mercado.toString()))
    }
  } else if (req.query.peticion === "delete") {
    if (req.query.usuario !== undefined && req.query.id !== undefined) {
      EliminarFunko(req.query.usuario.toString(), parseInt(req.query.id.toString()))
    }
  } else if (req.query.peticion === "patch") {
    if (req.query.usuario !== undefined && req.query.id !== undefined && req.query.nombre !== undefined && 
        req.query.descripcion !== undefined && req.query.tipo !== undefined && req.query.genero !== undefined && req.query.franquicia !== undefined
        && req.query.numero  !== undefined && req.query.exclusivo !== undefined && req.query.caracteristicas_especiales !== undefined && req.query.valor_mercado !== undefined) {
        ModificarFunko(req.query.usuario.toString(), parseInt(req.query.id.toString()), req.query.nombre.toString(), 
          req.query.descripcion.toString(), req.query.tipo.toString(), req.query.genero.toString(), req.query.franquicia.toString(), parseInt(req.query.numero.toString()), 
          JSON.parse(req.query.exclusivo.toString()), req.query.caracteristicas_especiales.toString(), parseInt(req.query.valor_mercado.toString()))
    }
  } else {
    return res.send();
  }
  return res.send();
});

/**
 * Servidor web escuchando a las peticiones
 */
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});