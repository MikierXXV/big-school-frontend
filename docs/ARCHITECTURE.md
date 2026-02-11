# Big School Frontend - Arquitectura

## Tabla de Contenidos

- [Resumen del Proyecto](#resumen-del-proyecto)
- [Principios Arquitecturales](#principios-arquitecturales)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Capas Arquitectónicas](#capas-arquitectónicas)
- [Convenciones y Patrones](#convenciones-y-patrones)
- [Configuración](#configuración)
- [Testing](#testing)
- [Comandos Disponibles](#comandos-disponibles)
- [Path Aliases](#path-aliases)
- [Próximos Pasos](#próximos-pasos)

---

## Resumen del Proyecto

**Big School Frontend** es una aplicación Vue 3 construida con **Clean Architecture**, **Domain-Driven Design (DDD)** y **Test-Driven Development (TDD)**.

Este frontend consume el backend Big School (ubicado en `../backend`) y sigue los mismos principios arquitecturales para mantener consistencia en todo el proyecto.

### Características Principales

- ✅ **Clean Architecture**: Separación clara de responsabilidades en 5 capas
- ✅ **DDD**: Modelado del dominio con Entities, Value Objects, y Repository Interfaces
- ✅ **TDD**: Testing desde el inicio con Vitest y Playwright
- ✅ **TypeScript Strict**: Tipado fuerte en toda la aplicación
- ✅ **Internacionalización**: Soporte multi-idioma (es/en) con vue-i18n
- ✅ **State Management**: Pinia con composition API
- ✅ **Routing**: Vue Router con guards de autenticación
- ✅ **Styling**: Tailwind CSS con tema personalizado

---

## Principios Arquitecturales

### 1. Clean Architecture

La aplicación está organizada en **5 capas concéntricas** donde las dependencias apuntan **siempre hacia adentro**:

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTATION                      │
│         (Components, Views, Stores, Router)         │
├─────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE                     │
│      (HTTP, Repositories, Storage, i18n, Sentry)    │
├─────────────────────────────────────────────────────┤
│                   APPLICATION                       │
│          (Use Cases, DTOs, Ports, Mappers)          │
├─────────────────────────────────────────────────────┤
│                     DOMAIN                          │
│    (Entities, Value Objects, Repository Interfaces) │
├─────────────────────────────────────────────────────┤
│                      SHARED                         │
│            (Types, Constants, Utils)                │
└─────────────────────────────────────────────────────┘
```

**Regla de Dependencia**:
- Domain no depende de nadie
- Application solo depende de Domain
- Infrastructure depende de Application y Domain
- Presentation depende de Application, Domain, e Infrastructure
- Shared no depende de nadie (es código compartido puro)

### 2. Hexagonal Architecture (Ports & Adapters)

```
                  ┌─────────────────┐
                  │   Vue Router    │
                  └────────┬────────┘
                           │
                  ┌────────▼────────┐
                  │  Vue Components │  ◄── Driving Adapter
                  └────────┬────────┘
                           │
            ┌──────────────▼──────────────┐
            │                             │
            │    ┌─────────────────┐      │
            │    │    Use Cases    │      │
            │    └────────┬────────┘      │
            │             │               │
            │    ┌────────▼────────┐      │
            │    │     Ports       │      │  ◄── Application Core
            │    │  (Interfaces)   │      │
            │    └────────┬────────┘      │
            │             │               │
            │    ┌────────▼────────┐      │
            │    │     Domain      │      │
            │    └─────────────────┘      │
            │                             │
            └──────────────┬──────────────┘
                           │
                  ┌────────▼────────┐
                  │  HTTP Client    │  ◄── Driven Adapter
                  │  Repositories   │
                  └────────┬────────┘
                           │
                  ┌────────▼────────┐
                  │   Backend API   │
                  └─────────────────┘
```

**Ports**: Interfaces definidas en `src/application/ports/`
- `IHttpClient`: Cliente HTTP
- `IStorageService`: Almacenamiento local
- `ILogger`: Logging

**Adapters**: Implementaciones en `src/infrastructure/`
- `AxiosHttpClient`: Implementa IHttpClient con Axios
- `LocalStorageService`: Implementa IStorageService con localStorage

### 3. Domain-Driven Design

#### Aggregate Root
- **User**: Entidad principal que representa al usuario autenticado

#### Value Objects
Objetos inmutables que representan conceptos del dominio:
- `UserId`: Identificador único (UUID)
- `Email`: Email validado y normalizado

#### Repository Interfaces
Contratos para acceso a datos (definidos en Domain, implementados en Infrastructure):
- `IAuthRepository`: Login, Register, Logout, RefreshToken
- `IUserRepository`: Obtener perfil de usuario

#### Domain Errors
Errores específicos del dominio:
- `InvalidCredentialsError`
- `EmailAlreadyExistsError`
- `TokenExpiredError`
- `UnauthorizedError`

---

## Stack Tecnológico

| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|-----------|
| **Framework** | Vue 3 | ^3.5 | Framework reactivo con Composition API |
| **Build Tool** | Vite | ^7.3 | Build tool rápido y moderno |
| **Lenguaje** | TypeScript | ~5.9 | Tipado estático |
| **Routing** | Vue Router | ^4.2 | Navegación SPA |
| **State** | Pinia | ^2.1 | State management |
| **i18n** | vue-i18n | ^9.9 | Internacionalización |
| **HTTP** | Axios | ^1.6 | Cliente HTTP |
| **UI Utilities** | @vueuse/core | ^10.7 | Composables útiles |
| **UI Headless** | @headlessui/vue | ^1.7 | Componentes accesibles sin estilos |
| **Icons** | @heroicons/vue | ^2.1 | Iconos SVG |
| **Styling** | Tailwind CSS | ^3.4 | Utility-first CSS |
| **Monitoring** | Sentry | ^7.91 | Error tracking |
| **Tests Unit** | Vitest | ^1.0 | Testing framework |
| **Tests E2E** | Playwright | ^1.40 | Browser automation |
| **Linting** | ESLint | ^8.55 | Linter JavaScript/TypeScript |
| **Formatting** | Prettier | ^3.1 | Code formatter |

---

## Estructura del Proyecto

```
frontend/
├── docs/                           # Documentación del proyecto
│   └── ARCHITECTURE.md            # Este documento
│
├── public/                         # Archivos estáticos
│   └── vite.svg
│
├── src/                           # Código fuente
│   │
│   ├── domain/                    # CAPA 1: Dominio
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   └── index.ts
│   │   ├── value-objects/
│   │   │   ├── email.value-object.ts
│   │   │   ├── user-id.value-object.ts
│   │   │   └── index.ts
│   │   ├── repositories/
│   │   │   ├── auth.repository.interface.ts
│   │   │   ├── user.repository.interface.ts
│   │   │   └── index.ts
│   │   ├── errors/
│   │   │   ├── domain-error.base.ts
│   │   │   ├── auth.errors.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── application/               # CAPA 2: Aplicación
│   │   ├── use-cases/
│   │   │   └── auth/
│   │   │       ├── login.use-case.ts
│   │   │       ├── register.use-case.ts
│   │   │       ├── logout.use-case.ts
│   │   │       └── index.ts
│   │   ├── dtos/
│   │   │   └── auth/
│   │   │       ├── login.dto.ts
│   │   │       ├── register.dto.ts
│   │   │       └── index.ts
│   │   ├── mappers/
│   │   │   ├── user.mapper.ts
│   │   │   └── index.ts
│   │   ├── ports/
│   │   │   ├── http-client.port.ts
│   │   │   ├── storage.port.ts
│   │   │   ├── logger.port.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── infrastructure/            # CAPA 3: Infraestructura
│   │   ├── http/
│   │   │   ├── axios-http-client.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── repositories/
│   │   │   ├── http-auth.repository.ts
│   │   │   ├── http-user.repository.ts
│   │   │   └── index.ts
│   │   ├── storage/
│   │   │   ├── local-storage.service.ts
│   │   │   └── index.ts
│   │   ├── sentry/
│   │   │   ├── sentry.config.ts
│   │   │   └── index.ts
│   │   ├── i18n/
│   │   │   ├── i18n.config.ts
│   │   │   ├── locales/
│   │   │   │   ├── es.json
│   │   │   │   ├── en.json
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   └── main.css
│   │   └── index.ts
│   │
│   ├── presentation/              # CAPA 4: Presentación
│   │   ├── components/
│   │   │   ├── ui/                # Componentes base
│   │   │   │   ├── BaseButton.vue
│   │   │   │   ├── BaseInput.vue
│   │   │   │   ├── BaseCard.vue
│   │   │   │   ├── BaseModal.vue
│   │   │   │   └── index.ts
│   │   │   ├── layout/            # Layout de la app
│   │   │   │   ├── AppHeader.vue
│   │   │   │   ├── AppFooter.vue
│   │   │   │   ├── AppSidebar.vue
│   │   │   │   └── index.ts
│   │   │   ├── auth/              # Componentes de auth
│   │   │   │   ├── LoginForm.vue
│   │   │   │   ├── RegisterForm.vue
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── views/                 # Páginas/Vistas
│   │   │   ├── auth/
│   │   │   │   ├── LoginView.vue
│   │   │   │   ├── RegisterView.vue
│   │   │   │   ├── ForgotPasswordView.vue
│   │   │   │   └── index.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardView.vue
│   │   │   │   └── index.ts
│   │   │   ├── HomeView.vue
│   │   │   ├── NotFoundView.vue
│   │   │   └── index.ts
│   │   ├── composables/           # Lógica reutilizable
│   │   │   ├── useAuth.ts
│   │   │   ├── useForm.ts
│   │   │   ├── useNotification.ts
│   │   │   └── index.ts
│   │   ├── stores/                # Pinia stores
│   │   │   ├── auth.store.ts
│   │   │   ├── user.store.ts
│   │   │   └── index.ts
│   │   ├── router/                # Vue Router
│   │   │   ├── routes.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── shared/                    # CAPA 5: Compartido
│   │   ├── types/
│   │   │   ├── api.types.ts
│   │   │   ├── common.types.ts
│   │   │   └── index.ts
│   │   ├── constants/
│   │   │   ├── api.constants.ts
│   │   │   ├── routes.constants.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── validation.utils.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── App.vue                    # Componente raíz
│   └── main.ts                    # Entry point
│
├── tests/                         # Tests
│   ├── unit/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── value-objects/
│   │   │       └── email.value-object.test.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   └── presentation/
│   │       ├── components/
│   │       │   └── ui/
│   │       │       └── BaseButton.test.ts
│   │       └── composables/
│   │           └── useAuth.test.ts
│   ├── integration/
│   │   └── stores/
│   │       └── auth.store.test.ts
│   └── e2e/
│       ├── auth/
│       │   └── login.e2e.ts
│       └── helpers/
│           ├── test-data.helper.ts
│           └── api.helper.ts
│
├── .env.example                   # Variables de entorno ejemplo
├── .gitignore
├── .eslintrc.cjs                  # Configuración ESLint
├── .prettierrc                    # Configuración Prettier
├── index.html                     # HTML principal
├── package.json
├── tsconfig.json                  # Config TS principal
├── tsconfig.app.json              # Config TS para app
├── tsconfig.node.json             # Config TS para Node
├── vite.config.ts                 # Configuración Vite
├── vitest.config.ts               # Configuración Vitest
├── playwright.config.ts           # Configuración Playwright
├── tailwind.config.js             # Configuración Tailwind
└── postcss.config.js              # Configuración PostCSS
```

---

## Capas Arquitectónicas

### 1. Domain (`src/domain/`)

**Responsabilidad**: Lógica de negocio pura, independiente de frameworks

**Contiene**:
- **Entities**: Objetos con identidad única (User)
- **Value Objects**: Objetos inmutables sin identidad (Email, UserId)
- **Repository Interfaces**: Contratos para acceso a datos
- **Domain Errors**: Errores específicos del dominio

**Reglas**:
- ❌ NO puede depender de otras capas
- ❌ NO conoce Vue, HTTP, o almacenamiento
- ✅ Solo contiene lógica de negocio pura
- ✅ Usa TypeScript puro (sin dependencias externas)

**Ejemplo**:
```typescript
// src/domain/value-objects/email.value-object.ts
export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Email {
    // Validación de negocio
    const normalized = value.toLowerCase().trim();
    return new Email(normalized);
  }

  public get value(): string {
    return this._value;
  }
}
```

### 2. Application (`src/application/`)

**Responsabilidad**: Orquestación de casos de uso y coordinación de flujos

**Contiene**:
- **Use Cases**: Lógica de aplicación (Login, Register, Logout)
- **DTOs**: Objetos de transferencia de datos
- **Ports**: Interfaces para servicios externos (IHttpClient, IStorageService)
- **Mappers**: Transformadores entre capas

**Reglas**:
- ✅ Depende solo de Domain
- ❌ NO conoce detalles de implementación (Axios, localStorage, Vue)
- ✅ Define interfaces (Ports) que Infrastructure implementará
- ✅ Orquesta el flujo de negocio

**Ejemplo**:
```typescript
// src/application/use-cases/auth/login.use-case.ts
export class LoginUseCase {
  constructor(private readonly deps: {
    authRepository: IAuthRepository; // Port
  }) {}

  async execute(dto: LoginDTO): Promise<LoginResult> {
    // Orquestación del flujo de login
    const { user, tokens } = await this.deps.authRepository.login({
      email: dto.email,
      password: dto.password,
    });
    return { user, tokens };
  }
}
```

### 3. Infrastructure (`src/infrastructure/`)

**Responsabilidad**: Implementaciones concretas de Ports y acceso a recursos externos

**Contiene**:
- **HTTP**: Cliente Axios con interceptors
- **Repositories**: Implementaciones HTTP de repositorios
- **Storage**: LocalStorage service
- **i18n**: Configuración de internacionalización
- **Sentry**: Configuración de monitoreo
- **Styles**: Estilos globales (Tailwind)

**Reglas**:
- ✅ Implementa los Ports definidos en Application
- ✅ Conoce tecnologías específicas (Axios, localStorage)
- ✅ Depende de Application y Domain

**Ejemplo**:
```typescript
// src/infrastructure/http/axios-http-client.ts
export class AxiosHttpClient implements IHttpClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });
  }

  async get<T>(url: string): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.get<T>(url);
    return { data: response.data, status: response.status };
  }
}
```

### 4. Presentation (`src/presentation/`)

**Responsabilidad**: Interfaz de usuario Vue 3

**Contiene**:
- **Components**: Componentes Vue reutilizables (UI, Layout, Auth)
- **Views**: Páginas de la aplicación
- **Composables**: Lógica reactiva reutilizable
- **Stores**: Estado global con Pinia
- **Router**: Configuración de rutas y guards

**Reglas**:
- ✅ Usa Composition API de Vue 3
- ✅ Consume Use Cases de Application
- ✅ Usa Stores (Pinia) para estado global
- ✅ Componentes tontos (UI) vs inteligentes (conectados a stores)

**Ejemplo**:
```typescript
// src/presentation/composables/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = storeToRefs(authStore);

  return {
    user,
    isAuthenticated,
    login: authStore.login,
    logout: authStore.logout,
  };
}
```

### 5. Shared (`src/shared/`)

**Responsabilidad**: Código compartido entre todas las capas

**Contiene**:
- **Types**: Tipos TypeScript compartidos
- **Constants**: Constantes de configuración (API endpoints, rutas)
- **Utils**: Utilidades puras sin dependencias

**Reglas**:
- ❌ NO depende de ninguna capa
- ✅ Solo código puro reutilizable
- ✅ Sin lógica de negocio

---

## Convenciones y Patrones

### Nomenclatura de Archivos

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Componentes Vue | `PascalCase.vue` | `BaseButton.vue` |
| TypeScript | `kebab-case.ts` | `user.entity.ts` |
| Tests | `[nombre].test.ts` | `email.value-object.test.ts` |
| E2E Tests | `[nombre].e2e.ts` | `login.e2e.ts` |
| Barrel Exports | `index.ts` | Cada carpeta tiene su `index.ts` |

### Barrel Exports

Cada carpeta tiene un `index.ts` que exporta todos sus módulos:

```typescript
// src/domain/value-objects/index.ts
export * from './email.value-object.js';
export * from './user-id.value-object.js';
```

Esto permite importaciones limpias:
```typescript
import { Email, UserId } from '@domain/value-objects';
```

### Comentarios en Archivos

Todos los archivos siguen este formato de comentarios:

```typescript
/**
 * ============================================
 * [TIPO]: [Nombre]
 * ============================================
 *
 * [Descripción del propósito]
 *
 * [Detalles adicionales]
 *
 * TODO: [Tareas pendientes]
 */
```

### Extensiones de Archivos

Se usa `.js` en imports para compatibilidad con ESM:

```typescript
// ✅ Correcto
import { Email } from './email.value-object.js';

// ❌ Incorrecto
import { Email } from './email.value-object';
```

---

## Configuración

### Variables de Entorno

Crear `.env` basado en `.env.example`:

```env
# API Backend
VITE_API_BASE_URL=http://localhost:3000

# Sentry (production)
VITE_SENTRY_DSN=

# App Config
VITE_APP_NAME=Big School
VITE_APP_DEFAULT_LOCALE=es
```

### TypeScript Configuration

**tsconfig.app.json** - Configuración principal con:
- Strict mode completo
- Path aliases (@domain, @application, etc.)
- ESNext target

### Tailwind Configuration

**tailwind.config.js** - Tema personalizado:
- Colores primary (blue)
- Font: Inter
- Content: todos los archivos `.vue`, `.ts`, `.tsx`

---

## Testing

### Estrategia de Testing (TDD)

```
                    ┌─────────────┐
                    │   E2E Tests │  (Playwright)
                    │  Full Flow  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Integration │  (Vitest)
                    │    Tests    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Unit Tests  │  (Vitest)
                    │  (Isolated) │
                    └─────────────┘
```

### Unit Tests

**Ubicación**: `tests/unit/`

**Propósito**: Probar unidades aisladas (Value Objects, Use Cases, Composables)

**Framework**: Vitest + @vue/test-utils

**Ejemplo**:
```typescript
// tests/unit/domain/value-objects/email.value-object.test.ts
describe('Email Value Object', () => {
  it('should normalize email to lowercase', () => {
    const email = Email.create('USER@EXAMPLE.COM');
    expect(email.value).toBe('user@example.com');
  });
});
```

### Integration Tests

**Ubicación**: `tests/integration/`

**Propósito**: Probar integración entre capas (Stores + Use Cases)

**Framework**: Vitest + Pinia

**Ejemplo**:
```typescript
// tests/integration/stores/auth.store.test.ts
describe('Auth Store', () => {
  it('should initialize with null user', () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
  });
});
```

### E2E Tests

**Ubicación**: `tests/e2e/`

**Propósito**: Probar flujos completos de usuario en el browser

**Framework**: Playwright

**Ejemplo**:
```typescript
// tests/e2e/auth/login.e2e.ts
test('should display login form', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});
```

### Coverage

Ejecutar con coverage:
```bash
npm run test:coverage
```

Thresholds configurados en `vitest.config.ts`:
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

---

## Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (http://localhost:5173)
npm run build            # Build de producción
npm run preview          # Preview del build

# TypeScript
npm run typecheck        # Verificar tipos sin compilar

# Linting y Formatting
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Ejecutar ESLint y arreglar automáticamente
npm run format           # Formatear con Prettier

# Testing
npm test                 # Tests en watch mode
npm run test:unit        # Tests unitarios
npm run test:integration # Tests de integración
npm run test:e2e         # Tests E2E con Playwright
npm run test:coverage    # Tests con coverage
```

