# Sistema Escolar — Diseño de Base de Datos, Arquitectura y Contrato de API

Stack elegido: **Java + Spring Boot** (backend) + **Angular** (frontend) + **MySQL** (base de datos), desplegado en tres computadores Ubuntu Server 22.04 (uno por capa) dentro de la misma LAN.

---

## 1. Modelo de Base de Datos

### 1.1 Diagrama entidad-relación (texto)

```
estudiantes                profesores
------------                ------------
id (PK)                     id (PK)
nombre                      nombre
apellido                    apellido
email (UNIQUE)               email (UNIQUE)
fecha_nacimiento            especialidad

materias
------------
id (PK)
nombre
descripcion
creditos

estudiante_materia (N:M)         profesor_materia (N:M)
------------------------          ----------------------
id (PK)                           id (PK)
estudiante_id (FK -> estudiantes) profesor_id (FK -> profesores)
materia_id (FK -> materias)       materia_id (FK -> materias)
UNIQUE(estudiante_id, materia_id) UNIQUE(profesor_id, materia_id)
```

Relaciones:
- Un estudiante puede tener muchas materias, una materia puede tener muchos estudiantes → tabla puente `estudiante_materia`.
- Un profesor puede dictar muchas materias, una materia puede tener uno o varios profesores → tabla puente `profesor_materia`.

### 1.2 Script SQL (MySQL)

```sql
CREATE DATABASE sistema_escolar;

USE sistema_escolar;

CREATE TABLE estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    fecha_nacimiento DATE
);

CREATE TABLE profesores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    especialidad VARCHAR(150)
);

CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    creditos INT DEFAULT 0
);

CREATE TABLE estudiante_materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    materia_id INT NOT NULL,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    UNIQUE(estudiante_id, materia_id)
);

CREATE TABLE profesor_materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profesor_id INT NOT NULL,
    materia_id INT NOT NULL,
    FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    UNIQUE(profesor_id, materia_id)
);
```

Nota: esto va en el **PC-1 (Base de datos)**. Ese equipo no lleva Spring Boot ni Node, solo MySQL escuchando en la IP LAN.

---

## 2. Backend — Java Spring Boot (capas)

Arquitectura en capas simplificada: `Controller → Service → Repository → Entity`. Las entidades JPA viajan directo por la API (sin capa dto/), los servicios son clases concretas (sin interfaz), y no hay manejo global de excepciones ni clase de configuración CORS aparte.

```
com.sistemaescolar
│
├── SistemaEscolarApplication.java        (clase main @SpringBootApplication)
│
├── model/                                (entidades JPA)
│   ├── Estudiante.java
│   ├── Profesor.java
│   ├── Materia.java
│   ├── EstudianteMateria.java
│   └── ProfesorMateria.java
│
├── repository/                           (interfaces JpaRepository)
│   ├── EstudianteRepository.java
│   ├── ProfesorRepository.java
│   ├── MateriaRepository.java
│   ├── EstudianteMateriaRepository.java
│   └── ProfesorMateriaRepository.java
│
├── service/                              (una clase concreta por recurso, sin interfaz)
│   ├── EstudianteService.java
│   ├── ProfesorService.java
│   ├── MateriaService.java
│   └── AsignacionService.java
│
└── controller/                           (con @CrossOrigin propio, recibe/devuelve entidades)
    ├── EstudianteController.java
    ├── ProfesorController.java
    ├── MateriaController.java
    └── AsignacionController.java
```

### 2.1 Responsabilidad de cada capa

| Capa | Responsabilidad |
|---|---|
| `model` | Mapeo objeto-relacional (`@Entity`), define las tablas. |
| `repository` | Acceso a datos, hereda de `JpaRepository<Entidad, Long>`, sin lógica de negocio. |
| `service` | Lógica de negocio: validaciones, reglas de asignación, orquesta repositorios. |
| `controller` | Expone los endpoints REST, recibe/devuelve directamente las entidades, maneja el `@CrossOrigin` propio. |

Ejemplo de relación JPA en `Estudiante.java`:

```java
@Entity
@Table(name = "estudiantes")
public class Estudiante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private LocalDate fechaNacimiento;

    @OneToMany(mappedBy = "estudiante", cascade = CascadeType.ALL)
    private List<EstudianteMateria> materias;
}
```

Ejemplo de controller simplificado (sin DTO, sin interfaz de servicio, sin exception handler, con CORS directo en la clase):

