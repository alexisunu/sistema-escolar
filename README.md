# Sistema Escolar — Proyecto Final

Backend (Java + Spring Boot) + Frontend (Angular) + Base de datos (MySQL), desplegado en tres computadores (PC-1 BD, PC-2 backend, PC-3 frontend) dentro de la misma LAN.

Este repositorio contiene solo la **configuración base** de cada proyecto (dependencias, conexión a la BD, routing, HttpClient) — las entidades, controllers, servicios y componentes los desarrolla cada quien según el reparto del equipo.

## Estructura
- `/backend` — proyecto Spring Boot ya configurado (pom.xml con las dependencias, `application.properties` apuntando a MySQL). Falta por crear: `model/`, `repository/`, `service/`, `controller/`.
- `/frontend` — proyecto Angular ya configurado (routing, HttpClientModule, FormsModule, environments con la URL de la API). Falta por crear: los archivos dentro de `models/`, `services/`, `components/`.
- `/documentacion` — diseño de base de datos, arquitectura, instalación en Ubuntu Server y contrato de API. Úsenlo como referencia para nombrar clases, endpoints y campos de forma consistente entre backend y frontend.

## Para empezar

### Backend
```bash
cd backend
# Edita src/main/resources/application.properties con la IP real del PC-1 (base de datos)
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
# Edita src/environments/environment.development.ts con la IP real del PC-2 (backend) si no usas localhost
ng serve
```

## Documentación completa
Ver `/documentacion/Diseno_Sistema_Escolar.md`.
