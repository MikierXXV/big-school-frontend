# Health Care Suite — Frontend

SPA (Single Page Application) para la plataforma de gestión hospitalaria Health Care Suite. Construida con **Vue 3**, **TypeScript** y **Pinia**, siguiendo Clean Architecture en 5 capas.

## Stack tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | Vue 3 (Composition API) |
| Lenguaje | TypeScript 5 |
| State management | Pinia |
| Routing | Vue Router 4 |
| Build tool | Vite |
| CSS | Tailwind CSS |
| HTTP Client | Axios |
| i18n | vue-i18n (es / en / ca) |
| UI headless | Headless UI |
| Testing | Vitest + Playwright |

## Requisitos previos

- **Node.js** ≥ 20
- **Git**
- El **backend** corriendo en local para usar la app completa (ver [../backend/README.md](../backend/README.md))

## Setup local

```bash
# 1. Entrar al directorio
cd frontend

# 2. Crear archivo de variables de entorno local
echo "VITE_API_BASE_URL=http://localhost:3000" > .env.local

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La app arranca en **http://localhost:5173**.

> **Nota:** asegúrate de que el backend esté corriendo en `localhost:3000` antes de usar la aplicación. Vite incluye un proxy configurado para redirigir las peticiones durante el desarrollo.

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con hot reload en `localhost:5173` |
| `npm run build` | Build de producción (`dist/`) |
| `npm run preview` | Preview del build de producción |
| `npm run typecheck` | Verificar tipos sin compilar |
| `npm run lint` | Linting con ESLint |
| `npm test` | Tests unitarios en modo watch |
| `npm run test:unit` | Tests unitarios (una pasada) |
| `npm run test:coverage` | Tests con informe de cobertura (umbral: 80%) |
| `npm run test:e2e` | Tests E2E con Playwright |

## Testing

```bash
# Tests unitarios (modo watch)
npm test

# Tests unitarios (una pasada)
npm run test:unit

# Cobertura
npm run test:coverage

# E2E (requiere backend y frontend corriendo)
npm run test:e2e
```

## Estructura del proyecto

Clean Architecture en 5 capas con la regla de dependencia apuntando hacia adentro:

| Capa | Carpeta | Contenido |
|------|---------|-----------|
| **Domain** | `src/domain/` | Entidades, Value Objects, interfaces de repositorios, errores de dominio |
| **Application** | `src/application/` | 31 casos de uso, DTOs, puertos (`IHttpClient`, `IStorageService`) |
| **Infrastructure** | `src/infrastructure/` | Repositorios HTTP (Axios), localStorage, i18n, Sentry, contenedor DI |
| **Presentation** | `src/presentation/` | 24 Views, 33+ Components, 7 Stores Pinia, Router, Composables |
| **Shared** | `src/shared/` | Constantes de API/rutas, utilidades de validación, tipos comunes |

El **DI Container** (`src/infrastructure/di/container.ts`) es el único punto de ensamblaje: instancia repositorios, use cases y conecta todas las dependencias.

## Características

- Registro, login y verificación de email
- Recuperación de contraseña
- OAuth2 con Google y Microsoft
- Panel de administración (usuarios, organizaciones, permisos)
- RBAC con 3 niveles: USER / ADMIN / SUPER_ADMIN; permisos de admin persistidos en PostgreSQL
- Vista de analíticas dual: Super Admin ve datos globales; Admin con `view_all_data` ve sus organizaciones y distribución de miembros
- Gestión de organizaciones sanitarias y membresías
- Soporte multiidioma: **Español**, **Inglés**, **Catalán**
- Modo oscuro / claro (dark mode)

## Producción

El frontend está desplegado en **Vercel Hobby**:
`https://health-care-suite-frontend.vercel.app`

Ver [docs/PROJECT.md — Sección 19](docs/PROJECT.md) para detalles del entorno de producción, limitaciones del free tier y variables de entorno requeridas.

## Documentación adicional

| Documento | Contenido |
|-----------|-----------|
| [docs/PROJECT.md](docs/PROJECT.md) | Referencia completa: capas, stores, views, componentes, i18n, testing, producción |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Diagramas de arquitectura, estructura de carpetas, convenciones y decisiones de diseño |
