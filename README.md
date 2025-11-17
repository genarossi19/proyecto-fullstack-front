# EPYGEA - Dashboard Agrícola

Sistema de gestión agrícola moderno para administrar campos, maquinaria, órdenes de trabajo y datos de mercado.

---

## 📋 MANUAL DE USUARIO

### Inicio de Sesión
1. Accede a la aplicación con tus credenciales
2. El sistema valida automáticamente tu sesión
3. Si olvidaste tu contraseña, usa la opción "Recuperar contraseña"

### Dashboard (Inicio)
**Estadísticas rápidas:**
- **Órdenes Activas** - Órdenes de trabajo en progreso
- **Campos en Trabajo** - Número de campos + hectáreas totales
- **Maquinarias Activas** - Máquinas disponibles y en uso
- **Clientes Registrados** - Total de clientes en el sistema

**Información adicional:**
- Datos climáticos en tiempo real
- Cotización del dólar (Blue, Oficial, Tarjeta, Bolsa)
- Próximas órdenes de trabajo por vencer

### Órdenes de Trabajo
- **Ver todas**: Tabla con filtros por estado (Pendiente, En progreso, Completada, Cancelada)
- **Crear nueva**: Asigna cliente, campo, servicio, fechas y maquinaria
- **Editar**: Modifica datos de órdenes existentes
- **Ver detalle**: Revisa información completa de cada orden

### Clientes
- **Listar**: Todos tus clientes registrados
- **Crear**: Registra nuevo cliente (nombre, contacto, ubicación)
- **Editar**: Actualiza datos del cliente
- **Lotes**: Visualiza los campos asociados al cliente

### Maquinaria
- **Inventario**: Todas las máquinas disponibles
- **Crear**: Registra nueva maquinaria (tipo, modelo, año)
- **Editar**: Actualiza especificaciones
- **Detalles**: Información técnica y disponibilidad

### Notificaciones
- Campana en la esquina superior derecha
- Muestra órdenes próximas a vencer, precios en alza/baja, alertas de clima
- Se limpian automáticamente al cerrar el panel

### Perfil
- Accede desde el avatar en la esquina superior derecha
- Edita nombre, email y datos de contacto
- Opción para cerrar sesión

---

## 🔧 DOCUMENTACIÓN TÉCNICA

### Stack Tecnológico Principal

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 18+ | Framework UI y gestión de componentes |
| **TypeScript** | 5.6+ | Tipado estático para JavaScript |
| **Vite** | 6+ | Bundler y servidor de desarrollo (HMR) |
| **React Router** | 6+ | Enrutamiento de aplicación de una página (SPA) |
| **Tailwind CSS** | 3+ | Estilos utilitarios y diseño responsivo |

### Librerías Principales

#### UI y Componentes
- **shadcn/ui** - Componentes accesibles y reutilizables (Button, Card, Input, Dialog, etc.)
- **lucide-react** - Iconografía consistente (4.0+)
- **sonner** - Notificaciones tipo toast elegantes

#### Estado y Datos
- **axios** - Cliente HTTP para comunicación con API REST
- **react-hook-form** - Gestión eficiente de formularios
- **zod** - Validación de esquemas TypeScript

#### Utilidades
- **date-fns** - Manipulación y formateo de fechas
- **clsx** - Utilidad para clases CSS condicionales

### Estructura de Directorios

```
src/
├── api/services/          # Servicios API (Axios)
│   ├── AuthService.ts
│   ├── ClientService.ts
│   ├── DolarService.ts
│   ├── FieldService.ts
│   ├── LotService.ts
│   ├── MachineryService.ts
│   ├── NotificationService.ts
│   ├── WeatherService.ts
│   └── WorkOrderService.ts
├── components/            # Componentes reutilizables
│   ├── Navbar.tsx        # Barra superior con notificaciones
│   ├── Sidebar.tsx       # Navegación lateral colapsable
│   ├── Layout.tsx        # Envoltorio de página
│   ├── ProtectedRoute.tsx # Guard para rutas autenticadas
│   ├── CreateXxxModal.tsx # Formularios modales de creación
│   ├── EditXxxModal.tsx  # Formularios modales de edición
│   └── ui/               # Componentes shadcn/ui
├── context/              # Context API (autenticación)
│   └── AuthContext.tsx
├── lib/                  # Utilidades compartidas
│   ├── axios.ts         # Configuración de axios con interceptores
│   └── utils.ts         # Funciones helper globales
├── pages/                # Páginas/vistas principales
│   ├── Dashboard.tsx
│   ├── WorkOrders.tsx
│   ├── Clients.tsx
│   ├── Machinery.tsx
│   ├── Login.tsx
│   └── Profile.tsx
├── types/                # Interfaces TypeScript
│   ├── ClientType.ts
│   ├── FieldType.ts
│   ├── WorkOrder.ts
│   ├── Machinery.ts
│   └── ...
├── App.tsx              # Componente raíz
├── main.tsx             # Entry point
└── index.css            # Estilos globales
```

