# TextilControl móvil

Aplicación React Native con Expo para registrar y seguir reparaciones textiles. El avance APF3 integra cámara, permisos, notificaciones locales y una API FastAPI persistente.

## Funcionalidades

- Autenticación y registro conectados al backend.
- Panel administrativo con reparaciones reales y caché offline.
- Alta de reparación con cliente, datos de entrega y evidencia tomada con la cámara.
- Tratamiento de permiso aceptado, rechazado y bloqueado, con acceso a Ajustes.
- Notificación local al crear una reparación o cambiar su estado.
- Vista del cliente filtrada por su usuario, con foto y estado actualizado.
- Catálogo y usuarios consumidos desde la API.
- Gestión administrativa de productos: crear, editar stock/precio y eliminar.
- Cierre de sesión disponible para administradores y clientes.
- Timeouts, mensajes de error, caché y registro estructurado de eventos.

La matriz completa de la rúbrica, arquitectura y guion de demostración están en [APF3_DOCUMENTACION.md](./APF3_DOCUMENTACION.md).

## Requisitos

- Node.js 20 LTS o superior.
- Un dispositivo con Expo Go, o emulador Android/iOS.
- El backend hermano `projectContainer-backend` ejecutándose.

## Configuración

```bash
npm install
cp .env.example .env.local
npx expo start -c --lan
```

En desarrollo, la app detecta automáticamente la IP de Metro para encontrar el backend. Si necesitas reemplazarla manualmente, define:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.20:8000
```

El teléfono y la computadora deben estar en la misma red. En Android Emulator el valor predeterminado es `http://10.0.2.2:8000`; en iOS Simulator es `http://localhost:8000`.

Si cambias `app.json` o variables de entorno, reinicia Metro limpiando la caché:

```bash
npx expo start -c --lan
```

## Credenciales de demostración

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | `admin` | `admin123` |
| Cliente | `cliente1` | `cliente123` |

## Validación técnica

```bash
npx expo export --platform android --output-dir /tmp/textilcontrol-android
```

La cámara debe validarse en un dispositivo real o emulador con cámara. Las notificaciones implementadas son locales, por lo que funcionan en Expo Go; no requieren token push ni proyecto EAS.
