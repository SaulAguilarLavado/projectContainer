# TextilControl 🧵
> **Gestión Inteligente para Talleres de Confección y Reparación Textil**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![AsyncStorage](https://img.shields.io/badge/AsyncStorage-6C63FF?style=for-the-badge&logo=react&logoColor=white)](https://react-native-async-storage.github.io/)

---

## 📋 Descripción General

TextilControl es una aplicación móvil desarrollada con **React Native y Expo** que optimiza la gestión de talleres de confección y reparación textil. Resuelve desafíos logísticos mediante:

- 📍 **Sistema de Ubicación por Huecos (A-Z)**: Localización física de prendas reparadas
- ⏱️ **Panel Administrativo**: Visualización de trabajos pendientes y en proceso
- 🤝 **Transparencia para Clientes**: Consulta remota del estado de reparaciones
- 🛍️ **Catálogo de Productos**: Acceso a precios y disponibilidad de materiales

---

## 🎯 Características Implementadas

### 1. **Integración de Hooks y Lógica de Componentes Funcionales** ✅
- ✓ Uso correcto de `useState` para gestión de estado
- ✓ `useEffect` para ciclo de vida y carga de datos
- ✓ Custom hook `useFetch` personalizado para consumo de APIs
- ✓ Componentes funcionales bien organizados

### 2. **Consumo de API y Renderizado de Datos** ✅
- ✓ Integración con **JSONPlaceholder** (API pública)
- ✓ Transformación de datos para adaptarse al formato de la aplicación
- ✓ Renderizado dinámico de listas (reparaciones, productos)
- ✓ Retroalimentación visual durante carga y errores

### 3. **Manejo de Estados de Carga, Error y UX** ✅
- ✓ **LoadingSpinner**: Indicador visual durante carga
- ✓ **ErrorMessage**: Componente para mostrar errores
- ✓ Estados vacíos con mensajes claros
- ✓ Experiencia offline con datos cacheados

### 4. **Persistencia Local con AsyncStorage** ✅
- ✓ Guardado de reparaciones: `admin_repairs`
- ✓ Almacenamiento de catálogo: `products_catalog`
- ✓ Reparación seleccionada: `selectedRepair`
- ✓ Funcionamiento en modo offline con caché

### 5. **Componentes Reutilizables** ✅
- ✓ `CustomButton` - Botones con variantes
- ✓ `CustomInput` - Inputs con validación
- ✓ `RepairCard` - Tarjeta de reparación
- ✓ `ProductCard` - Tarjeta de producto
- ✓ `LoadingSpinner` - Indicador de carga
- ✓ `ErrorMessage` - Mensajes de error

---

## 🏗️ Arquitectura del Proyecto

```
TextilControl/
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── CustomButton.js
│   │   ├── CustomInput.js
│   │   ├── ErrorMessage.js
│   │   ├── LoadingSpinner.js
│   │   ├── ProductCard.js
│   │   └── RepairCard.js
│   ├── constants/
│   │   └── Colour.js           # Paleta de colores global
│   ├── hooks/
│   │   └── useFetch.js         # Custom hook para API
│   ├── navigation/
│   │   └── AppNavigator.js     # Configuración de navegación
│   ├── screens/
│   │   ├── admin/
│   │   │   ├── AdminHomeScreen.js
│   │   │   └── AddRepairScreen.js
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── customer/
│   │   │   └── MyRepairsScreen.js
│   │   └── shared/
│   │       └── CatalogScreen.js
│   ├── services/
│   │   └── api.js              # Servicio centralizado de API
│   └── utils/
│       └── validators.js       # Funciones de validación
├── App.js
├── app.json
├── package.json
└── README.md
```

---

## 💻 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React Native | 0.81.5 | Framework móvil |
| Expo | ~54.0.33 | Plataforma de desarrollo |
| React | 19.1.0 | Librería UI |
| React Navigation | ^7.2.2 | Navegación en app |
| AsyncStorage | ^1.23.1 | Persistencia local |

---

## 🚀 Instrucciones de Ejecución

### Requisitos Previos
- Node.js 16+ instalado
- npm o yarn
- Expo CLI: `npm install -g expo-cli`

### Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd projectContainer
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   # o específicamente:
   expo start
   ```

4. **Ejecutar en dispositivo/emulador**
   - **iOS**: Presionar `i` en el terminal
   - **Android**: Presionar `a` en el terminal
   - **Web**: Presionar `w` en el terminal

### Variables de Entorno
No se requieren variables de entorno. La app usa **JSONPlaceholder** como API pública.

---

## 📱 Flujo de la Aplicación

```
┌─────────────────────────────────────────┐
│ LOGIN / REGISTRO (Autenticación)        │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌────────────────┐   ┌──────────────────┐
│ PANEL COSTURERA│   │ ESTADO DEL       │
│ (AdminHome)    │   │ CLIENTE (MyRepairs)
└────────────────┘   └──────────────────┘
        │                     │
        ▼                     │
┌────────────────┐           │
│ NUEVA ORDEN    │           │
│ (AddRepair)    │           │
└────────┬───────┘           │
         │                   │
         └───────────┬───────┘
                     ▼
        ┌────────────────────┐
        │ CATÁLOGO           │
        │ (Catalog)          │
        └────────────────────┘
```

---

## 📊 Detalles de Implementación

### Custom Hook: `useFetch`
Maneja el ciclo completo de consumo de API:
```javascript
const { data, loading, error, refetch } = useFetch(url, storageKey, useCache);
```
- Carga desde caché si existe
- Realiza petición a la API
- Guarda respuesta en AsyncStorage
- Retorna datos, estado de carga y error

### Servicio de API: `api.js`
Centraliza endpoints y transformación de datos:
- `getRepairs()` - Obtiene reparaciones (usa /todos de JSONPlaceholder)
- `getProducts()` - Obtiene productos (usa /posts)
- `getUsers()` - Obtiene usuarios

### Manejo de Errores
```
API Request
    ↓
¿Error? → Usar datos cacheados
    ↓
Guardar en AsyncStorage
    ↓
Retornar datos y estado
```

---

## 🔒 Seguridad y Buenas Prácticas

✅ Componentes reutilizables para consistencia visual  
✅ Validación de inputs en formularios  
✅ Manejo seguro de errores y excepciones  
✅ Persistencia local respaldada  
✅ Código modular y bien documentado  
✅ Estilos centralizados en constantes  

---

## 🧪 Evidencias de Funcionamiento

### Pantalla 1: Login/Registro
- Componentes CustomInput reutilizables
- Validación de formularios
- Navegación hacia admin

### Pantalla 2: Panel Costurera
- Cargar datos via API y useFetch
- Mostrar spinner durante carga
- FlatList con RepairCard components
- AsyncStorage para caché
- Botones CustomButton

### Pantalla 3: Nueva Reparación
- Formulario con CustomInput
- Validación de campos
- Guardar en AsyncStorage
- Navegación posterior

### Pantalla 4: Estado del Cliente
- Visualización con MyRepairsScreen
- Componentes CustomButton
- Navegación a catálogo

### Pantalla 5: Catálogo
- Cargar productos via API
- Grid de ProductCard components
- Estados loading/error
- AsyncStorage cache

---

## 📝 Notas Importantes

1. **API Pública**: Usa JSONPlaceholder como simulación de datos reales
2. **Offline**: La app funciona en modo offline usando datos cacheados
3. **Caché**: Automáticamente actualizado con cada llamada exitosa a la API
4. **Componentes**: Todos los componentes son reutilizables y configurables
5. **Estilos**: Centralizados en `Colour.js` para consistencia

---

## 👨‍💻 Autor
Desarrollado como proyecto de gestión de talleres textiles con React Native.

## 📄 Licencia
Proyecto educativo sin licencia especificada.

---

**Última actualización**: Mayo 2026
**Estado**: Proyecto completo y funcional ✅

TextilControl es una aplicación móvil diseñada para optimizar la organización y el flujo de trabajo en pequeñas tiendas de confección. Resuelve el caos logístico mediante el registro digital, seguimiento de estados y un sistema de ubicación física por huecos.

---

## 🎯 Problemática y Solución

* **📍 Localización de Prendas:** Sistema de asignación de **Huecos (A-Z)** para que la costurera sepa exactamente dónde dejó cada prenda terminada.
* **⏱️ Gestión de Tiempos:** Panel administrativo para visualizar trabajos pendientes y evitar retrasos.
* **🤝 Transparencia con el Cliente:** Consulta remota de estado de prendas, evitando desplazamientos innecesarios.
* **🧵 Control de Insumos:** Catálogo integrado para consultar precios oficiales y niveles de stock de materiales.

---

## 🏗️ Arquitectura Técnica

### 🧩 Organización del Código (`src/`)
* **`components/`**: Interfaz reutilizable (Botones, Inputs, Tarjetas).
* **`screens/`**: Vistas organizadas por rol (Administración, Cliente y Autenticación).
* **`navigation/`**: Enrutamiento centralizado mediante React Navigation.
* **`constants/`**: Identidad visual de la marca (`Colour.js`).

### 🛠️ Características Implementadas
- **Layouts Responsivos:** Uso de Flexbox para adaptabilidad en diversos tamaños de pantalla.
- **Manejo de Estados:** Gestión de formularios y validaciones en tiempo real vía `useState`.
- **Validación de Tipos:** Uso de `PropTypes` para garantizar la integridad de la información.

---

## 📲 Flujo del Prototipo
> **Nota:** Dada la naturaleza estática de este avance inicial, se han incluido botones de navegación para recorrer el ecosistema de la app de forma fluida:

* **🔐 Acceso:** Pantallas de Login y Registro de nuevos clientes.
* **💼 Gestión Admin:** Panel de visualización de trabajos y formulario de registro de nuevas prendas con asignación de ubicación.
* **👤 Consulta Cliente:** Vista detallada del estado de la reparación y ubicación física de recogida.
* **📦 Inventario:** Catálogo de productos con indicadores de stock de hilos, botones y materiales.

---

## 📂 Estructura de Carpetas

```text
src/
├── components/   # UI Reutilizable
├── screens/      # Pantallas de la aplicación
│   ├── auth/     # Login y Registro
│   ├── admin/    # Gestión de costureras
│   └── customer/ # Consulta de clientes
├── navigation/   # AppNavigator
├── constants/    # Configuración de estilos (Colour.js)
└── utils/        # Funciones de validación
```

---

## ⚙️ Instalación y Uso

Para poner en marcha el proyecto, asegúrese de contar con **Node.js** y el **CLI de Expo** instalados en su sistema.

### 🛠️ Paso 1: Dependencias
Instale los paquetes necesarios ejecutando el siguiente comando en su terminal:
```bash
npm install
```

### 🛠️ Inicie el servidor de desarrollo:
```bash
npx expo start
```

Escanee el código QR con la aplicación Expo Go para previsualizar en un dispositivo real.

---