---

## Path Aliases

Configurados en `tsconfig.app.json` y `vite.config.ts`:

| Alias | Ruta | Uso |
|-------|------|-----|
| `@domain/*` | `src/domain/*` | Entidades, Value Objects, Interfaces de repositorios |
| `@application/*` | `src/application/*` | Use Cases, DTOs, Ports |
| `@infrastructure/*` | `src/infrastructure/*` | Implementaciones HTTP, Storage, i18n |
| `@presentation/*` | `src/presentation/*` | Componentes, Views, Stores, Router |
| `@shared/*` | `src/shared/*` | Types, Constants, Utils |

**Ejemplo de uso**:
```typescript
import { Email } from '@domain/value-objects';
import { LoginUseCase } from '@application/use-cases/auth';
import { useAuth } from '@presentation/composables';
import { API_ENDPOINTS } from '@shared/constants';
```

---

## Próximos Pasos

### Fase 1: Implementación de Domain Layer

1. **Value Objects** con validación completa:
   - [ ] Email (validar formato, normalizar)
   - [ ] UserId (validar UUID)

2. **Entities**:
   - [ ] User (factory methods, getters)

3. **Tests**:
   - [ ] Unit tests para cada Value Object
   - [ ] Unit tests para User Entity

### Fase 2: Implementación de Infrastructure Layer