```java
@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "http://192.168.1.30")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

    @GetMapping
    public List<Estudiante> getAll() {
        return estudianteService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> getById(@PathVariable Long id) {
        Optional<Estudiante> estudiante = estudianteService.getById(id);
        return estudiante.isPresent()
                ? ResponseEntity.ok(estudiante.get())
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Estudiante create(@RequestBody Estudiante estudiante) {
        return estudianteService.save(estudiante);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> update(@PathVariable Long id, @RequestBody Estudiante datos) {
        if (estudianteService.getById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        datos.setId(id);
        return ResponseEntity.ok(estudianteService.save(datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        estudianteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 2.2 pom.xml — dependencias clave

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

### 2.3 application.properties (PC-2, apuntando al PC-1)

```properties
spring.datasource.url=jdbc:mysql://<IP_LAN_PC1>:3306/sistema_escolar
spring.datasource.username=escolar_user
spring.datasource.password=tu_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
server.port=8080
```

---

## 3. Frontend — Angular (capas)

```
src/app
│
├── models/
│   ├── estudiante.model.ts
│   ├── profesor.model.ts
│   └── materia.model.ts
│
├── services/                    (HttpClient, un servicio por recurso)
│   ├── estudiante.service.ts
│   ├── profesor.service.ts
│   ├── materia.service.ts
│   └── asignacion.service.ts
│
├── components/
│   ├── estudiantes/
│   │   ├── estudiantes-list/
│   │   └── estudiante-form/
│   ├── profesores/
│   │   ├── profesores-list/
│   │   └── profesor-form/
│   ├── materias/
│   │   ├── materias-list/
│   │   └── materia-form/
│   └── asignaciones/
│       └── asignacion-form/
│
├── app-routing.module.ts
└── environments/
    ├── environment.ts           (apiUrl apuntando al PC-2)
    └── environment.prod.ts
```

Ejemplo de servicio (`estudiante.service.ts`):

```typescript
@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/estudiantes`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Estudiante[]> { return this.http.get<Estudiante[]>(this.apiUrl); }
  getById(id: number): Observable<Estudiante> { return this.http.get<Estudiante>(`${this.apiUrl}/${id}`); }
  create(e: Estudiante): Observable<Estudiante> { return this.http.post<Estudiante>(this.apiUrl, e); }
  update(id: number, e: Estudiante): Observable<Estudiante> { return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, e); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
```

`environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://<IP_LAN_PC2>:8080/api'
};
```

---

## 4. Instalación de dependencias en Ubuntu Server 22.04

### 4.1 PC-1 — Base de datos (solo MySQL)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y mysql-server

# Habilitar acceso desde la LAN (no solo localhost)
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# cambiar: bind-address = 0.0.0.0

sudo systemctl restart mysql

# Crear usuario y base de datos con acceso desde la LAN
sudo mysql
# dentro de la consola de MySQL:
CREATE DATABASE sistema_escolar;
CREATE USER 'escolar_user'@'%' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON sistema_escolar.* TO 'escolar_user'@'%';
FLUSH PRIVILEGES;
```

Abrir el firewall si usas `ufw`:
```bash
sudo ufw allow from <SUBRED_LAN>/24 to any port 3306
```

### 4.2 PC-2 — Backend (Java + Spring Boot)

Solo necesita Java y Maven — nada de Node ni Nginx en esta máquina.

```bash
sudo apt update && sudo apt upgrade -y

# Java 17 + Maven
sudo apt install -y openjdk-17-jdk maven
java -version
mvn -version

sudo ufw allow from <SUBRED_LAN>/24 to any port 8080
```

Ejecutar el backend:
```bash
cd backend
mvn clean package -DskipTests
java -jar target/sistema-escolar-0.0.1-SNAPSHOT.jar
```

### 4.3 PC-3 — Frontend (Angular)

Solo necesita Node.js, Angular CLI y Nginx — nada de Java ni MySQL en esta máquina.

```bash
sudo apt update && sudo apt upgrade -y

# Node.js + Angular CLI
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g @angular/cli
node -v && npm -v && ng version

