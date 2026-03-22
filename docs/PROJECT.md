# Health Care Suite Frontend — Documentación completa del proyecto

## Índice

1. [Visión general](#1-visión-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura](#3-arquitectura)
4. [Domain Layer](#4-domain-layer)
5. [Application Layer](#5-application-layer)
6. [Infrastructure Layer](#6-infrastructure-layer)
7. [Presentation Layer](#7-presentation-layer)
8. [Shared Layer](#8-shared-layer)
9. [Estado y persistencia](#9-estado-y-persistencia)
10. [Autenticación y tokens](#10-autenticación-y-tokens)
11. [OAuth2](#11-oauth2)
12. [RBAC](#12-rbac)
13. [Internacionalización (i18n)](#13-internacionalización-i18n)
14. [Temas (Dark/Light)](#14-temas-darklight)
15. [Error handling](#15-error-handling)
16. [Testing](#16-testing)
17. [Configuración del proyecto](#17-configuración-del-proyecto)
18. [Scripts npm](#18-scripts-npm)
19. [Producción](#19-producción)

---

## 1. Visión general

**Health Care Suite Frontend** es una SPA (Single Page Application) para la gestión de usuarios, organizaciones sanitarias y control de acceso. Está construida con **Vue 3**, **TypeScript** y **Pinia**, siguiendo Clean Architecture en 5 capas.

La aplicación consume el backend mediante una API REST y gestiona:

- Registro, login y verificación de email
- Recuperación de contraseña
- OAuth2 con Google y Microsoft
- Panel de administración (gestión de usuarios, organizaciones, permisos)
- RBAC con 3 niveles de acceso
- Gestión de organizaciones sanitarias y membresías
- Soporte multiidioma (español, inglés, catalán)
- Modo oscuro/claro

---

## 2. Stack tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | Vue 3 (Composition API) | ^3.5.25 |
| Lenguaje | TypeScript | ^5.9 |
| State management | Pinia | ^2.1 |
| Routing | Vue Router | ^4.2 |
| Build tool | Vite | ^7.3.1 |
| CSS | Tailwind CSS | ^3.4 |
| HTTP Client | Axios | ^1.6 |
| i18n | vue-i18n | ^9.9 |
| UI headless | @headlessui/vue | ^1.7 |
| Icons | @heroicons/vue | ^2.1 |
| Utilities | @vueuse/core | ^10.7 |
| Charts | chart.js + vue-chartjs | ^4.5 / ^5.3.3 |
| Monitoring | @sentry/vue | ^7.91 |
| Testing (unit) | Vitest + @vue/test-utils | ^1.0 / ^2.4 |
| Testing (E2E) | Playwright | ^1.40 |
| Linting | ESLint + Prettier | ^8.55 / ^3.1 |

---

## 3. Arquitectura

El proyecto sigue **Clean Architecture de 5 capas** con la regla de dependencia apuntando hacia adentro:

```
┌──────────────────────────────────────────────────────┐
│   PRESENTATION (Views, Components, Stores, Router)    │
├──────────────────────────────────────────────────────┤
│      INFRASTRUCTURE (HTTP, Repos, Storage, i18n)     │
├──────────────────────────────────────────────────────┤
│          APPLICATION (Use Cases, DTOs, Ports)         │
├──────────────────────────────────────────────────────┤
│     DOMAIN (Entities, Value Objects, Interfaces)      │
├──────────────────────────────────────────────────────┤
│               SHARED (Constants, Utils, Types)        │
└──────────────────────────────────────────────────────┘
```

### Path aliases

Configurados en `tsconfig.json` y `vite.config.ts`:

```
@domain/*         → src/domain/*
@application/*    → src/application/*
@infrastructure/* → src/infrastructure/*
@presentation/*   → src/presentation/*
@shared/*         → src/shared/*
```

### Principios arquitectónicos

- Las capas internas no importan de las externas
- El dominio no tiene dependencias de Vue, Pinia, Axios, ni localStorage
- La capa de aplicación define puertos; la infraestructura los implementa
- Los componentes acceden a los stores, no a los use cases directamente
- El DI Container (singleton) conecta todo en un punto central

---

## 4. Domain Layer

**Ubicación:** `src/domain/`

### 4.1 Entidades

#### User

`src/domain/entities/user.entity.ts` — Aggregate Root del contexto de autenticación.

**Propiedades:**

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `string` | UUID único |
| `email` | `string` | Email del usuario |
| `firstName` | `string` | Nombre |
| `lastName` | `string` | Apellido |
| `status` | `UserStatus` | Estado de la cuenta |
| `systemRole` | `SystemRole` | Rol en el sistema |
| `createdAt` | `Date` | Fecha de creación |
| `updatedAt` | `Date` | Última actualización |
| `lastLoginAt` | `Date \| null` | Último login |
| `emailVerifiedAt` | `Date \| null` | Verificación de email |

**Métodos:**

```typescript
isEmailVerified(): boolean
isActive(): boolean
canLogin(): boolean
isSuperAdmin(): boolean
isAdmin(): boolean
isUser(): boolean
hasElevatedRole(): boolean // Admin o SuperAdmin
```

#### Organization

`src/domain/entities/organization.entity.ts`

Organización sanitaria con: `id`, `name`, `type` (OrganizationType), `description`, `address`, `contactEmail`, `contactPhone`, `active`, `createdAt`, `updatedAt`.

Método: `isActive(): boolean`

#### OrganizationMembership

Representa la membresía de un usuario en una organización con un rol específico.

---

### 4.2 Value Objects

| Value Object | Archivo | Descripción |
|---|---|---|
| **Email** | `email.value-object.ts` | Email validado y normalizado |
| **UserId** | `user-id.value-object.ts` | UUID único de usuario |
| **UserStatus** | `user-status.value-object.ts` | ACTIVE, PENDING_VERIFICATION, INACTIVE, SUSPENDED, DEACTIVATED |
| **SystemRole** | `system-role.value-object.ts` | USER, ADMIN, SUPER_ADMIN |
| **AccessToken** | `access-token.value-object.ts` | JWT de acceso |
| **RefreshToken** | `refresh-token.value-object.ts` | JWT de refresco |
| **Password** | `password.value-object.ts` | Contraseña con validación de fortaleza |
| **AdminPermission** | (enum) | manage_users, manage_organizations, assign_members, view_all_data |
| **OrganizationType** | `organization-type.value-object.ts` | HOSPITAL, CLINIC, LABORATORY, PHARMACY, INSURANCE, GOVERNMENT, OTHER |
| **OrganizationRole** | `organization-role.value-object.ts` | org_admin, doctor, nurse, specialist, staff, guest |

---

### 4.3 Repository Interfaces (Puertos)

| Interface | Operaciones |
|-----------|------------|
| **IAuthRepository** | `register`, `login`, `refreshSession`, `verifyEmail`, `requestPasswordReset`, `confirmPasswordReset`, `logout`, `initiateOAuth`, `handleOAuthCallback` |
| **IUserRepository** | `getCurrentUser`, `getUserById` |
| **IOrganizationRepository** | `create`, `list`, `get`, `update`, `delete`, `hardDelete` |
| **IMembershipRepository** | `assignMember`, `removeMember`, `listMembers`, `changeMemberRole`, `getUserOrganizations` |
| **IAdminRepository** | `listUsers`, `getUserStats`, `deleteUser`, `hardDeleteUser`, `promoteAdmin`, `demoteAdmin`, `listAdmins`, `getAdminPermissions`, `getMyPermissions`, `grantPermissions`, `revokePermission` |

---

### 4.4 Domain Errors

Todos heredan de `DomainError` (abstracto).

**Errores de autenticación:**
- `InvalidCredentialsError` — Email o contraseña incorrectos
- `AccountLockedError` — Cuenta bloqueada (incluye `remainingSeconds`)
- `UserNotActiveError` — Usuario inactivo o suspendido
- `UserAlreadyExistsError` — Email ya registrado

**Errores de contraseña:**
- `WeakPasswordError` — Contraseña insegura
- `PasswordMismatchError` — Las contraseñas no coinciden
- `InvalidPasswordResetTokenError` — Token de reset inválido
- `PasswordResetTokenExpiredError` — Token de reset caducado
- `PasswordResetTokenAlreadyUsedError` — Token ya usado

**Errores de email:**
- `EmailAlreadyVerifiedError` — Email ya verificado
- `InvalidVerificationTokenError` — Token de verificación inválido
- `VerificationTokenExpiredError` — Token caducado

**Errores de token:**
- `RefreshTokenExpiredError` — Refresh token caducado
- `RefreshTokenReuseDetectedError` — Reutilización detectada (brecha)

**Otros:**
- `TermsNotAcceptedError`
- `UnauthorizedError` — Sin permisos para la acción
- `ForbiddenError` — Acceso prohibido

---

## 5. Application Layer

**Ubicación:** `src/application/`

### 5.1 Use Cases (32 total)

#### Auth (8)

| Use Case | Descripción |
|----------|-------------|
| **LoginUseCase** | Login con email/password. Guarda tokens en localStorage. |
| **RegisterUseCase** | Registro de nuevo usuario. |
| **LogoutUseCase** | Cierra sesión, revoca tokens en backend. |
| **RefreshSessionUseCase** | Rota el access token con el refresh token. |
| **VerifyEmailUseCase** | Verifica el email con token del query param. |
| **RequestPasswordResetUseCase** | Solicita email de recuperación de contraseña. |
| **ConfirmPasswordResetUseCase** | Confirma el reset con token + nueva contraseña. |
| **OAuthLoginUseCase** | Gestiona flujo OAuth completo (initiate + callback). |

#### Organizations (6)

| Use Case | Descripción |
|----------|-------------|
| **CreateOrganizationUseCase** | Crea una organización sanitaria |
| **ListOrganizationsUseCase** | Lista organizaciones con paginación |
| **GetOrganizationUseCase** | Obtiene detalle de una organización |
| **UpdateOrganizationUseCase** | Actualiza datos de una organización |
| **DeleteOrganizationUseCase** | Soft-delete (marca como inactiva) |
| **HardDeleteOrganizationUseCase** | Eliminación permanente |

#### Memberships (5)

| Use Case | Descripción |
|----------|-------------|
| **AssignMemberUseCase** | Añade usuario a organización con un rol |
| **ListMembersUseCase** | Lista miembros de una organización |
| **ChangeMemberRoleUseCase** | Cambia el rol de un miembro en una organización |
| **RemoveMemberUseCase** | Elimina miembro de organización |
| **GetUserOrganizationsUseCase** | Lista las organizaciones de un usuario |

#### Admin (13)

| Use Case | Descripción |
|----------|-------------|
| **PromoteAdminUseCase** | Promueve usuario a ADMIN |
| **DemoteAdminUseCase** | Degrada ADMIN a USER |
| **ListAdminsUseCase** | Lista todos los admins |
| **GetAdminPermissionsUseCase** | Permisos de un admin específico |
| **GetMyPermissionsUseCase** | Permisos del usuario actual |
| **GrantPermissionsUseCase** | Concede permisos a un admin |
| **RevokePermissionUseCase** | Revoca un permiso de admin |
| **ListUsersUseCase** | Lista todos los usuarios (super admin) |
| **GetUserStatsUseCase** | Estadísticas de usuarios |
| **DeleteUserUseCase** | Soft-delete de usuario |
| **HardDeleteUserUseCase** | Eliminación permanente |
| **GetAdminDashboardStatsUseCase** | Estadísticas del panel de admin |
| **GetMyOrganizationsUseCase** | Organizaciones del usuario actual |

---

### 5.2 Ports (Interfaces)

| Puerto | Descripción |
|--------|-------------|
| **IHttpClient** | Abstracción HTTP: `get<T>`, `post<T>`, `put<T>`, `patch<T>`, `delete<T>` |
| **IStorageService** | Abstracción de almacenamiento: `setItem`, `getItem`, `removeItem`, `clear` |
| **ILogger** | Logging abstracto |
| **IAuthRepository** | Puerto del repositorio de autenticación |

---

### 5.3 DTOs

| DTO | Descripción |
|-----|-------------|
| `LoginDTO` | `{ email, password }` |
| `RegisterDTO` | `{ email, password, firstName, lastName }` |
| `VerifyEmailDTO` | `{ token }` |
| `RefreshDTO` | `{ refreshToken }` |
| `RequestPasswordResetDTO` | `{ email }` |
| `ConfirmPasswordResetDTO` | `{ token, newPassword }` |
| `UserDTO` | Usuario serializado completo |
| `OrganizationDTO` | Organización serializada |
| `MembershipDTO` | Membresía con usuario + rol en org |
| `UserOrganizationDTO` | Organización + rol del usuario |
| `AdminDTO` | Admin con permisos |

---

### 5.4 Mappers

**UserMapper** (`src/application/mappers/user.mapper.ts`):
- `fromApi(apiUser): User` — Convierte respuesta API a entidad User
- `toApi(user): UserDTO` — Convierte entidad User a DTO

---

## 6. Infrastructure Layer

**Ubicación:** `src/infrastructure/`

### 6.1 HTTP Client

**`http/axios-http-client.ts`** — Implementa `IHttpClient` usando Axios:

- Base URL: `VITE_API_BASE_URL` (env variable)
- Timeout: 10 segundos
- Interceptor de requests: Añade `Authorization: Bearer <token>` automáticamente desde localStorage
- Métodos: `get<T>`, `post<T>`, `put<T>`, `patch<T>`, `delete<T>`

### 6.2 Interceptors

**`http/interceptors/auth.interceptor.ts`:**
- Adjunta el access token a cada petición saliente

**`http/interceptors/error.interceptor.ts`:**
- `401 Unauthorized` → Intenta refresh del token; si falla, limpia sesión y redirige a `/login`
- `403 Forbidden` → Lanza `UnauthorizedError`
- `409 Conflict` → Mapea al `DomainError` específico (ej: `UserAlreadyExistsError`)
- `500 Server Error` → Loguea en Sentry, lanza error genérico
- `RefreshTokenReuseDetectedError` → Limpia sesión, redirige a login

### 6.3 Repositories (HTTP)

| Repositorio | Implementa | Descripción |
|------------|-----------|-------------|
| **HttpAuthRepository** | `IAuthRepository` | Todas las operaciones de autenticación via HTTP |
| **HttpOrganizationRepository** | `IOrganizationRepository` | CRUD de organizaciones |
| **HttpMembershipRepository** | `IMembershipRepository` | Gestión de membresías |
| **HttpAdminRepository** | `IAdminRepository` | Operaciones de administración |

### 6.4 Storage

**`storage/local-storage.service.ts`** — Implementa `IStorageService`:
- Wrapper de `window.localStorage`
- Métodos: `setItem(key, value)`, `getItem<T>(key)`, `removeItem(key)`, `clear()`

### 6.5 i18n

**`i18n/`** — Configuración de vue-i18n:

| Aspecto | Valor |
|---------|-------|
| Idiomas soportados | Español (`es`), Inglés (`en`), Catalán (`ca`) |
| Idioma por defecto | Español (`es`) |
| Fallback | Español (`es`) |
| Persistencia | `localStorage` con clave `app-locale` |
| Archivos | `i18n/locales/es.json`, `en.json`, `ca.json` |

El selector de idioma (`LanguageSelector.vue`) permite cambiar el idioma en tiempo real.

### 6.6 Sentry

**`sentry/sentry.config.ts`**:
- Inicializa Sentry con DSN de `VITE_SENTRY_DSN`
- Solo activo en producción
- Captura errores no manejados y performance

**`sentry/sentry.service.ts`**:
- `setUserContext(user)` — Vincula el usuario actual a los errores
- `captureEvent(event)` — Envía eventos manuales

### 6.7 DI Container

**`di/container.ts`** — Singleton que conecta todas las dependencias:

```typescript
// Uso
import { container } from '@infrastructure/di/container'

container.loginUseCase.execute(dto)
container.authStore
// etc.
```

**Qué instancia:**
- HTTP Client (Axios)
- Storage Service (LocalStorage)
- Logger
- Todos los repositorios HTTP (4)
- Los 32 use cases con sus dependencias inyectadas
- Registra el interceptor de errores (conecta auth store + router + error handler)

---

## 7. Presentation Layer

**Ubicación:** `src/presentation/`

### 7.1 Router

**`router/routes.ts`** — 25 rutas definidas con lazy loading:

#### Rutas públicas (sin autenticación)

| Ruta | Nombre | Vista | Descripción |
|------|--------|-------|-------------|
| `/` | `home` | `HomeView` | Landing page |
| `/login` | `login` | `LoginView` | Login (`requiresGuest: true`) |
| `/register` | `register` | `RegisterView` | Registro (`requiresGuest: true`) |
| `/forgot-password` | `forgot-password` | `ForgotPasswordView` | Solicitar reset (`requiresGuest: true`) |
| `/reset-password` | `reset-password` | `ResetPasswordView` | Confirmar reset con `?token=` (`requiresGuest: true`) |
| `/verify-email` | `verify-email` | `VerifyEmailView` | Verificar email con `?token=` |
| `/oauth/callback` | `oauth-callback` | `OAuthCallbackView` | Callback de OAuth2 |

#### Rutas protegidas (`requiresAuth: true`)

| Ruta | Nombre | Vista | Descripción |
|------|--------|-------|-------------|
| `/dashboard` | `dashboard` | `DashboardView` | Panel principal |
| `/surgical-block` | `surgical-block` | `SurgicalBlockView` | Gestión de bloque quirúrgico |
| `/emergency` | `emergency` | `EmergencyView` | Operaciones de urgencias |
| `/data-analytics` | `data-analytics` | `DataAnalyticsView` | Visualización de datos |
| `/wristband-printing` | `wristband-printing` | `WristbandPrintingView` | Impresión de pulseras |
| `/label-printing` | `label-printing` | `LabelPrintingView` | Impresión de etiquetas |
| `/my-organizations` | `my-organizations` | `MyOrganizationsView` | Organizaciones del usuario |
| `/profile` | `profile` | `UserProfileView` | Perfil del usuario |
| `/settings` | `settings` | `UserSettingsView` | Configuración del usuario |
| `/forbidden` | `forbidden` | `ForbiddenView` | 403 - Acceso denegado |

#### Rutas de admin

| Ruta | Nombre | Requiere |
|------|--------|----------|
| `/admin` | `admin-dashboard` | `requiresRole: ['super_admin', 'admin']` |
| `/admin/organizations` | `admin-organizations` | ADMIN + `manage_organizations` |
| `/admin/organizations/:id` | `admin-organization-detail` | ADMIN |
| `/admin/analytics` | `admin-analytics` | ADMIN + `view_all_data` |
| `/admin/users` | `admin-users` | SUPER_ADMIN |
| `/admin/users/:userId/permissions` | `admin-user-permissions` | SUPER_ADMIN |
| `/:pathMatch(.*)*` | `not-found` | — (404) |

#### Route Meta

```typescript
interface RouteMeta {
  requiresAuth?: boolean       // true → debe estar autenticado
  requiresGuest?: boolean      // true → redirige si ya está logueado
  requiresRole?: string[]      // roles requeridos (system role)
  requiresPermission?: string  // permiso requerido (admin permission)
  transition?: string          // nombre de transición de página
}
```

### 7.2 Guards

**`router/guards/auth.guard.ts`** — Cadena de protección de rutas:

```
1. route.meta.requiresAuth && !isAuthenticated → redirect /login
2. route.meta.requiresGuest && isAuthenticated → redirect /dashboard
3. Usuario es admin/super_admin → fetchPermissions() (una vez, cacheado)
4. next() — permite la navegación
```

**`router/guards/rbac.guard.ts`:**
- Verifica `requiresRole` contra `authStore.user.systemRole`
- Verifica `requiresPermission` contra `rbacStore.permissions`
- SUPER_ADMIN bypass todos los checks
- Fallo → redirect a `/forbidden`

---

### 7.3 Stores (Pinia)

#### AuthStore (`stores/auth.store.ts`)

Estado de autenticación. Persiste en localStorage.

**State:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user` | `User \| null` | Usuario autenticado actual |
| `accessToken` | `string \| null` | JWT de acceso |
| `refreshToken` | `string \| null` | JWT de refresco |
| `isLoading` | `boolean` | Estado de carga |
| `error` | `string \| null` | Último error |

**Getters:**
- `isAuthenticated`: `user !== null && accessToken !== null`
- `isSuperAdmin`: `user?.isSuperAdmin()`
- `isAdmin`: `user?.isAdmin()`
- `hasElevatedRole`: `isAdmin || isSuperAdmin`

**Actions:**
- `login(dto)`, `register(dto)`, `logout()`
- `refreshSession()` — Llamado automáticamente por el error interceptor
- `verifyEmail(token)`, `requestPasswordReset(email)`, `confirmPasswordReset(dto)`
- `setOAuthSession(tokens, user)` — Llamado por el callback de OAuth
- `clearError()`

**Persistencia:**
- Tokens y usuario guardados en localStorage al hacer login
- Restaurados automáticamente al cargar la app

#### RbacStore (`stores/rbac.store.ts`)

Estado de RBAC y organizaciones del usuario.

**State:** `permissions[]`, `userOrganizations[]`, `isLoading`

**Methods:**
- `fetchPermissions()` — Carga permisos del backend (una vez por sesión)
- `fetchUserOrganizations()` — Carga organizaciones del usuario
- `hasPermission(permission): boolean`
- `isMemberOf(orgId): boolean`
- `getRoleInOrg(orgId): string | null`
- `isOrgAdmin(orgId): boolean`
- `clear()` — Limpia al hacer logout

#### OrganizationStore (`stores/organization.store.ts`)

Gestión de organizaciones. CRUD completo.

#### AdminStore (`stores/admin.store.ts`)

Gestión de usuarios y admins para el panel de administración.

#### UserStore (`stores/user.store.ts`)

Datos del perfil del usuario actual.

#### NotificationStore (`stores/notification.store.ts`)

Cola de notificaciones/toasts.

**Methods:** `success(msg)`, `error(msg)`, `info(msg)`, `warning(msg)`

Renderizado por `NotificationContainer.vue`.

#### ThemeStore (`stores/theme.store.ts`)

Estado del tema (dark/light).

**Method:** `initialize()` — Cargado en `main.ts` después del mount.

---

### 7.4 Composables

| Composable | Archivo | Proporciona |
|-----------|---------|------------|
| **useAuth** | `composables/useAuth.ts` | `user`, `isAuthenticated`, `login()`, `logout()`, `loginAndRedirect()`, `registerAndRedirect()`, `logoutAndRedirect()`, `initiateOAuthLogin(provider)`, `verifyEmail(token)` |
| **useRBAC** | `composables/useRBAC.ts` | `canAccess(role?, permission?)`, `canManageOrg(orgId)`, `hasPermission(perm)`, `isSuperAdmin`, `isAdmin` |
| **useForm** | `composables/useForm.ts` | Estado del formulario, validación, submit handler |
| **useNotification** | `composables/useNotification.ts` | Acceso al NotificationStore |
| **useTheme** | `composables/useTheme.ts` | Toggle dark/light, estado actual |
| **useLocale** | `composables/useLocale.ts` | Cambiar idioma, idioma actual |
| **usePasswordStrength** | `composables/usePasswordStrength.ts` | Evaluar fortaleza de contraseña |
| **useApiError** | `composables/useApiError.ts` | Mapear errores de API a mensajes legibles |
| (RBAC también en stores) | | |

---

### 7.5 Views (24 total)

#### Auth Views

| Vista | Ruta | Descripción |
|-------|------|-------------|
| `HomeView.vue` | `/` | Landing page pública con descripción de la app |
| `LoginView.vue` | `/login` | Login con email/password y botones OAuth |
| `RegisterView.vue` | `/register` | Registro de nuevo usuario |
| `ForgotPasswordView.vue` | `/forgot-password` | Formulario para solicitar reset de contraseña |
| `ResetPasswordView.vue` | `/reset-password` | Formulario para confirmar nueva contraseña (lee `?token=`) |
| `VerifyEmailView.vue` | `/verify-email` | Verifica email automáticamente al cargar (lee `?token=`). Muestra: loading → éxito → redirect a login, o error. |
| `OAuthCallbackView.vue` | `/oauth/callback` | Gestiona el callback de OAuth2. Extrae code+state, llama al backend, redirige. |

#### Dashboard Views

| Vista | Ruta | Descripción |
|-------|------|-------------|
| `DashboardView.vue` | `/dashboard` | Panel principal con resumen de accesos |
| `SurgicalBlockView.vue` | `/surgical-block` | Módulo de bloque quirúrgico |
| `EmergencyView.vue` | `/emergency` | Módulo de urgencias |
| `DataAnalyticsView.vue` | `/data-analytics` | Visualización de datos con charts |
| `WristbandPrintingView.vue` | `/wristband-printing` | Impresión de pulseras de pacientes |
| `LabelPrintingView.vue` | `/label-printing` | Impresión de etiquetas |
| `MyOrganizationsView.vue` | `/my-organizations` | Organizaciones a las que pertenece el usuario |
| `UserProfileView.vue` | `/profile` | Perfil del usuario actual |
| `UserSettingsView.vue` | `/settings` | Configuración personal |

#### Admin Views

| Vista | Ruta | Requiere |
|-------|------|----------|
| `AdminDashboardView.vue` | `/admin` | ADMIN/SUPER_ADMIN |
| `AdminAnalyticsView.vue` | `/admin/analytics` | ADMIN + view_all_data |
| `OrganizationListView.vue` | `/admin/organizations` | ADMIN + manage_organizations |
| `OrganizationDetailView.vue` | `/admin/organizations/:id` | ADMIN |
| `AdminUserListView.vue` | `/admin/users` | SUPER_ADMIN |
| `AdminPermissionsView.vue` | `/admin/users/:userId/permissions` | SUPER_ADMIN |

#### Error Views

| Vista | Ruta |
|-------|------|
| `ForbiddenView.vue` | `/forbidden` — 403 con botón "Go Home" |
| `NotFoundView.vue` | `/*` — 404 con botón "Go Home" |

---

### 7.6 Components (33+)

#### UI Base (`components/ui/`)

| Componente | Descripción |
|-----------|-------------|
| `BaseButton.vue` | Botón con variantes (primary, secondary, danger, ghost) y estados (loading, disabled) |
| `BaseInput.vue` | Input de texto con label, validación, error message y tipos (text, password, email) |
| `BaseCard.vue` | Contenedor con borde, sombra y padding estándar |
| `BaseModal.vue` | Modal accesible con @headlessui. Soporte para backdrop click y escape key. |
| `BaseAlert.vue` | Alerta de tipo success/error/warning/info |
| `BaseBadge.vue` | Badge/tag con variantes de color |
| `BaseSelect.vue` | Select/dropdown con opciones tipadas |
| `BaseToggleSwitch.vue` | Toggle switch accesible |
| `BaseSkeleton.vue` | Placeholder de carga animado |
| `BaseSpinner.vue` | Spinner de carga (varios tamaños) |
| `BaseToast.vue` | Toast individual con auto-dismiss |
| `BasePagination.vue` | Controles de paginación con prev/next y números de página |
| `PasswordStrengthMeter.vue` | Indicador visual de fortaleza de contraseña |
| `ConfirmDialog.vue` | Diálogo de confirmación reutilizable |
| `LanguageSelector.vue` | Selector de idioma (es/en/ca) |
| `ThemeToggle.vue` | Botón de toggle dark/light mode |

#### Layout (`components/layout/`)

| Componente | Descripción |
|-----------|-------------|
| `AppHeader.vue` | Header principal: logo, navegación, menú de usuario |
| `AppFooter.vue` | Footer con links a modales de ToS, Privacy, About, Contact |
| `AppSidebar.vue` | Sidebar de navegación del dashboard |
| `DashboardLayout.vue` | Layout wrapper para vistas del dashboard (header + sidebar + content) |
| `AdminLayout.vue` | Layout wrapper para vistas de administración |
| `AdminSidebar.vue` | Sidebar específico del panel de admin |

#### Auth (`components/auth/`)

| Componente | Descripción |
|-----------|-------------|
| `LoginForm.vue` | Formulario de login con validación, manejo de errores y loading |
| `RegisterForm.vue` | Formulario de registro con PasswordStrengthMeter |
| `ForgotPasswordForm.vue` | Formulario para solicitar reset |
| `ResetPasswordForm.vue` | Formulario para confirmar nuevo password |
| `OAuthButton.vue` | Botón para iniciar OAuth (acepta `provider: 'google' \| 'microsoft'`) |

#### Admin (`components/admin/`)

| Componente | Descripción |
|-----------|-------------|
| `OrganizationFormModal.vue` | Modal de creación/edición de organización |
| `AssignMemberModal.vue` | Modal para añadir miembro a organización |
| `PromoteUserModal.vue` | Modal para promover usuario a admin |

#### Dashboard (`components/dashboard/`)

| Componente | Descripción |
|-----------|-------------|
| `OrganizationCard.vue` | Tarjeta de organización en MyOrganizationsView |

#### Footer (`components/footer/`)

| Componente | Descripción |
|-----------|-------------|
| `TermsOfServiceModal.vue` | Modal con términos de servicio |
| `PrivacyPolicyModal.vue` | Modal con política de privacidad |
| `AboutModal.vue` | Modal "Acerca de" la aplicación |
| `ContactModal.vue` | Modal de contacto |

#### Global

| Componente | Descripción |
|-----------|-------------|
| `NotificationContainer.vue` | Renderiza la cola de notificaciones/toasts del NotificationStore |

---

## 8. Shared Layer

**Ubicación:** `src/shared/`

### Constants

| Archivo | Contenido |
|---------|-----------|
| `api.constants.ts` | `API_ENDPOINTS` (rutas del backend), `TOKEN_CONFIG` (duración access 5h, refresh 3d), `STORAGE_KEYS` (claves de localStorage con prefijo) |
| `routes.constants.ts` | Constantes de rutas frontend (nombres y paths) |
| `design-tokens.constants.ts` | `DESIGN_TOKENS` (colores, tamaños, animaciones), `TRANSITIONS` (clases de transición Tailwind) |

### Utils

| Archivo | Contenido |
|---------|-----------|
| `validation.utils.ts` | `isValidEmail(str)`, `isStrongPassword(str)`, validaciones reutilizables |

### Types

| Archivo | Contenido |
|---------|-----------|
| `api.types.ts` | `HttpResponse<T>`, `ApiError`, tipos de respuesta genéricos |
| `common.types.ts` | Tipos compartidos entre capas |

---

## 9. Estado y persistencia

### Flujo de sesión

```
1. Usuario visita la app
2. main.ts → DI Container creado (singleton)
3. AuthStore.initialize() → Lee localStorage
4. Si hay tokens → usuario restaurado automáticamente
5. Router guard verifica autenticación en cada navegación
```

### Datos en localStorage

| Clave | Contenido | Cuándo se guarda |
|-------|-----------|-----------------|
| `auth_accessToken` | JWT de acceso | Login exitoso |
| `auth_refreshToken` | JWT de refresco | Login exitoso |
| `auth_user` | JSON del User entity | Login exitoso |
| `app-locale` | Código de idioma (es/en/ca) | Al cambiar idioma |
| `app-theme` | `light` \| `dark` | Al cambiar tema |

### Datos en sessionStorage

| Clave | Contenido | Cuándo se guarda |
|-------|-----------|-----------------|
| `oauth_state` | JWT de estado OAuth (CSRF) | Al iniciar OAuth |
| `oauth_provider` | Nombre del proveedor | Al iniciar OAuth |

---

## 10. Autenticación y tokens

### Access Token

- Duración: **5 horas**
- Almacenado en localStorage
- Adjuntado automáticamente a todas las peticiones via `auth.interceptor.ts`

### Refresh Token

- Duración: **3 días**
- Almacenado en localStorage
- Usado automáticamente cuando el access token caduca

### Flujo de silent refresh

```
1. Request falla con 401
2. error.interceptor.ts intercepta el error
3. Llama refreshSession() con el refresh token de localStorage
4. Si éxito:
   → Nuevos tokens guardados en localStorage
   → Request original reintentado con el nuevo access token
5. Si fallo (refresh token inválido/caducado):
   → AuthStore.logout() (limpia localStorage)
   → Redirect a /login
```

### Detección de reuse de tokens

Si el backend retorna `RefreshTokenReuseDetectedError` (409):
- Se limpia completamente la sesión
- Se redirige a `/login`
- El usuario debe autenticarse de nuevo

---

## 11. OAuth2

### Proveedores soportados

- **Google** (google)
- **Microsoft** (microsoft)

### Flujo completo

```
1. Usuario hace clic en "Login con Google/Microsoft" (OAuthButton.vue)
2. useAuth.initiateOAuthLogin(provider) llamado
3. OAuthLoginUseCase.initiate() → POST /auth/oauth/initiate
4. Backend retorna { authorizationUrl, state (JWT 5min) }
5. Guardar state en sessionStorage['oauth_state']
6. Guardar provider en sessionStorage['oauth_provider']
7. Redirigir al usuario a authorizationUrl (página del proveedor)
8. Proveedor autentica al usuario y redirige a /oauth/callback?code=...&state=...
9. OAuthCallbackView.vue:
   → Lee code, state del URL
   → Verifica state contra sessionStorage['oauth_state']
   → Llama OAuthLoginUseCase.callback({ provider, code, state })
10. Backend: valida state, intercambia code por tokens del proveedor
11. Backend: busca cuenta existente → vincula o crea usuario
12. Retorna access + refresh tokens
13. AuthStore.setOAuthSession(tokens, user)
14. Redirect a /dashboard
```

### Seguridad CSRF

El `state` es un JWT firmado de 5 minutos que contiene un nonce aleatorio. Se verifica en el callback para prevenir ataques CSRF.

---

## 12. RBAC

### System Roles

| Rol | Acceso |
|-----|--------|
| `USER` | Rutas protegidas básicas (dashboard, perfil, organizaciones propias) |
| `ADMIN` | + Rutas de admin según permisos concedidos |
| `SUPER_ADMIN` | Acceso total. Bypass de todos los checks de permisos. |

### Admin Permissions

| Permiso | Rutas que habilita |
|---------|-------------------|
| `manage_organizations` | CRUD de organizaciones |
| `assign_members` | Gestión de membresías |
| `view_all_data` | Analytics y datos globales |
| `manage_users` | (reservado para uso futuro en frontend) |

### Cómo funciona en el frontend

**1. Carga de permisos:**
```typescript
// auth.guard.ts — al navegar a ruta de admin por primera vez
if (user.isAdmin() && !rbacStore.permissionsLoaded) {
  await rbacStore.fetchPermissions()
}
```

**2. Verificación en guards:**
```typescript
// rbac.guard.ts
if (route.meta.requiresRole && !user.isSuperAdmin()) {
  if (!route.meta.requiresRole.includes(user.systemRole)) {
    return redirect('/forbidden')
  }
}
if (route.meta.requiresPermission && !user.isSuperAdmin()) {
  if (!rbacStore.hasPermission(route.meta.requiresPermission)) {
    return redirect('/forbidden')
  }
}
```

**3. Uso en componentes:**
```typescript
const { canAccess, hasPermission } = useRBAC()

// En template:
v-if="hasPermission('manage_organizations')"
```

---

## 13. Internacionalización (i18n)

### Configuración

| Aspecto | Valor |
|---------|-------|
| Idiomas | Español (`es`), Inglés (`en`), Catalán (`ca`) |
| Default | Español (`es`) |
| Fallback | Español (`es`) |
| Persistencia | localStorage `app-locale` |

### Estructura de archivos

```
src/infrastructure/i18n/
├── index.ts              # Configuración de vue-i18n
└── locales/
    ├── es.json           # Traducciones en español
    ├── en.json           # Traducciones en inglés
    └── ca.json           # Traducciones en catalán
```

### Uso en componentes

```typescript
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
t('auth.login.title')
```

### Cambio de idioma

Mediante `LanguageSelector.vue` que usa el composable `useLocale()`. El cambio es inmediato y persiste entre sesiones.

---

## 14. Temas (Dark/Light)

### Implementación

- **Tailwind CSS** con modo `class` (dark mode basado en clase `dark` en `<html>`)
- `ThemeStore` gestiona el estado
- `ThemeToggle.vue` para cambiar entre modos
- Persistido en localStorage

### Inicialización

```typescript
// main.ts — después del mount
app.mount('#app')
themeStore.initialize() // Lee localStorage y aplica clase 'dark' si corresponde
```

### Uso en componentes

```html
<!-- Tailwind dark mode -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

### Paleta de colores (Tailwind custom)

```javascript
// tailwind.config.js
colors: {
  primary: { // Azul — color principal
    600: '#2563eb', // Primary action blue
    // ...
  },
  success, error, warning, info // Paletas custom para estados
}
```

---

## 15. Error handling

### Flujo completo

```
1. Petición HTTP falla
2. Axios devuelve AxiosError
3. error.interceptor.ts mapea por status HTTP:
   - 400 → ValidationError (con fields)
   - 401 → Silent refresh o InvalidCredentialsError
   - 403 → UnauthorizedError
   - 404 → NotFoundError
   - 409 → DomainError específico (UserAlreadyExistsError, etc.)
   - 422 → ValidationError
   - 500 → ServerError (logueado en Sentry)
4. Use Case recibe DomainError lanzado
5. Store action captura el error, actualiza estado `error`
6. Componente/View lee el estado de error del store
7. Muestra mensaje al usuario via BaseAlert o NotificationStore
```

### Mapping de errores (error-mapper.util.ts)

El `error-mapper.util.ts` mapea respuestas del backend a clases `DomainError` del frontend, asegurando que los componentes solo manejan errores de dominio tipados.

### Buenas prácticas

- Los componentes nunca manejan AxiosError directamente
- Los stores actualizan `isLoading` y `error` en cada operación
- Las notificaciones de error usan `NotificationStore.error(msg)`
- Los errores críticos (500, token reuse) fuerzan el logout

---

## 16. Testing

### Framework

| Herramienta | Uso |
|-------------|-----|
| **Vitest** | Test runner (compatible con Jest API) |
| **@vue/test-utils** | Montaje de componentes Vue |
| **Pinia Testing** | `createPinia()`, `setActivePinia()` |
| **Playwright** | Tests E2E en navegador real |
| **@vitest/coverage-v8** | Cobertura de código (umbral: 80%) |

### Estructura

```
tests/
├── unit/
│   ├── domain/
│   │   ├── entities/        # user.entity, organization, membership
│   │   ├── value-objects/   # email, user-id, password, etc.
│   │   └── errors/
│   ├── application/
│   │   ├── use-cases/       # auth, org, membership, admin
│   │   └── mappers/         # user.mapper
│   └── infrastructure/
│       ├── repositories/    # http repositories
│       ├── http/            # interceptors
│       └── di/              # container
├── integration/
│   └── stores/
│       └── auth.store.test.ts
└── e2e/
    ├── auth/
    │   ├── login.e2e.ts
    │   ├── register.e2e.ts
    │   └── oauth.e2e.ts
    └── helpers/
```

### Patrones de testing críticos

**1. `vi.hoisted()` para mocks en `vi.mock()`**

Las factories de `vi.mock()` se elevan (hoist) antes del código a nivel de módulo. Todas las variables referenciadas dentro de `vi.mock()` DEBEN estar definidas en `vi.hoisted()`:

```typescript
const { mockStore } = vi.hoisted(() => ({
  mockStore: { user: null, isAuthenticated: false }
}))

vi.mock('@presentation/stores/auth.store', () => ({
  useAuthStore: () => mockStore
}))
```

**2. Vue ref mocking con `__v_isRef: true`**

Para mockear refs usados en templates (`v-if="isSuperAdmin"`):

```typescript
const mockIsSuperAdmin = { value: false, __v_isRef: true }
// Sin __v_isRef: true, el objeto siempre es truthy
```

**3. Async `onMounted`**

```typescript
await wrapper.vm.$nextTick()
// o
await new Promise(r => setTimeout(r, 0))
```

**4. Real Pinia stores**

```typescript
const pinia = createPinia()
setActivePinia(pinia)
const authStore = useAuthStore()
authStore.user = { ...userData, systemRole: 'admin' }
```

**5. BaseSelect — usar element selectors**

```typescript
// ✅ Correcto
wrapper.find('select').setValue('value')

// ❌ Incorrecto — fallthrough attrs sobrescriben testid
wrapper.find('[data-testid="my-select"]')
```

### Estadísticas

| Tipo | Archivos aprox. | Estado |
|------|-----------------|--------|
| Unit | ~100 | Pasando |
| Integration | ~12 | Pasando |
| E2E | ~27 (OAuth) + 258 (pre-existing) | Pasando |

---

## 17. Configuración del proyecto

### vite.config.ts

```typescript
{
  plugins: [vue()],
  resolve: { alias: { '@domain': '...', ... } },
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3000' }  // proxy al backend en dev
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'pinia', 'vue-router'],
          'vendor-ui': ['@headlessui/vue', '@heroicons/vue']
        }
      }
    }
  }
}
```

### tailwind.config.js

```javascript
{
  darkMode: 'class',
  content: ['./src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        primary: { /* azul */ },
        success: { /* verde */ },
        error: { /* rojo */ },
        warning: { /* amarillo */ },
        info: { /* cyan */ }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      keyframes: {
        'fade-in': { from: { opacity: 0 } },
        'slide-in-up': { from: { transform: 'translateY(10px)', opacity: 0 } },
        // etc.
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
        'card-glow': '0 0 20px rgba(37,99,235,0.3)'
      }
    }
  }
}
```

### tsconfig.json

- Target: `ES2020`
- Strict mode completo
- `verbatimModuleSyntax: true`
- `moduleResolution: bundler`
- Path aliases configurados

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_API_BASE_URL` | URL base del backend (ej: `http://localhost:3000`) |
| `VITE_SENTRY_DSN` | DSN de Sentry para error tracking |

---

## 18. Scripts npm

Ejecutar desde `/frontend`:

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `vite` | Servidor de desarrollo en `localhost:5173` con hot reload |
| `build` | `vue-tsc && vite build` | Build de producción |
| `preview` | `vite preview` | Preview del build de producción |
| `typecheck` | `vue-tsc --noEmit` | Verificar tipos sin compilar |
| `lint` | `eslint src` | Linting con ESLint |
| `test` | `vitest` | Tests en modo watch |
| `test:unit` | `vitest run tests/unit` | Solo tests unitarios |
| `test:coverage` | `vitest run --coverage` | Tests con cobertura (umbral 80%) |
| `test:e2e` | `playwright test` | Tests E2E con Playwright |

---

## Resumen estadístico

| Aspecto | Cantidad |
|---------|---------|
| Vistas (Views) | 24 (todas lazy-loaded) |
| Componentes | 33+ |
| Stores (Pinia) | 7 |
| Composables | 9 |
| Rutas | 25 |
| Use Cases | 32 |
| Domain Entities | 3 |
| Value Objects | 11 |
| Repository Interfaces | 5 |
| Domain Errors | 20+ |
| Idiomas (i18n) | 3 (es, en, ca) |
| Temas | 2 (dark, light) |
| OAuth Providers | 2 (Google, Microsoft) |
| Admin Permissions | 4 |
| Organization Types | 7 |
| Organization Roles | 6 |

---

---

## 19. Producción

### Plataformas

| Componente | Plataforma | Plan |
|-----------|-----------|------|
| Frontend (este proyecto) | Vercel | Hobby |
| API / Backend | Render | Free |
| Base de datos | Neon PostgreSQL | Free |

### URLs

| Recurso | URL |
|---------|-----|
| Frontend | `https://health-care-suite-frontend.vercel.app` |
| OAuth callback | `https://health-care-suite-frontend.vercel.app/oauth/callback` |
| API | `https://health-care-suite-backend.onrender.com` |

### Limitaciones del Free Tier

#### Vercel Hobby

- **Deployments:** ilimitados desde GitHub (auto-deploy en cada push a `main`)
- **Ancho de banda:** 100 GB/mes
- **Build time:** hasta 45 min por deploy
- **Dominio personalizado:** se puede añadir dominio propio; la URL por defecto es `*.vercel.app`
- **SPA routing:** requiere `vercel.json` con rewrite `/(.*) → /index.html` para que `createWebHistory()` funcione correctamente en rutas directas (ya configurado).

#### Render Free (backend)

- **Cold start:** el backend se duerme tras 15 min de inactividad; la primera petición tarda ~30-50 s.
- **Mitigación aplicada:** el cliente Axios usa timeout de **60 000 ms** (`axios-http-client.ts`) para absorber el cold start.
- **UptimeRobot:** configurar monitor HTTP gratuito cada **5 min** apuntando a `https://health-care-suite-backend.onrender.com/health` para mantener el backend activo.

> **Nota:** estas limitaciones desaparecen al desplegar en servidores propios de la empresa.

#### Neon PostgreSQL Free (base de datos del backend)

- **Storage:** 0,5 GB | **Compute hours:** ~192 h/mes
- **Compute:** se pausa tras 5 min de inactividad; su arranque se suma al cold start del backend.

### Ajustes aplicados al código para producción

| Archivo | Ajuste |
|---------|--------|
| `src/infrastructure/http/axios-http-client.ts` | Timeout aumentado a **60 000 ms** |
| `vercel.json` | Rewrite `/(.*) → /index.html` para SPA routing |

### Variables de entorno en Vercel

Configurar en Vercel → Settings → Environment Variables:

| Variable | Valor |
|----------|-------|
| `VITE_API_BASE_URL` | `https://health-care-suite-backend.onrender.com` |
| `VITE_SENTRY_DSN` | DSN del proyecto en Sentry (opcional) |

### OAuth — Redirect URIs registradas

Las siguientes URIs deben estar autorizadas en los proveedores OAuth:

| Proveedor | URI registrada |
|-----------|---------------|
| Google Cloud Console | `https://health-care-suite-frontend.vercel.app/oauth/callback` |
| Azure / Microsoft Entra | `https://health-care-suite-frontend.vercel.app/oauth/callback` |

---

*Documento generado el 2026-03-19*
