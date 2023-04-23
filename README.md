[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8eRVZXt4)

### Informe realizado por Eva Martínez Bencomo

En este informe se redactan las pautas seguidas para la realización de la práctica 9 de la asignatura *Desarrollo de Sistemas Informáticos*.

# Actividades Previas

Se procedió a la aceptación de la tarea en el *GitHub Classroom*.

Ahora nos encontramos con tres *badges* los cuales representan el éxito los **Tests** realizados, la herramienta **Coveralls** y **Sonar-Cloud**.

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Eva-Martinez/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Eva-Martinez/actions/workflows/tests.yml)
[![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Eva-Martinez/actions/workflows/coveralls.yml/badge.svg?branch=main)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Eva-Martinez/actions/workflows/coveralls.yml)
[![Sonar-Cloud](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Eva-Martinez/actions/workflows/sonarcloud.yml/badge.svg?branch=main)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Eva-Martinez/actions/workflows/sonarcloud.yml)

# Ejercicio

## Fichero Funko Type

Esta fichero contiene los tipos `FunkoPop`, el cual permite la creación de objetos de tipo **FunkoPop** que contienen los atributos:

- `id`: Identificador del Funko.
- `nombre`: Nombre del Funko.
- `descripcion`: Descripción del Funko.
- `tipo`: Tipo del Funko.
- `genero`: Género del Funko. 
- `franquicia`: Franquicia del Funko.
- `numero`: Número del Funko.
- `exclusivo`: Condición exclusivo del Funko.
- `caracteristicas_especiales`: Características Especiales del Funko.
- `valor_mercado`: Valor de mercado del Funko.

Y `ResponseType`, el cual contiene los atributos:

- `success`: Éxito de la operación.
- `funkoPops`: Conjunto o único elemento *FunkoPop* (Opcional).

## Fichero Funko App

Este fichero contiene las funciones utilizadas en los diferentes parámetros de petición:

- `post`: Añadir un Funko a una colección, revisando por una parte que el usuario exista para así poder invocar a su función correspondiente, o bien que no exista y por lo tanto lo cree y llame a dicha función.
- `patch`: Modificar un Funko de una colección de un usuario específico, revisando por una parte que el usuario exista para así poder invocar a su función correspondiente, o bien que no exista y por lo tanto muestre un mensaje de error.
- `delete`: Eliminar un Funko de una colección de un usuario específico, revisando por una parte que el usuario exista para así poder invocar a su función correspondiente, o bien que no exista y por lo tanto muestre un mensaje de error.
- `get`: Lista una colección de un usuario específico o un único funko de dicha colección, revisando por una parte que el usuario exista para así poder invocar a su función correspondiente, o bien que no exista y por lo tanto muestre un mensaje de error.

Dichas funciones son las siguientes:

- `AñadirFunko()`: 

La funcionalidad de la misma es crear un objeto `FunkoPop` y añadirlo en formato ***JSON*** a la colección, para ello en primer lugar se verifica que el id del funko a insertar sea diferente de los ya existentes en la colección mediante la función **ExisteFunko()**. Si existe un funko con dicho id se retornará *false* para indicar así que se debe enviar un mensaje de error, pero si no se creará el objeto `FunkoPop`, se instanciará la ruta de la base de datos para poder así crear el fichero *JSON* y se creará dicho fichero mediante la API síncrona **`writeFileSync(rutaFichero, JSON.stringify(funko))`**. Como se puede apreciar se inserta dicha ruta mencionada anteriormente y como valor el objeto `FunkoPop` convertido en formato *JSON*, y por último se retornará *true* indicando que el funko se ha agregado correctamente para así enviar un mensaje informativo.

- `EliminarFunko()`: 

La funcionalidad de la misma es eliminar un funko de la colección del usuario insertado, para ello en primer lugar se verifica que el id del funko a insertar exista en la colección mediante la función **ExisteFunko()**. Si existe un funko con dicho id se procederá a la examinación de la base de datos, específicamente del usuario mediante la API síncrona **`readdirSync(`${ruta}/${usuario}`)`**. A continuación se realizará un *for-of* de los elementos obtenidos con dicha API síncrona, sobre los cuales se procederá a la lectura del contenido de los mismo mediante **`readFileSync(archivo, 'utf-8')`**, y con este contenido obtenido gracias a dicha lectura se procederá convertir los datos de tipo *JSON* en un *string* para obtener así su id **json.id**. 