# Nginx (sirve el build de Angular)
sudo apt install -y nginx
sudo ufw allow 'Nginx Full'
```

Compilar y desplegar el frontend:
```bash
cd frontend
ng build --configuration production
sudo cp -r dist/sistema-escolar/* /var/www/html/
```

Nota: las IPs de los ejemplos son ilustrativas — usa las IPs reales de tu LAN, consistentes con las que se usan en la sección 6 (Despliegue en tres computadores).

---

## 5. Contrato de API — para tu compañero de frontend

Base URL: `http://<IP_LAN_PC2>:8080/api`

### Estudiantes
| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| GET | `/estudiantes` | — | Lista todos los estudiantes |
| GET | `/estudiantes/{id}` | — | Obtiene un estudiante |
| POST | `/estudiantes` | `{nombre, apellido, email, fechaNacimiento}` | Crea estudiante |
| PUT | `/estudiantes/{id}` | igual que POST | Actualiza estudiante |
| DELETE | `/estudiantes/{id}` | — | Elimina estudiante |

### Profesores
| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| GET | `/profesores` | — | Lista todos los profesores |
| GET | `/profesores/{id}` | — | Obtiene un profesor |
| POST | `/profesores` | `{nombre, apellido, email, especialidad}` | Crea profesor |
| PUT | `/profesores/{id}` | igual que POST | Actualiza profesor |
| DELETE | `/profesores/{id}` | — | Elimina profesor |

### Materias
| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| GET | `/materias` | — | Lista todas las materias |
| GET | `/materias/{id}` | — | Obtiene una materia |
| POST | `/materias` | `{nombre, descripcion, creditos}` | Crea materia |
| PUT | `/materias/{id}` | igual que POST | Actualiza materia |
| DELETE | `/materias/{id}` | — | Elimina materia |

### Asignaciones
| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| POST | `/asignaciones/estudiante-materia` | `{estudianteId, materiaId}` | Asigna materia a estudiante |
| DELETE | `/asignaciones/estudiante-materia/{id}` | — | Quita asignación |
| GET | `/asignaciones/estudiante/{id}/materias` | — | Materias de un estudiante |
| POST | `/asignaciones/profesor-materia` | `{profesorId, materiaId}` | Asigna materia a profesor |
| DELETE | `/asignaciones/profesor-materia/{id}` | — | Quita asignación |
| GET | `/asignaciones/profesor/{id}/materias` | — | Materias de un profesor |

Todas las respuestas son JSON. Si un recurso no existe, el controller responde directamente con `404 Not Found` y cuerpo vacío (sin un formato de error centralizado).

**CORS:** cada controller trae su propia anotación `@CrossOrigin(origins = "http://<IP_PC3>")` para que Angular pueda llamar a la API sin bloqueos del navegador — importante indicárselo a tu compañero si prueba desde `localhost:4200` en desarrollo (ahí toca agregar ese origen también).

---

## 6. Despliegue en tres computadores (BD / Backend / Frontend separados)

El enunciado del proyecto pide dos VPS (BD y Sistema), pero nada impide dividir el "Sistema" en dos máquinas físicas independientes: una solo para el backend y otra solo para el frontend. Lógicamente sigue siendo la misma arquitectura de 2 capas de aplicación + 1 de datos, solo que ahora corren en 3 equipos distintos dentro de la misma LAN.

### 6.1 Diagrama de conexión

```
PC-1 (MySQL)  <-----3306----  PC-2 (Spring Boot, puerto 8080)  <-----8080----  PC-3 (Angular servido con Nginx/http-server, puerto 80 o 4200)
   IP: 192.168.1.10                IP: 192.168.1.20                                  IP: 192.168.1.30
```

Flujo real: el navegador del usuario abre `http://192.168.1.30`, Angular (que ya corre en el navegador) hace las peticiones HTTP directamente a `http://192.168.1.20:8080/api/...`, y Spring Boot en PC-2 es quien habla con MySQL en `192.168.1.10:3306`. **PC-3 nunca se conecta a la base de datos directamente.**

### 6.2 Qué configurar en cada máquina

**PC-1 (Base de datos — MySQL):**
- Instalar MySQL como en la sección 4.1.
- En `mysqld.cnf`: `bind-address = 0.0.0.0`.
- Crear el usuario con `CREATE USER 'escolar_user'@'%' ...` (el `%` permite conectarse desde cualquier IP de la LAN; si quieres restringirlo solo a PC-2, usa `'escolar_user'@'192.168.1.20'`).
- Firewall: `sudo ufw allow from 192.168.1.0/24 to any port 3306`.
- Anotar su IP fija (`ip a`) — la necesita PC-2.

**PC-2 (Backend — Spring Boot):**
- Instalar Java y Maven como en la sección 4.2 (no necesita Node ni Nginx aquí, solo corre el `.jar`).
- En `application.properties`, la URL apunta a la IP de PC-1:
  ```properties
  spring.datasource.url=jdbc:mysql://192.168.1.10:3306/sistema_escolar
  ```
- Cada controller lleva su propio `@CrossOrigin`, apuntando a la IP/puerto de PC-3 (no `localhost`):
  ```java
  @RestController
  @RequestMapping("/api/estudiantes")
  @CrossOrigin(origins = "http://192.168.1.30")
  public class EstudianteController { ... }
  ```
  (repite la misma anotación, con la misma IP, en `ProfesorController`, `MateriaController` y `AsignacionController`)
- Firewall: `sudo ufw allow from 192.168.1.0/24 to any port 8080`.
- Anotar su IP fija — la necesita PC-3.

**PC-3 (Frontend — Angular):**
- Instalar solo Node.js y Angular CLI (no necesita Java ni MySQL).
- En `environment.prod.ts` (o `environment.ts` si pruebas en modo dev), la `apiUrl` apunta a la IP de PC-2:
  ```typescript
  export const environment = {
    production: true,
    apiUrl: 'http://192.168.1.20:8080/api'
  };
  ```
- Compilar con `ng build --configuration production` y servir el contenido de `dist/` con Nginx, o simplemente correr `ng serve --host 0.0.0.0` para pruebas rápidas.
- Firewall: `sudo ufw allow 80/tcp` (o el puerto que uses para servir).

### 6.3 Checklist rápido para que todo conecte
1. Las tres máquinas están en la misma red/subred y se hacen `ping` entre sí.
2. Cada una tiene **IP fija** (o al menos reservada en el DHCP del router) — si la IP cambia, hay que reescribir configs en dos lugares.
3. `ufw` (o el firewall que uses) permite el puerto correspondiente **desde** la IP de quien necesita conectarse, no solo `localhost`.
4. El `@CrossOrigin` de cada controller lista la IP real de PC-3, no `localhost`.
5. El `environment.ts` del frontend apunta a la IP real de PC-2, no `localhost`.

---

## 7. GitHub — cómo descargar solo backend o solo frontend en cada equipo

### 7.1 Estructura del repositorio

Un solo repositorio con esta estructura (como ya recomienda el enunciado):
```
/backend
/frontend
/documentacion
```

### 7.2 Opción recomendada: sparse-checkout (sin ramas separadas)

No hace falta crear una rama por carpeta; Git permite clonar el repo completo pero solo "materializar" en disco la carpeta que te interesa. Esto mantiene un solo historial y evita duplicar commits entre ramas.

En **PC-2 (solo quiere `/backend`)**:
```bash
git clone --no-checkout https://github.com/tu-usuario/sistema-escolar.git
cd sistema-escolar
git sparse-checkout init --cone
git sparse-checkout set backend
git checkout main
```

En **PC-3 (solo quiere `/frontend`)**:
```bash
git clone --no-checkout https://github.com/tu-usuario/sistema-escolar.git
cd sistema-escolar
git sparse-checkout init --cone
git sparse-checkout set frontend
git checkout main
```

Con esto, en cada PC solo aparece en el disco la carpeta que pediste, pero `git pull` sigue trayendo actualizaciones normalmente y `git push` sigue subiendo al mismo repo/rama.

### 7.3 Alternativa: ramas por componente (`backend` y `frontend`)

Si de verdad prefieren manejarlo como ramas separadas (por ejemplo, para que cada quien trabaje solo en la suya y no se estorben con merges), la forma correcta es:

```bash
# Crear la rama backend a partir de main, una sola vez
git checkout -b backend main
git push -u origin backend

# Crear la rama frontend a partir de main, una sola vez
git checkout -b frontend main
git push -u origin frontend
```

Luego cada compañero clona directamente esa rama:
```bash
# En PC-2
git clone -b backend --single-branch https://github.com/tu-usuario/sistema-escolar.git

# En PC-3
git clone -b frontend --single-branch https://github.com/tu-usuario/sistema-escolar.git
```

**Ojo:** con este enfoque las carpetas `backend/` y `frontend/` siguen existiendo dentro de cada rama (a menos que las borres de esa rama), y se vuelve más difícil mantener sincronizados cambios que afecten a ambos lados (por ejemplo, si cambia el contrato de la API). Para un proyecto de este tamaño, **la opción 7.2 (sparse-checkout sobre `main`) es más simple y menos propensa a errores** que mantener ramas divergentes solo para separar carpetas. Las ramas se usan mejor para features (`feature/crud-estudiantes`) o entornos (`dev`, `main`), no para separar backend de frontend.

---

## Próximos pasos sugeridos
1. Levantar PC-1 con MySQL y correr el script SQL.
2. Generar el proyecto Spring Boot (Spring Initializr: Web, JPA, MySQL Driver, Validation) en PC-2.
3. Implementar `Estudiante` de punta a punta (entity → repo → service → controller) como plantilla para las demás entidades.
4. Compartir este contrato de API con tu compañero para que arranque el frontend en PC-3 en paralelo.
5. Configurar sparse-checkout (sección 7.2) en cada equipo para trabajar solo con la carpeta que le corresponde.
