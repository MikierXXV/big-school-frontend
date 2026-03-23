# Big School Frontend - Arquitectura

## Tabla de Contenidos

- [Resumen del Proyecto](#resumen-del-proyecto)
- [Principios Arquitecturales](#principios-arquitecturales)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Capas Arquitectónicas](#capas-arquitectónicas)
- [OAuth2](#oauth2)
- [RBAC](#rbac)
- [Temas e Internacionalización](#temas-e-internacionalización)
- [Error Handling](#error-handling)
- [Convenciones y Patrones](#convenciones-y-patrones)
- [Configuración](#configuración)
- [Testing](#testing)
- [Comandos Disponibles](#comandos-disponibles)
- [Path Aliases](#path-aliases)

---

## Resumen del Proyecto

**Big School Frontend** es una aplicación Vue 3 construida con **Clean Architecture**, **Domain-Driven Design (DDD)** y **Test-Driven Development (TDD)**.

Este frontend consume el backend Big School (ubicado en `../backend`) y sigue los mismos principios arquitecturales para mantener consistencia en todo el proyecto.

### Características Principales

- **Clean Architecture**: Separación clara de responsabilidades en 5 capas
- **DDD**: Modelado del dominio con Entities, Value Objects, y Repository Interfaces
- **TDD**: Testing desde el inicio con Vitest y Playwright
- **TypeScript Strict**: Tipado fuerte en toda la aplicación
- **Internacionalización**: Soporte multi-idioma (es/en/ca) con vue-i18n
- **State Management**: Pinia con composition API
- **Routing**: Vue Router con guards de autenticación y RBAC
- **Styling**: Tailwind CSS con tema personalizado
- **OAuth2**: Login con Google y Microsoft
- **RBAC**: Control de acceso basado en roles y permisos
- **Temas**: Modo claro/oscuro persistente

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
- `Password`: Contraseña con validación de complejidad
- `AccessToken`: Token de acceso JWT
- `RefreshToken`: Token de refresco
- `UserStatus`: Estado del usuario (ACTIVE, INACTIVE, PENDING_VERIFICATION)

#### Repository Interfaces
Contratos para acceso a datos (definidos en Domain, implementados en Infrastructure):
- `IAuthRepository`: Login, Register, Logout, RefreshToken, OAuth
- `IUserRepository`: Obtener perfil de usuario
- `IOrganizationRepository`: CRUD de organizaciones
- `IMembershipRepository`: Gestión de membresías
- `IAdminRepository`: Gestión de admins, permisos, usuarios

#### Domain Errors
Errores específicos del dominio (`src/domain/errors/auth.errors.ts`):
- `InvalidCredentialsError`
- `EmailAlreadyExistsError`
- `TokenExpiredError`
- `UnauthorizedError`
- `ForbiddenError`
- `UserNotFoundError`
- `OrganizationNotFoundError`

---

## Stack Tecnológico

| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|-----------||
| **Framework** | Vue 3 | ^3.5 | Framework reactivo con Composition API |
| **Build Tool** | Vite | ^7.3 | Build tool rápido y moderno |
| **Lenguaje** | TypeScript | ~5.9 | Tipado estático |
| **Routing** | Vue Router | ^4.2 | Navegación SPA |
| **State** | Pinia | ^2.1 | State management |
| **i18n** | vue-i18n | ^9.9 | Internacionalización (es/en/ca) |
| **HTTP** | Axios | ^1.6 | Cliente HTTP |
| **UI Utilities** | @vueuse/core | ^10.7 | Composables útiles |
| **UI Headless** | @headlessui/vue | ^1.7 | Componentes accesibles sin estilos |
| **Icons** | @heroicons/vue | ^2.1 | Iconos SVG |
| **Styling** | Tailwind CSS | ^3.4 | Utility-first CSS |
| **Charts** | Chart.js + vue-chartjs | ^4.5 / ^5.3 | Gráficos y analytics |
| **Monitoring** | @sentry/vue | ^7.91 | Error tracking |
| **Tests Unit** | Vitest | ^1.0 | Testing framework |
| **Tests E2E** | Playwright | ^1.40 | Browser automation |
| **Linting** | ESLint | ^8.55 | Linter JavaScript/TypeScript |
| **Formatting** | Prettier | ^3.1 | Code formatter |

---

## Estructura del Proyecto

```
frontend/
├── docs/                           # Documentación del proyecto
│   ├── ARCHITECTURE.md            # Este documento
│   └── PROJECT.md                 # Resumen completo del proyecto
│
├── public/                         # Archivos estáticos
│
├── src/
│   ├── domain/                    # CAPA 1: Dominio
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   └── index.ts
│   │   ├── value-objects/
│   │   │   ├── user-id.value-object.ts
│   │   │   ├── email.value-object.ts
│   │   │   ├── password.value-object.ts
│   │   │   ├── access-token.value-object.ts
│   │   │   ├── refresh-token.value-object.ts
│   │   │   ├── user-status.value-object.ts
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
│   │   │   ├── auth/
│   │   │   │   ├── login.use-case.ts
│   │   │   │   ├── register.use-case.ts
│   │   │   │   ├── logout.use-case.ts
│   │   │   │   ├── refresh-session.use-case.ts
│   │   │   │   ├── verify-email.use-case.ts
│   │   │   │   ├── request-password-reset.use-case.ts
│   │   │   │   ├── confirm-password-reset.use-case.ts
│   │   │   │   ├── oauth-login.use-case.ts
│   │   │   │   └── index.ts
│   │   │   ├── admin/
│   │   │   │   ├── list-admins.use-case.ts
│   │   │   │   ├── promote-admin.use-case.ts
│   │   │   │   ├── demote-admin.use-case.ts
│   │   │   │   ├── grant-permissions.use-case.ts
│   │   │   │   ├── revoke-permission.use-case.ts
│   │   │   │   ├── get-admin-permissions.use-case.ts
│   │   │   │   ├── get-my-permissions.use-case.ts
│   │   │   │   ├── list-users.use-case.ts
│   │   │   │   ├── update-user-status.use-case.ts
│   │   │   │   ├── delete-user.use-case.ts
│   │   │   │   ├── hard-delete-user.use-case.ts
│   │   │   │   └── get-user-stats.use-case.ts
│   │   │   ├── organization/
│   │   │   │   ├── create-organization.use-case.ts
│   │   │   │   ├── get-organization.use-case.ts
│   │   │   │   ├── list-organizations.use-case.ts
│   │   │   │   ├── update-organization.use-case.ts
│   │   │   │   ├── delete-organization.use-case.ts
│   │   │   │   └── hard-delete-organization.use-case.ts
│   │   │   ├── membership/
│   │   │   │   ├── assign-member.use-case.ts
│   │   │   │   ├── change-member-role.use-case.ts
│   │   │   │   ├── list-members.use-case.ts
│   │   │   │   ├── get-user-organizations.use-case.ts
│   │   │   │   └── remove-member.use-case.ts
│   │   │   └── index.ts
│   │   ├── dtos/
│   │   │   ├── auth/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── refresh.dto.ts
│   │   │   │   ├── verify-email.dto.ts
│   │   │   │   ├── request-password-reset.dto.ts
│   │   │   │   ├── confirm-password-reset.dto.ts
│   │   │   │   └── index.ts
│   │   │   ├── admin/
│   │   │   │   └── admin.dto.ts
│   │   │   ├── organization/
│   │   │   │   ├── organization.dto.ts
│   │   │   │   └── membership.dto.ts
│   │   │   ├── user.dto.ts
│   │   │   └── index.ts
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
│   │   │   ├── utils/
│   │   │   │   └── error-mapper.util.ts
│   │   │   └── index.ts
│   │   ├── repositories/
│   │   │   ├── http-auth.repository.ts
│   │   │   ├── http-user.repository.ts
│   │   │   ├── http-organization.repository.ts
│   │   │   ├── http-membership.repository.ts
│   │   │   ├── http-admin.repository.ts
│   │   │   └── index.ts
│   │   ├── storage/
│   │   │   ├── local-storage.service.ts
│   │   │   └── index.ts
│   │   ├── i18n/
│   │   │   ├── i18n.config.ts
│   │   │   ├── locales/
│   │   │   │   ├── es.json
│   │   │   │   ├── en.json
│   │   │   │   ├── ca.json
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── sentry/
│   │   │   ├── sentry.config.ts
│   │   │   ├── sentry.service.ts
│   │   │   └── index.ts
│   │   ├── di/
│   │   │   └── container.ts
│   │   └── index.ts
│   │
│   ├── presentation/              # CAPA 4: Presentación
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── BaseButton.vue
│   │   │   │   ├── BaseInput.vue
│   │   │   │   ├── BaseSelect.vue
│   │   │   │   ├── BaseCard.vue
│   │   │   │   ├── BaseModal.vue
│   │   │   │   ├── BaseAlert.vue
│   │   │   │   ├── BaseBadge.vue
│   │   │   │   ├── BaseSkeleton.vue
│   │   │   │   ├── BaseSpinner.vue
│   │   │   │   ├── BaseToast.vue
│   │   │   │   ├── BaseToggleSwitch.vue
│   │   │   │   ├── BasePagination.vue
│   │   │   │   ├── ConfirmDialog.vue
│   │   │   │   ├── PasswordStrengthMeter.vue
│   │   │   │   ├── LanguageSelector.vue
│   │   │   │   ├── ThemeToggle.vue
│   │   │   │   └── index.ts
│   │   │   ├── layout/
│   │   │   │   ├── AppHeader.vue
│   │   │   │   ├── AppFooter.vue
│   │   │   │   ├── AppSidebar.vue
│   │   │   │   ├── DashboardLayout.vue
│   │   │   │   ├── AdminLayout.vue
│   │   │   │   ├── AdminSidebar.vue
│   │   │   │   └── index.ts
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.vue
│   │   │   │   ├── RegisterForm.vue
│   │   │   │   ├── ForgotPasswordForm.vue
│   │   │   │   ├── ResetPasswordForm.vue
│   │   │   │   ├── OAuthButton.vue
│   │   │   │   └── index.ts
│   │   │   ├── admin/
│   │   │   │   ├── OrganizationFormModal.vue
│   │   │   │   ├── PromoteUserModal.vue
│   │   │   │   └── AssignMemberModal.vue
│   │   │   ├── dashboard/
│   │   │   │   └── OrganizationCard.vue
│   │   │   ├── footer/
│   │   │   │   ├── AboutModal.vue
│   │   │   │   ├── ContactModal.vue
│   │   │   │   ├── PrivacyPolicyModal.vue
│   │   │   │   └── TermsOfServiceModal.vue
│   │   │   ├── NotificationContainer.vue
│   │   │   └── index.ts
│   │   ├── views/
│   │   │   ├── HomeView.vue
│   │   │   ├── NotFoundView.vue
│   │   │   ├── ForbiddenView.vue
│   │   │   ├── auth/
│   │   │   │   ├── LoginView.vue
│   │   │   │   ├── RegisterView.vue
│   │   │   │   ├── ForgotPasswordView.vue
│   │   │   │   ├── ResetPasswordView.vue
│   │   │   │   ├── VerifyEmailView.vue
│   │   │   │   ├── OAuthCallbackView.vue
│   │   │   │   └── index.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardView.vue
│   │   │   │   ├── UserProfileView.vue
│   │   │   │   ├── UserSettingsView.vue
│   │   │   │   ├── MyOrganizationsView.vue
│   │   │   │   ├── DataAnalyticsView.vue
│   │   │   │   ├── EmergencyView.vue
│   │   │   │   ├── LabelPrintingView.vue
│   │   │   │   ├── SurgicalBlockView.vue
│   │   │   │   ├── WristbandPrintingView.vue
│   │   │   │   └── index.ts
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardView.vue
│   │   │   │   ├── AdminUserListView.vue
│   │   │   │   ├── AdminPermissionsView.vue
│   │   │   │   ├── AdminAnalyticsView.vue
│   │   │   │   ├── OrganizationListView.vue
│   │   │   │   └── OrganizationDetailView.vue
│   │   │   └── index.ts
│   │   ├── composables/
│   │   │   ├── useAuth.ts
│   │   │   ├── useRBAC.ts
│   │   │   ├── useForm.ts
│   │   │   ├── useNotification.ts
│   │   │   ├── useTheme.ts
│   │   │   ├── useLocale.ts
│   │   │   ├── useApiError.ts
│   │   │   ├── usePasswordStrength.ts
│   │   │   └── index.ts
│   │   ├── stores/
│   │   │   ├── auth.store.ts
│   │   │   ├── user.store.ts
│   │   │   ├── rbac.store.ts
│   │   │   ├── admin.store.ts
│   │   │   ├── organization.store.ts
│   │   │   ├── notification.store.ts
│   │   │   ├── theme.store.ts
│   │   │   └── index.ts
│   │   ├── router/
│   │   │   ├── routes.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── rbac.guard.ts
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
│   │   │   ├── design-tokens.constants.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── validation.utils.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── App.vue                    # Componente raíz
│   └── main.ts                    # Entry point
│
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   ├── application/
│   │   └── presentation/
│   ├── integration/
│   │   └── stores/
│   └── e2e/
│       └── auth/
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tailwind.config.js
└── postcss.config.js
```

---

## Capas Arquitectónicas

### 1. Domain (`src/domain/`)

**Responsabilidad**: Lógica de negocio pura, independiente de frameworks

**Contiene**:
- **Entities**: Objetos con identidad única (User)
- **Value Objects**: Objetos inmutables sin identidad
- **Repository Interfaces**: Contratos para acceso a datos
- **Domain Errors**: Errores específicos del dominio

**Reglas**:
- NO puede depender de otras capas
- NO conoce Vue, HTTP, o almacenamiento
- Solo contiene lógica de negocio pura

### 2. Application (`src/application/`)

**Responsabilidad**: Orquestación de casos de uso

**Use Cases — tabla completa (33)**:

| Módulo | Use Case |
|--------|----------|
| auth | `login`, `register`, `logout`, `refresh-session` |
| auth | `verify-email`, `request-password-reset`, `confirm-password-reset`, `oauth-login` |
| admin | `list-admins`, `promote-admin`, `demote-admin` |
| admin | `grant-permissions`, `revoke-permission`, `get-admin-permissions`, `get-my-permissions` |
| admin | `list-users`, `update-user-status`, `delete-user`, `hard-delete-user`, `get-user-stats` |
| organization | `create-organization`, `get-organization`, `list-organizations` |
| organization | `update-organization`, `delete-organization`, `hard-delete-organization` |
| membership | `assign-member`, `change-member-role`, `list-members` |
| membership | `get-user-organizations`, `remove-member` |

**Ports (3)**:
- `IHttpClient`: Cliente HTTP abstracto
- `IStorageService`: Almacenamiento abstracto
- `ILogger`: Logging abstracto

### 3. Infrastructure (`src/infrastructure/`)

**Responsabilidad**: Implementaciones concretas

**HTTP Client** (`axios-http-client.ts`):
- Instancia Axios con baseURL desde `VITE_API_BASE_URL`
- Interceptores: `auth.interceptor` (inyecta Access Token), `error.interceptor` (retry con refresh)
- `error-mapper.util.ts`: traduce AxiosError con código HTTP → DomainError específico

**Repositorios HTTP (5)**:

| Repositorio | Endpoints |
|------------|-----------|
| `HttpAuthRepository` | login, register, logout, refresh, verify-email, reset password, OAuth |
| `HttpUserRepository` | getProfile, updateProfile |
| `HttpOrganizationRepository` | CRUD de organizaciones |
| `HttpMembershipRepository` | asignar, listar, cambiar rol, eliminar miembros |
| `HttpAdminRepository` | usuarios, admins, permisos, estadísticas |

**DI Container** (`infrastructure/di/container.ts`):
Singleton que instancia todos los repositorios y use cases al arrancar la app. Registra los 33 use cases.

**i18n** — 3 locales:
- `es.json`: Español (por defecto)
- `en.json`: English
- `ca.json`: Català

**Sentry** — error tracking en producción (`VITE_SENTRY_DSN`)

### 4. Presentation (`src/presentation/`)

**Stores Pinia (7)**:

| Store | Responsabilidad |
|-------|----------------|
| `auth.store` | Usuario autenticado, tokens, login/logout |
| `user.store` | Perfil del usuario, preferencias |
| `rbac.store` | Roles, permisos, isSuperAdmin, isAdmin |
| `admin.store` | Lista de admins, usuarios, estadísticas |
| `organization.store` | Lista y detalle de organizaciones |
| `notification.store` | Toast/alertas globales |
| `theme.store` | Modo claro/oscuro, persistencia |

**Composables (8)**:

| Composable | Uso |
|-----------|-----|
| `useAuth` | Acceder a estado auth y acciones |
| `useRBAC` | Verificar roles y permisos del usuario |
| `useForm` | Manejo de formularios con validación |
| `useNotification` | Lanzar toasts desde cualquier componente |
| `useTheme` | Toggle dark/light mode |
| `useLocale` | Cambiar idioma de la app |
| `useApiError` | Transformar errores de API en mensajes |
| `usePasswordStrength` | Indicador de fortaleza de contraseña |

**Vistas (25)**:

| Sección | Vista | Acceso |
|---------|-------|--------|
| - | `HomeView` | Pública |
| - | `NotFoundView` | Pública |
| - | `ForbiddenView` | Pública |
| auth | `LoginView` | Pública |
| auth | `RegisterView` | Pública |
| auth | `ForgotPasswordView` | Pública |
| auth | `ResetPasswordView` | Pública |
| auth | `VerifyEmailView` | Pública |
| auth | `OAuthCallbackView` | Pública |
| dashboard | `DashboardView` | Autenticado |
| dashboard | `UserProfileView` | Autenticado |
| dashboard | `UserSettingsView` | Autenticado |
| dashboard | `MyOrganizationsView` | Autenticado |
| dashboard | `DataAnalyticsView` | Autenticado |
| dashboard | `EmergencyView` | Autenticado |
| dashboard | `LabelPrintingView` | Autenticado |
| dashboard | `SurgicalBlockView` | Autenticado |
| dashboard | `WristbandPrintingView` | Autenticado |
| admin | `AdminDashboardView` | Admin |
| admin | `AdminUserListView` | Admin |
| admin | `AdminPermissionsView` | Superadmin |
| admin | `AdminAnalyticsView` | Admin |
| admin | `OrganizationListView` | Admin |
| admin | `OrganizationDetailView` | Admin |

**Router Guards**:
- `auth.guard`: Redirige a `/login` si no autenticado
- `rbac.guard`: Verifica `to.meta.requiresRole` y `to.meta.requiresPermission`

---

## OAuth2

Flujo de login con Google y Microsoft desde el frontend:

```
1. Usuario hace clic en OAuthButton (google|microsoft)
2. Frontend almacena state en sessionStorage (anti-CSRF)
3. Frontend redirige: GET /auth/oauth/initiate?provider=google
4. Backend devuelve URL de autorización del proveedor
5. Usuario se autentica en Google/Microsoft
6. Proveedor redirige a: /auth/oauth/callback?code=...&state=...
7. OAuthCallbackView extrae code + state de la URL
8. Llama a oauth-login.use-case con code + state
9. Backend procesa y devuelve tokens
10. Frontend guarda tokens → redirige al dashboard
```

**Componentes clave**:
- `OAuthButton.vue`: Botón con ícono del proveedor
- `OAuthCallbackView.vue`: Procesa el callback de redirección
- `oauth-login.use-case.ts`: Orquesta el intercambio de código

---

## RBAC

Control de acceso basado en roles y permisos:

```typescript
// En routes.ts — meta de rutas
{
  path: '/admin',
  meta: {
    requiresAuth: true,
    requiresRole: 'admin',           // Rol mínimo requerido
    requiresPermission: 'MANAGE_USERS'  // Permiso específico (opcional)
  }
}
```

**Cadena de guards**: `authGuard` → `rbacGuard`

**rbac.store** expone:
- `systemRole`: 'superadmin' | 'admin' | 'user'
- `permissions`: string[] (permisos del admin)
- `isSuperAdmin`: computed boolean
- `isAdmin`: computed boolean
- `hasPermission(p)`: función

**useRBAC** composable:
```typescript
const { isSuperAdmin, isAdmin, hasPermission } = useRBAC()
```

---

## Temas e Internacionalización

### Temas (dark/light)
- `theme.store.ts` gestiona el tema actual
- `ThemeToggle.vue` permite cambiar entre modos
- `useTheme.ts` composable para uso en componentes
- Persistido en `localStorage` como `theme`
- Implementado con clase `dark` en `<html>` + Tailwind dark mode

### i18n (3 idiomas)
- Español (`es`) — idioma por defecto
- English (`en`)
- Català (`ca`)
- `LanguageSelector.vue` para cambiar idioma
- `useLocale.ts` composable
- Persistido en `localStorage` como `locale`

---

## Error Handling

Flujo completo de errores HTTP → UI:

```
AxiosError (HTTP)
    ↓
error-mapper.util.ts
    ↓
DomainError (InvalidCredentialsError, TokenExpiredError, etc.)
    ↓
Use Case lanza el error
    ↓
Store lo captura → notificationStore.addError(...)
    ↓
NotificationContainer.vue → BaseToast.vue
```

El `error.interceptor.ts` gestiona:
- **401 con refresh token válido**: Reintenta silenciosamente con nuevo Access Token
- **401 sin refresh**: Redirige a login
- **403**: Redirige a `/forbidden`

---

## Convenciones y Patrones

### Nomenclatura de Archivos

| Tipo | Patrón | Ejemplo |
|------|--------|---------||
| Componentes Vue | `PascalCase.vue` | `BaseButton.vue` |
| TypeScript | `kebab-case.ts` | `user.entity.ts` |
| Tests | `[nombre].test.ts` | `email.value-object.test.ts` |
| E2E Tests | `[nombre].e2e.ts` | `login.e2e.ts` |
| Barrel Exports | `index.ts` | Cada carpeta tiene su `index.ts` |

### Barrel Exports
Cada carpeta tiene un `index.ts` que exporta todos sus módulos para permitir importaciones limpias:
```typescript
import { Email, UserId } from '@domain/value-objects';
```

---

## Configuración

### Variables de Entorno

```env
# API Backend
VITE_API_BASE_URL=http://localhost:3000

# Sentry (production)
VITE_SENTRY_DSN=

# App Config
VITE_APP_NAME=Health Care Suite
VITE_APP_DEFAULT_LOCALE=es
```

### TypeScript Configuration
**tsconfig.app.json** — Strict mode con path aliases (@domain, @application, etc.)

### Tailwind Configuration
**tailwind.config.js** — tema personalizado con colores primary (blue), dark mode class-based, font Inter.

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

### Patrones de Testing Importantes

**`vi.hoisted()` para mocks en `vi.mock`**:
```typescript
const { mockStore } = vi.hoisted(() => ({
  mockStore: { user: null, login: vi.fn() }
}))
vi.mock('@/stores/auth.store', () => ({ useAuthStore: () => mockStore }))
```

**Mocking de Vue refs**:
```typescript
// Plain object es siempre truthy; añadir __v_isRef para que Vue.unref() funcione
const mockRef = { value: false, __v_isRef: true }
```

**Async onMounted**:
```typescript
await new Promise((r) => setTimeout(r, 0)) // flush microtask queue
```

### Cobertura
Thresholds en `vitest.config.ts`: Lines 80%, Functions 80%, Branches 80%

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
npm run lint             # ESLint
npm run lint:fix         # ESLint con autofix
npm run format           # Prettier

# Testing
npm test                 # Tests en watch mode
npm run test:unit        # Tests unitarios
npm run test:integration # Tests de integración
npm run test:e2e         # Tests E2E (Playwright)
npm run test:coverage    # Tests con coverage
```

---

## Path Aliases

Configurados en `tsconfig.app.json` y `vite.config.ts`:

| Alias | Ruta | Uso |
|-------|------|-----|
| `@domain/*` | `src/domain/*` | Entidades, Value Objects, Interfaces |
| `@application/*` | `src/application/*` | Use Cases, DTOs, Ports |
| `@infrastructure/*` | `src/infrastructure/*` | HTTP, Storage, i18n, DI |
| `@presentation/*` | `src/presentation/*` | Componentes, Views, Stores, Router |
| `@shared/*` | `src/shared/*` | Types, Constants, Utils |

---

**Última actualización**: Marzo 2026
