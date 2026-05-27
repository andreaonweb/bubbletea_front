# 🧋 BubbleTea Store — Frontend

Aplicación web desarrollada con **Angular 17+** para gestionar un catálogo de Bubble Teas. Permite autenticación de usuarios, listado, creación, edición y visualización de productos.

---

## 🚀 Tecnologías

- **Angular 17+** (standalone components, lazy loading)
- **AngularFire** — autenticación con Firebase
- **Reactive Forms** — formularios con validación
- **Angular Signals** — gestión de estado reactivo
- **SCSS + BEM** — estilos propios
- **HttpClient** — comunicación con la API REST

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/         # authGuard — protege rutas privadas
│   │   ├── interceptors/   # errorInterceptor — manejo global de errores HTTP
│   │   └── services/       # AuthService, BubbleTeaService, UserService
│   ├── features/
│   │   ├── auth/           # Login y Register
│   │   ├── bubbletea/      # Lista, Detalle y Formulario
│   │   └── users/          # Perfil de usuario
│   └── shared/
│       ├── components/     # Navbar, LoadingSpinner
│       ├── models/         # Interfaces BubbleTea, User, AuthUser
│       └── validators/     # CustomValidators (strongPassword, positiveNumber...)
└── environments/
    ├── environment.ts          # Desarrollo (localhost:8000)
    └── environment.prod.ts     # Producción
```

---

## ⚙️ Instalación y arranque

```bash
# Instalar dependencias
npm install

# Arrancar en modo desarrollo
ng serve --open
```

La app estará disponible en `http://localhost:4200`

> ⚠️ El backend debe estar corriendo en `http://localhost:8000` para que los datos se carguen correctamente.

---

## 🔐 Autenticación

La autenticación está implementada con **Firebase Auth** mediante `AngularFire`.

- Login y Register con email y contraseña
- El estado del usuario se gestiona con **Signals** en `AuthService`
- Las rutas privadas están protegidas con `authGuard`
- Si el usuario no está autenticado, es redirigido automáticamente a `/auth/login`

```typescript
// authGuard redirige si no hay sesión
if (authService.isAuthenticated()) return true;
return router.createUrlTree(['/auth/login']);
```

---

## 📋 Formularios

Todos los formularios usan **Reactive Forms**:

| Formulario | Validaciones |
|---|---|
| Login | email válido, contraseña requerida (mín. 6 caracteres) |
| Register | email válido, contraseña fuerte (mayúscula + número), confirmación igual |
| Nuevo/Editar BubbleTea | nombre (mín. 2 chars), precio positivo, máx. 2 decimales |

Validadores personalizados en `CustomValidators`:
- `strongPassword()` — requiere mayúscula y número
- `positiveNumber()` — precio mayor que 0
- `maxDecimals(n)` — máximo n decimales

---

## 🧋 Funcionalidades

- **Lista de productos** con filtros reactivos (búsqueda, temperatura, solo activos)
- **Detalle** de cada producto
- **Crear y editar** productos mediante formulario
- **Eliminar** (desactiva el producto en la BD)
- **Perfil de usuario** con opción de cerrar sesión

---

## 🌐 Conexión con el backend

El frontend se comunica con la API REST a través de `HttpClient`. La URL base se configura en el environment:

```typescript
// environment.ts
apiUrl: 'http://localhost:8000'
```

La respuesta del backend tiene el formato `{ ok: boolean, result: T }`, que el servicio mapea:

```typescript
this.http.get<ApiResponse<BubbleTea[]>>(this.baseUrl).pipe(
  map(res => res.result)
)
```

---

## 🛣️ Rutas

| Ruta | Componente | Protegida |
|---|---|---|
| `/auth/login` | LoginComponent | No |
| `/auth/register` | RegisterComponent | No |
| `/bubbleteas` | BubbleTeaListComponent | ✅ Sí |
| `/bubbleteas/new` | BubbleTeaFormComponent | ✅ Sí |
| `/bubbleteas/:id` | BubbleTeaDetailComponent | ✅ Sí |
| `/bubbleteas/:id/edit` | BubbleTeaFormComponent | ✅ Sí |
| `/profile` | UserProfileComponent | ✅ Sí |