En cada iteración se comparará dicho id con el id del funko a eliminar, y si coinciden se establecerá la ruta del fichero a eliminar como la utilizada para obtener ese id, y por último se utilizará para la supresión del fichero la API síncrona **`unlinkSync(rutaArchivo)`** seguido de retornar *true* indicando que el funko se ha eliminado correctamente para así enviar un mensaje informativo. Pero si no existiese dicho funko se retornará *false* para indicar así que se debe enviar un mensaje de error.

- `ModificarFunko()`: 

La funcionalidad de la misma es modificar un funko de la colección del usuario seleccionado, para ello en primer lugar se verifica que el id del funko a modificar sea diferente de los ya existentes en la colección mediante la función **ExisteFunko()**. Si existe un funko con dicho id se eliminará de la colección, mediante la función `EliminarFunko()`, se agregará a la colección el funko modificado, mediante la función `AñadirFunko()`, y se retornará *true* indicando que el funko se ha modificado correctamente para así enviar un mensaje informativo. Pero si no existe el funko se retornará *false* para indicar así que se debe enviar un mensaje de error.

- `ListarColeccionFunkos()`:

La funcionalidad de la misma es listar la colección de funkos del usuario seleccionado, para ello en primer lugar se examinará la base de datos, específicamente del usuario mediante la API síncrona **`readdirSync(`${ruta}/${usuario}`)`**. A continuación se realizará un *for-of* de los elementos obtenidos con dicha API síncrona, sobre los cuales se procederá a la lectura del contenido de los mismo mediante **`readFileSync(archivo, 'utf-8')`**, y con este contenido obtenido gracias a dicha lectura se procederá convertir los datos de tipo *JSON* en un *string* para obtener así los diferentes atributos del json utilizados en combinación con el tipo *FunkoPop* para la creación de un objeto del mismo, el cual se añadirá a un vector de dicho tipo *FunkoPop* que será el retornado en el mensaje informativo al usuario.

- `EnseñarFunko()`:

La funcionalidad de esta es mostrar la información de un funko de la colección de un usuario específico, para ello se realiza una combinación entre *`EliminarFunko()`* y *`ListarColeccionFunkos()`* ya que extrae el id comparandolo con el insertado, si se cumple dicha condición se realizará el retorno de los datos del funko mediante un objeto de tipo *FunkoPop*. En función de la existencia del funko en la colección se mostrará un mensaje informativo o un mensaje de error.

Por último cabe destacar el uso de las funciones de comprobación o creación de elementos principales, junto con la inicialización del servidor de la aplicación el cual utiliza los diferentes argumentos nombrados anteriormente seguido del uso de las respectivas funciones y retornando en cada acción un mensaje en formato **JSON** de tipo *ResponseType*:

- `ExisteUsuario()`:

La funcionalidad de esta es comprobar si el usuario existe, para ello se realiza la lectura de los usuarios de la base de datos mediante la API síncrona **`readdirSync(ruta)`**. A continuación se realizará un *for-of* de los elementos obtenidos con dicha API síncrona, sobre los cuales se procederá a extraer sus datos con **`statSync(`${ruta}/${elemento}`)`** los cuales se utilizarán para comprobar si es un directorio mediante el método *isDirectory()* y que se nombre sea igual al del usuario a comprobar. Si se cumplen estas condiciones de retornará *true*, pero si tras las iteraciones no coinciden se retornará *false* para indicar así que se debe enviar un mensaje de error.

- `ExisteFunko()`: 

La funcionalidad de esta es comprobar si el funko con dicha id existe en la colección del usuario determinado, para ello se utiliza la misma funcionalidad que para *`EliminarFunko()`* pero si coinciden los ids se retornará *true* indicando así que existe el funko, sino se retornará *false* para indicar así que se debe enviar un mensaje de error.

- `CrearUsuario()`:

La funcionalidad de esta es crear a un usuario, para ello se hará uso de la API síncrona **`mkdirSync(`${ruta}/${usuario}`, { recursive: true })`** la cual en primer lugar contiene la ruta a crear, y en segundo lugar la opción `recursive` activada para permitir así la creación de directorios padre.

# Conclusiones

Todo el ejercicio se ha realizado de manera adecuada a excepción de los tests, los cuales no se han realizado y por lo tanto no pasan correctamente los *badges*.