### Patrones Clave

#### 1. Servicios API (Pattern Factory)
```typescript
// src/api/services/XxxService.ts
const XxxService = {
  getAll: () => axios.get('/api/xxx'),
  getById: (id) => axios.get(`/api/xxx/${id}`),
  create: (data) => axios.post('/api/xxx', data),
  update: (id, data) => axios.put(`/api/xxx/${id}`, data),
  delete: (id) => axios.delete(`/api/xxx/${id}`)
};
```

#### 2. Autenticación (Context + Protected Routes)
- `AuthContext.tsx`: Almacena token y datos de usuario
- `ProtectedRoute.tsx`: Guard que redirige si no está autenticado
- `axios.ts`: Interceptor que añade token a todas las requests

#### 3. Formularios (React Hook Form + Zod)
```typescript
// Validación con Zod
const schema = z.object({
  name: z.string().min(3)
});

// Uso con react-hook-form
const { register, handleSubmit, errors } = useForm({ resolver: zodResolver(schema) });
```

#### 4. Componentes Modales
- Patrones consistentes de create/edit
- Estados de carga y error
- Validación de formularios integrada
- Toast notifications (sonner) para feedback

### Configuración de Desarrollo

**Archivo de configuración**: `vite.config.ts`
- React plugin con Fast Refresh
- Rutas alias (@/ para src/)
- Soporte CORS

**TypeScript**: `tsconfig.json`
- Target: ES2020
- Module: ESNext
- Strict mode habilitado
- Paths alias configurados

**ESLint**: `eslint.config.js`
- Reglas de React y TypeScript
- Reglas de accesibilidad (a11y)
- Formato de código consistente

### Comunicación con Backend

**Base URL**: Configurada en `src/lib/axios.ts`
- Todos los servicios heredan de axios configurado
- Interceptores para manejo automático de tokens
- Error handling centralizado con toast notifications

**Endpoints esperados** (RESTful):
```
GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id

GET    /api/machinery
POST   /api/machinery
...

GET    /api/workorders
POST   /api/workorders
...

GET    /api/dolar
GET    /api/weather
```

### Flujos de Datos Principales

#### Dashboard (Estadísticas)
1. useEffect con Promise.all() carga en paralelo:
   - Órdenes de trabajo (filtro: activas)
   - Campos (suma de hectáreas)
   - Maquinaria (activas/totales)
   - Clientes (recuento)
2. Estado loadingStats: skeleton compartido para todas las cards
3. Actualización de datos cada vez que el componente monta

#### Notificaciones
1. Navbar.tsx fetches NotificationService.getNotifications()
2. Badge muestra unread count (máx 9+)
3. Dropdown abre/cierra con toggle
4. getTimeAgo() formatea timestamps relativos
5. getNotificationIcon() mapea tipo → icono lucide

#### Formularios Complejos (CreateWorkOrderNew)
1. showLotSelector / showMachinerySelectors controlan visibilidad
2. Click "Agregar Lote" → dropdown aparece → select auto-agrega
3. Array detalleLotes / detalleMaquinaria gestiona items
4. Submit: POST /api/workorders con payload completo

### Performance

- **Code Splitting**: React Router lazy loads páginas
- **Memoization**: useMemo/useCallback para renders costosos
- **Skeletons**: Experiencia UX durante cargas (no spinners)
- **Parallel Loading**: Promise.all() en Dashboard
- **Hot Module Replacement (HMR)**: Vite + React plugin

### Seguridad

- **Autenticación**: JWT token almacenado (localStorage)
- **Protected Routes**: ProtectedRoute verifica autenticación
- **CORS**: Configurado en Vite config
- **Validación**: Zod en cliente + esperada en servidor
- **TypeScript**: Previene errores de tipo en tiempo de desarrollo

### Extensibilidad

**Agregar nuevo servicio:**
1. Crear `src/api/services/NewService.ts`
2. Definir interfaz en `src/types/NewType.ts`
3. Usar en componentes con try/catch + toast errors

**Agregar nueva página:**
1. Crear archivo en `src/pages/NewPage.tsx`
2. Agregar ruta en router principal
3. Agregar item en Sidebar (components/Sidebar.tsx)

**Agregar componente reutilizable:**
1. Crear en `src/components/YourComponent.tsx`
2. Exportar desde index si es necesario
3. Documentar props con JSDoc

### Debugging

- **React DevTools**: Inspecciona props, estado, renders
- **Network Tab**: Valida requests/responses API
- **Console**: Errores no capturados + debug logs
- **Vite**: Hot reload automático en cambios

### Build y Deployment

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm run build    # Output en dist/
npm run preview  # Previsualiza build localmente
```

---

**Última actualización:** 17 de noviembre de 2025  
**Versión:** 1.0.0
