// Imports
import * as fs from 'fs';
import express from 'express';
import { FunkoPop, ResponseType } from './funkotypes.js';

// Constantes

/**
 * Constante `ruta` utilizada para las operaciones con la base de datos.
 */
const ruta = "./funkos";

// Funciones

/**
 * Función que crea la ruta del usuario en la base de datos
 * @param usuario Usuario cuya ruta crear.
 */
function CrearUsuario(usuario: string): void {
  fs.mkdirSync(`${ruta}/${usuario}`, { recursive: true });
}

/**
 * Función que comprueba si existe un usuario en concreto.
 * @param usuario Usuario a comprobar su existencia.
 * @returns True si el usuario existe o false si no existe.
 */
function ExisteUsuario(usuario: string): boolean {
  const elementos = fs.readdirSync(ruta);
  for (const elemento of elementos) {
    const informacion = fs.statSync(`${ruta}/${elemento}`);
    if (informacion.isDirectory() && elemento == usuario) {
      return true;
    }
  }
  return false;
}

/**
 * Función que comprueba si existe un funko en concreto en la colección del usuario correspondiente.
 * @param usuario Usuario con la colección a examinar.
 * @param id Id del funko a analizar.
 * @returns True si existe el funko o false si no existe.
 */
function ExisteFunko(usuario: string, id: number): boolean {
  const elementos = fs.readdirSync(`${ruta}/${usuario}`);
  const ref: string[] = [];
  if (elementos !== ref) {
    for (const elemento of elementos) {
      const archivo = `${ruta}/${usuario}/${elemento}`;
      const contenido = fs.readFileSync(archivo, 'utf-8');
      const json = JSON.parse(contenido);
      const elemento_id = json.id;
      if (elemento_id === id) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Función que crea un objeto funko y lo añade a la colección del usuario en la base de datos.
 * @param usuario Usuario al que añadir a su colección el funko.
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
 * @returns True si se ha creado el funko o false si no se ha creado porque ya existe el id.
 */
function AñadirFunko(usuario: string, fichero: string, id: number, nombre: string, descripcion: string, tipo: string, genero: string, franquicia: string, numero: number, exclusivo: boolean, caracteristicas_especiales: string, valor_mercado: number): boolean {
  if (ExisteFunko(usuario, id)) {
    return false;
  } else {
    const funko: FunkoPop = {
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
    }
    const rutaFichero = `${ruta}/${usuario}/${fichero}.json`;
    try {
      fs.writeFileSync(rutaFichero, JSON.stringify(funko));
      return true;
    } catch (error) {
      return false;
    }
  }
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
function ModificarFunko(usuario: string, fichero: string, id: number, nombre: string, descripcion: string, tipo: string, genero: string, franquicia: string, numero: number, exclusivo: boolean, caracteristicas_especiales: string, valor_mercado: number): boolean {
  if (ExisteFunko(usuario, id)) {
    EliminarFunko(usuario, id);
    AñadirFunko(usuario, fichero, id, nombre, descripcion, tipo, genero, franquicia, numero, exclusivo, caracteristicas_especiales, valor_mercado);
    return true;
  } else {
    return false;
  }
}

/**
 * Función que elimina un funko de la colección del usuario.
 * @param usuario Usuario al que eliminar el funko de su colección.
 * @param id Id del funko.
 * @returns True si se ha eliminado el funko o false si no se ha modificado.
 */
function EliminarFunko(usuario: string, id: number): boolean {
  if (ExisteFunko(usuario, id)) {
    let rutaArchivo = ``;
    const elementos = fs.readdirSync(`${ruta}/${usuario}`);
    for (const elemento of elementos) {
      const archivo = `${ruta}/${usuario}/${elemento}`;
      const contenido = fs.readFileSync(archivo, 'utf-8');
      const json = JSON.parse(contenido);
      const elemento_id = json.id;
      if (elemento_id === id) {
        rutaArchivo = archivo;
      }
    }
    fs.unlinkSync(rutaArchivo);
    return true;
  } else {
    return false;
  }
}

/**
 * Función que retorna los atributos de los funkos determinados de la colección del usuario.
 * @param usuario Usuario con el funko a mostrar.
 * @returns Funko en formato JSON
 */
function ListarColeccionFunkos(usuario: string): FunkoPop[] {
  const elementos = fs.readdirSync(`${ruta}/${usuario}`);
  const funko_elementos = [];
  for (const elemento of elementos) {
    const archivo = `${ruta}/${usuario}/${elemento}`;
    const contenido = fs.readFileSync(archivo, 'utf-8');
    const json = JSON.parse(contenido);
    const funko_elemento: FunkoPop = {
      id: json.id,
      nombre: json.nombre,
      descripcion: json.descripcion,
      tipo: json.tipo,
      genero: json.genero,
      franquicia: json.franquicia,
      numero: json.numero,
      exclusivo: json.exclusivo,
      caracteristicas_especiales: json.caracteristicas_especiales,
      valor_mercado: json.valor_mercado
    }
    funko_elementos.push(funko_elemento);
  }
  return funko_elementos;
}

/**
 * Función que retorna los atributos de un funko determinado de la colección del usuario.
 * @param usuario Usuario con el funko a mostrar.
 * @param id Id del funko a mostrar.
 * @returns Colección de Funkos en formato JSON.
 */
function EnseñarFunko(usuario: string, id: number): FunkoPop {
  const elementos = fs.readdirSync(`${ruta}/${usuario}`);
  let funko_elemento: FunkoPop = {id: 0, nombre: "", descripcion: "", tipo: "", genero: "", franquicia: "", numero: 0,
                                  exclusivo: false, caracteristicas_especiales: "", valor_mercado: 0};
  for (const elemento of elementos) {
    const archivo = `${ruta}/${usuario}/${elemento}`;
    const contenido = fs.readFileSync(archivo, 'utf-8');
    const json = JSON.parse(contenido);
    if (json.id === id) {
      funko_elemento = {
        id: json.id,
        nombre: json.nombre,
        descripcion: json.descripcion,
        tipo: json.tipo,
        genero: json.genero,
        franquicia: json.franquicia,
        numero: json.numero,
        exclusivo: json.exclusivo,
        caracteristicas_especiales: json.caracteristicas_especiales,
        valor_mercado: json.valor_mercado
      }
    }
  }
  return funko_elemento;
}

/**
 * Servidor web express utilizado para la aplicación.
 */
const app = express();

/**
 * Aplicación del servidor para las peticiones.
 */
app.get('/funkos', (req, res) => {
  const respuesta: ResponseType = {
    success: false
  } 
  if (req.query.peticion === "get") {
    if (req.query.usuario != undefined) {
      if (ExisteUsuario(req.query.usuario.toString())) {
        if (req.query.operacion === "1") {
          respuesta.success = true;
          respuesta.funkoPops = ListarColeccionFunkos(req.query.usuario.toString());
          return res.send(respuesta);
        } else if (req.query.operacion === "2") {
          if (req.query.id !== undefined) {
            respuesta.success = true;
            respuesta.funkoPops = EnseñarFunko(req.query.usuario.toString(), parseInt(req.query.id.toString()));
            return res.send(respuesta);
          }
        } else {
          return res.send(respuesta);
        }
      } else {
        return res.send(respuesta);
      }
    } else {
      return res.send(respuesta);
    }
  } else if (req.query.peticion === "post") {
    if (req.query.usuario !== undefined && req.query.fichero !== undefined && req.query.id !== undefined && req.query.nombre !== undefined && 
        req.query.descripcion !== undefined && req.query.tipo !== undefined && req.query.genero !== undefined && req.query.franquicia !== undefined
        && req.query.numero  !== undefined && req.query.exclusivo !== undefined && req.query.caracteristicas_especiales !== undefined && req.query.valor_mercado !== undefined) {
      if (ExisteUsuario(req.query.usuario.toString())) {
        if (AñadirFunko(req.query.usuario.toString(), req.query.fichero.toString(), parseInt(req.query.id.toString()), req.query.nombre.toString(), 
        req.query.descripcion.toString(), req.query.tipo.toString(), req.query.genero.toString(), req.query.franquicia.toString(), parseInt(req.query.numero.toString()), 
        JSON.parse(req.query.exclusivo.toString()), req.query.caracteristicas_especiales.toString(), parseInt(req.query.valor_mercado.toString()))) {
          respuesta.success = true;
          return res.send(respuesta);
        } else {
          return res.send(respuesta);
        }
      } else {
        CrearUsuario(req.query.usuario.toString());
        if (AñadirFunko(req.query.usuario.toString(), req.query.fichero.toString(), parseInt(req.query.id.toString()), req.query.nombre.toString(), 
        req.query.descripcion.toString(), req.query.tipo.toString(), req.query.genero.toString(), req.query.franquicia.toString(), parseInt(req.query.numero.toString()), 
        JSON.parse(req.query.exclusivo.toString()), req.query.caracteristicas_especiales.toString(), parseInt(req.query.valor_mercado.toString()))) {
          respuesta.success = true;
          return res.send(respuesta);
        } else {
          return res.send(respuesta);
        }
      }
    } else {
      return res.send(respuesta);
    }
  } else if (req.query.peticion === "delete") {
    if (req.query.usuario !== undefined && req.query.id !== undefined) {
      if (ExisteUsuario(req.query.usuario.toString())) {
        if (EliminarFunko(req.query.usuario.toString(), parseInt(req.query.id.toString()))) {
          respuesta.success = true;
          return res.send(respuesta);
        } else {
          return res.send(respuesta);
        }
      } else {
        return res.send(respuesta);
      }
    } else {
      return res.send(respuesta);
    }
  } else if (req.query.peticion === "patch") {
    if (req.query.usuario !== undefined && req.query.fichero !== undefined && req.query.id !== undefined && req.query.nombre !== undefined && 
        req.query.descripcion !== undefined && req.query.tipo !== undefined && req.query.genero !== undefined && req.query.franquicia !== undefined
        && req.query.numero  !== undefined && req.query.exclusivo !== undefined && req.query.caracteristicas_especiales !== undefined && req.query.valor_mercado !== undefined) {
      if (ExisteUsuario(req.query.usuario.toString())) {
        if (ModificarFunko(req.query.usuario.toString(), req.query.fichero.toString(), parseInt(req.query.id.toString()), req.query.nombre.toString(), 
        req.query.descripcion.toString(), req.query.tipo.toString(), req.query.genero.toString(), req.query.franquicia.toString(), parseInt(req.query.numero.toString()), 
        JSON.parse(req.query.exclusivo.toString()), req.query.caracteristicas_especiales.toString(), parseInt(req.query.valor_mercado.toString()))) {
          respuesta.success = true;
          return res.send(respuesta);
        } else {
          return res.send(respuesta);
        }
      } else {
        return res.send(respuesta);
      }
    } else {
      return res.send(respuesta);
    }
  } else {
    return res.send(respuesta);
  }
  return res.send(respuesta);
});

/**
 * Servidor web escuchando a las peticiones
 */
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});