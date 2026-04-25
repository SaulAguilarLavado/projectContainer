# TextilControl 🧵
> **Gestión Inteligente para Talleres de Confección y Reparación Textil**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

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


## ⚙️ Instalación y Uso

Para poner en marcha el proyecto, asegúrese de contar con **Node.js** y el **CLI de Expo** instalados en su sistema.

### 🛠️ Paso 1: Dependencias
Instale los paquetes necesarios ejecutando el siguiente comando en su terminal:
```bash
npm install

### 🛠️ Inicie el servidor de desarrollo:
```bash
npx expo start

Escanee el código QR con la aplicación Expo Go para previsualizar en un dispositivo real.
