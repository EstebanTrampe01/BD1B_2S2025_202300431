# BD1B_2S2025_202300431

## Proyecto Fase 2: Backend y Exposición de Servicios para la Base de Datos "Centros de Evaluación de Manejo"

### Descripción
Este proyecto implementa un backend dockerizado con una base de datos Oracle, conectado a DBeaver para administración, y un API REST en Node.js/Express que permite operaciones CRUD completas y consultas predefinidas para el sistema de Centros de Evaluación de Manejo.

### Tecnologías Utilizadas
- **Base de Datos**: Oracle XE (Docker)
- **Backend**: Node.js + Express
- **Cliente BD**: DBeaver
- **API Testing**: Postman
- **Contenerización**: Docker + Docker Compose

### Requisitos Previos
- Docker y Docker Compose instalados
- Node.js (versión 14 o superior)
- DBeaver instalado
- Postman instalado

### Pasos de Despliegue

#### 1. Levantar la Base de Datos
```bash
docker-compose up -d
```
Esto iniciará el contenedor Oracle XE y cargará automáticamente el esquema DDL.

#### 2. Verificar Conexión en DBeaver
- Abrir DBeaver
- Crear nueva conexión Oracle
- Configurar:
  - Host: localhost
  - Puerto: 1521
  - SID: XE
  - Usuario: PROYECTO2_USER
  - Contraseña: admin123
- Probar conexión y explorar las tablas creadas

#### 3. Instalar Dependencias del Backend
```bash
cd backend
npm install
```

#### 4. Configurar Variables de Entorno
Crear archivo `.env` en la carpeta `backend` con:
```
DB_HOST=localhost
DB_PORT=1521
DB_USER=PROYECTO2_USER
DB_PASSWORD=admin123
DB_SERVICE=XE
PORT=3000
```

#### 5. Ejecutar el Backend
```bash
npm start
```
El servidor se ejecutará en `http://localhost:3000`

### Endpoints de la API

#### CRUD por Tabla
- **Departamentos**: `/api/departamentos`
- **Municipios**: `/api/municipios`
- **Centros**: `/api/centros`
- **Escuelas**: `/api/escuelas`
- **Ubicaciones**: `/api/ubicaciones`
- **Correlativos**: `/api/correlativos`
- **Registros**: `/api/registros`
- **Exámenes**: `/api/examenes`
- **Preguntas Teóricas**: `/api/preguntas`
- **Preguntas Prácticas**: `/api/preguntas-practico`
- **Respuestas Usuario Teóricas**: `/api/respuestas-usuario`
- **Respuestas Usuario Prácticas**: `/api/respuestas-practico`

Cada endpoint soporta:
- `GET /` - Obtener todos los registros
- `GET /:id` - Obtener registro por ID
- `POST /` - Crear nuevo registro
- `PUT /:id` - Actualizar registro
- `DELETE /:id` - Eliminar registro

#### Consultas SQL
- **Registros por Municipio**: `GET /api/consultas/registros-por-municipio`
- **Exámenes Aprobados por Centro**: `GET /api/consultas/examenes-aprobados-centro`
- **Promedio Calificaciones por Tipo de Examen**: `GET /api/consultas/promedio-calificaciones-tipo`

### Pruebas con Postman
1. Importar las colecciones desde la carpeta `postman_collections/` (archivos separados por tabla para facilitar la importación):
   - `departamentos.json`
   - `municipios.json`
   - `centros.json`
   - `escuelas.json`
   - `ubicaciones.json`
   - `correlativos.json`
   - `registros.json`
   - `examenes.json`
   - `preguntas.json`
   - `preguntasPractico.json`
   - `respuestaUsuario.json`
   - `respuestaPractico.json`
   - `consultas.json`
2. Configurar variable `base_url` como `http://localhost:3000` en cada colección
3. Ejecutar las pruebas en orden lógico (primero crear datos base, luego registros dependientes)

### Estructura del Proyecto
```
.
├── docker-compose.yml          # Configuración Docker
├── sql/
│   └── 01_schema.sql          # DDL de la base de datos
├── backend/
│   ├── server.js              # Servidor principal
│   ├── db.js                  # Configuración conexión BD
│   ├── .env                   # Variables de entorno
│   ├── package.json           # Dependencias
│   └── routes/                # Endpoints API
├── postman_collections/       # Colecciones Postman separadas
│   ├── departamentos.json
│   ├── municipios.json
│   ├── centros.json
│   ├── escuelas.json
│   ├── ubicaciones.json
│   ├── correlativos.json
│   ├── registros.json
│   ├── examenes.json
│   ├── preguntas.json
│   ├── preguntasPractico.json
│   ├── respuestaUsuario.json
│   ├── respuestaPractico.json
│   └── consultas.json
└── README.md                  # Esta documentación
```

### Notas Importantes
- Toda manipulación de datos debe realizarse exclusivamente a través de la API REST
- DBeaver se utiliza solo para verificación de estructura, no para inserción/edición de datos
- Las consultas SQL están optimizadas para el esquema relacional definido

### Capturas de Evidencia

## Docker Compose

![alt text](<Documentacion/image copy 16.png>)

## API 

![alt text](<Documentacion/image copy 17.png>)

## BD_FASE2 Colleciton

![alt text](<Documentacion/image copy 18.png>)

![alt text](<Documentacion/image copy 19.png>)

## Departamento

# GET ALL
![alt text](<Documentacion/image copy.png>)
# GET ID
![alt text](<Documentacion/image copy 2.png>)
# POST
![alt text](<Documentacion/image copy 3.png>)
# PULL
![alt text](<Documentacion/image copy 4.png>)
# DELETE
![alt text](<Documentacion/image copy 5.png>)

## Municipio

# GET ALL
![alt text](<Documentacion/image copy 7.png>)
# GET ID
![alt text](<Documentacion/image copy 8.png>)
# POST
![alt text](<Documentacion/image copy 6.png>)
# PULL
![alt text](<Documentacion/image copy 9.png>)
# DELETE
![alt text](<Documentacion/image copy 10.png>)

## Centro

# GET ALL
![alt text](<Documentacion/image copy 12.png>)
# GET ID
![alt text](<Documentacion/image copy 13.png>)
# POST
![alt text](<Documentacion/image copy 11.png>)
# PULL
![alt text](<Documentacion/image copy 14.png>)
# DELETE
![alt text](<Documentacion/image copy 15.png>)