1. **HTTP Client**:
   - [ ] AxiosHttpClient completo
   - [ ] Auth Interceptor (agregar access token)
   - [ ] Error Interceptor (manejo de errores HTTP)

2. **Repositories**:
   - [ ] HttpAuthRepository (login, register, logout, refresh)
   - [ ] HttpUserRepository (getCurrentUser)

3. **Tests**:
   - [ ] Integration tests para repositories con mock de Axios

### Fase 3: Implementación de Application Layer

1. **Use Cases**:
   - [ ] LoginUseCase
   - [ ] RegisterUseCase
   - [ ] LogoutUseCase

2. **Mappers**:
   - [ ] UserMapper (API response → Domain Entity)

3. **Tests**:
   - [ ] Unit tests para cada Use Case con mocks

### Fase 4: Implementación de Presentation Layer

1. **Stores (Pinia)**:
   - [ ] AuthStore completo (conectado a Use Cases)
   - [ ] UserStore

2. **Componentes UI**:
   - [ ] BaseButton completo con variantes
   - [ ] BaseInput con validación
   - [ ] BaseCard
   - [ ] BaseModal con @headlessui/vue

3. **Forms**:
   - [ ] LoginForm conectado a AuthStore
   - [ ] RegisterForm

4. **Views**:
   - [ ] LoginView
   - [ ] RegisterView
   - [ ] DashboardView

5. **Router**:
   - [ ] Guards de autenticación funcionando

6. **Tests**:
   - [ ] Component tests para cada componente
   - [ ] E2E tests para flujos de auth

### Fase 5: Internacionalización y Monitoring

1. **i18n**:
   - [ ] Completar traducciones es/en
   - [ ] Implementar switch de idioma

2. **Sentry**:
   - [ ] Configurar Sentry con DSN de producción
   - [ ] Agregar contexto de usuario

---

## Recursos Adicionales

### Documentación de Referencia

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

### Clean Architecture

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)

---

**Última actualización**: Febrero 2026

**Mantenido por**: Equipo Big School
