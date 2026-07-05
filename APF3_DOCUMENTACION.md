# Evidencia técnica APF3 - TextilControl

## Cobertura de la rúbrica

| Criterio | Peso | Evidencia implementada |
| --- | ---: | --- |
| Funcionalidad nativa | 25% | `CameraView` captura la evidencia inicial de la prenda y la asocia a la reparación almacenada en el backend. |
| Permisos | 15% | Se consulta y solicita el permiso de cámara. Ante rechazo se explica el motivo; si `canAskAgain` es falso se ofrece abrir Ajustes. Las notificaciones siguen el mismo ciclo de consulta/solicitud. |
| Notificaciones | 15% | Se crea un canal Android y se muestran notificaciones locales al registrar una orden y al actualizar su estado. |
| Rendimiento, errores y logging | 20% | Timeout de red, caché con AsyncStorage, estados loading/error/empty, validación cliente-servidor, límite de imagen de 5 MB, error boundary, logging estructurado y middleware de duración/ID de petición. |
| Integración, UX y documentación | 25% | Flujo completo administrador → foto → API/MySQL → estado → notificación → consulta del cliente, documentado aquí y verificable en Swagger/pruebas. |

No se incorporó GPS porque la ubicación geográfica no aporta al propósito del taller. La cámara sí resuelve una necesidad concreta: conservar evidencia del estado en que se recibió la prenda.

## Arquitectura y flujo

```text
Expo / React Native
  ├─ CameraView + permisos
  ├─ notificación local
  ├─ API service con timeout
  └─ caché AsyncStorage
            │ multipart / JSON
            ▼
FastAPI
  ├─ validación Pydantic
  ├─ logging y errores globales
  ├─ imágenes /uploads
  └─ MySQL: usuarios, reparaciones, productos
```

1. El administrador inicia sesión y abre `Nueva reparación`.
2. Selecciona un cliente y completa la orden.
3. La app solicita permiso de cámara y captura una fotografía.
4. La orden y la imagen se envían como `multipart/form-data`.
5. FastAPI valida y persiste la orden; la imagen queda disponible en `/uploads`.
6. La app solicita permiso de notificaciones y muestra un aviso local.
7. Al cambiar el estado se actualiza MySQL y se muestra otro aviso.
8. `cliente1` visualiza sólo sus reparaciones usando `cliente_id`.

## Ejecución para la presentación

Terminal 1:

```bash
cd /Users/saulaguilar/dev/projectContainer-backend
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Completa MYSQL_USER y MYSQL_PASSWORD.
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 2:

```bash
cd /Users/saulaguilar/dev/projectContainer
cp .env.example .env.local
# En teléfono físico, edita .env.local con la IP de la computadora.
npm install
npx expo start -c --lan
```

Comprueba primero `http://IP-DE-LA-PC:8000/health` desde el navegador del teléfono. Si no abre, revisa IP, red Wi-Fi y firewall antes de iniciar la demo.

## Guion breve de demostración

1. Mostrar Swagger en `/docs` y `GET /health`.
2. Ingresar como `admin / admin123`.
3. Abrir `Nueva reparación`, seleccionar a Juan Pérez y completar la orden.
4. Pulsar `Abrir cámara` y explicar el mensaje de permiso. Tomar la foto y mostrar la previsualización.
5. Guardar; enseñar la notificación local y luego la foto en el listado.
6. Ir a `Estado`, cambiar a `En Proceso` y enseñar el segundo aviso.
7. Cerrar sesión/reiniciar la app e ingresar como `cliente1 / cliente123`; mostrar la orden filtrada.
8. Como evidencia de manejo de rechazo, desactivar cámara o notificaciones en Ajustes y mostrar el mensaje alternativo sin perder la orden.

## Evidencias recomendadas para el informe

- Diálogo nativo de permiso de cámara.
- Mensaje alternativo al rechazar y botón `Abrir Ajustes`.
- Cámara activa, foto capturada y previsualización.
- Notificación de orden creada y notificación de cambio de estado.
- Vista admin y vista cliente mostrando la misma reparación.
- Swagger con los endpoints APF3.
- Terminal con logs `request`, `repair_created` y `repair_status_changed`.
- Resultado de las pruebas del backend y del bundle Android.

## Validación automatizada

Backend:

```bash
cd /Users/saulaguilar/dev/projectContainer-backend
.venv/bin/python -m unittest discover -v
```

Frontend:

```bash
cd /Users/saulaguilar/dev/projectContainer
npx expo export --platform android --output-dir /tmp/textilcontrol-android
```

La suite de backend verifica salud/login, registro duplicado, alta con fotografía, filtro por cliente, cambio de estado y rechazo de un archivo que no es imagen.

Al iniciar FastAPI, `initialize_database()` se conecta a MySQL. Con `MYSQL_AUTO_CREATE_DATABASE=true` crea `textilcontrol` si no existe y luego crea automáticamente `usuarios`, `reparaciones` y `productos` mediante `CREATE TABLE IF NOT EXISTS`.

## Decisiones y límites del avance

- Las notificaciones son locales. Son suficientes para la rúbrica y pueden demostrarse con Expo Go; las push remotas requerirían credenciales/proyecto EAS y un servicio de entrega.
- La autenticación usa un token de demostración. Las contraseñas sí se almacenan con PBKDF2 y salt, no en texto plano.
- MySQL guarda los datos estructurados; las imágenes se guardan en `uploads/` y están excluidas de Git.
- Para producción faltaría autorización por rol en cada endpoint, almacenamiento de imágenes externo, HTTPS y tokens JWT con expiración.

Documentación oficial usada: [Expo Camera](https://docs.expo.dev/versions/v54.0.0/sdk/camera/) y [Expo Notifications](https://docs.expo.dev/versions/v54.0.0/sdk/notifications/).
