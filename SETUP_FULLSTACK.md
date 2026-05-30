# Setup y Ejecución - TextilControl Full Stack

Guía completa para ejecutar Frontend (React Native) + Backend (FastAPI)

## 📋 Requisitos Previos

- Node.js 16+ 
- Python 3.8+
- npm o yarn
- Expo CLI: `npm install -g expo-cli`
- Una terminal para el backend y otra para el frontend

## 🚀 Inicio Rápido

### 1️⃣ Backend (FastAPI)

**Terminal 1: Backend**

```bash
cd projectContainer-backend

# Crear entorno virtual
python3 -m venv .venv

# Activar entorno virtual
source .venv/bin/activate  # macOS/Linux
# o
.venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python main.py
# o alternativamente
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend disponible en: `http://localhost:8000`
📚 Documentación: `http://localhost:8000/docs`

### 2️⃣ Frontend (React Native)

**Terminal 2: Frontend**

```bash
cd projectContainer

# Instalar dependencias
npm install

# Iniciar Expo
npm start
# o
expo start

# Seleccionar:
# i - para iOS
# a - para Android
# w - para Web
```

## 👥 Usuarios de Prueba

| Username | Password | Role | Acceso |
|----------|----------|------|--------|
| `admin` | `admin123` | admin | Panel Costurera |
| `costurera1` | `costurera123` | admin | Panel Costurera |
| `cliente1` | `cliente123` | cliente | Estado Cliente |
| `cliente2` | `cliente123` | cliente | Estado Cliente |

## 🔌 Conexión Frontend-Backend

### URL de la API
```javascript
// En src/services/api.js
const BASE_URL = 'http://localhost:8000';
```

### Flujo de Login
1. Usuario ingresa credenciales en LoginScreen
2. Frontend hace POST a `http://localhost:8000/login`
3. Backend valida contra usuarios estáticos
4. Backend retorna datos del usuario
5. Frontend guarda en AsyncStorage
6. Frontend navega según el rol (admin → PanelCosturera, cliente → EstadoCliente)

### Endpoints Disponibles

#### Login
```
POST /login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Health Check
```
GET /health
```

#### Lista de Usuarios (desarrollo)
```
GET /usuarios
```

#### Usuario por ID
```
GET /usuarios/{id}
```

## 📱 Verificación

### ✅ Backend corriendo
- [ ] Consola muestra: `Uvicorn running on http://0.0.0.0:8000`
- [ ] Accede a http://localhost:8000/docs
- [ ] Ve la documentación interactiva

### ✅ Frontend corriendo
- [ ] Consola muestra: `Expo server is running`
- [ ] Abre Expo Go en tu teléfono
- [ ] Escanea el código QR

### ✅ Conexión establecida
- [ ] Intenta login con credenciales válidas
- [ ] Deberías navegar al panel correspondiente
- [ ] Los datos del usuario se guardan en AsyncStorage

## 🛠️ Solución de Problemas

### Error: "Cannot GET /login"
→ Backend no está ejecutándose. Verifica que esté en `http://localhost:8000`

### Error: "Network Error"
→ Revisa la IP del servidor. Usa `0.0.0.0` en lugar de `localhost`

### Error: "CORS Error"
→ El backend tiene CORS configurado. Verifica `allow_origins` en `main.py`

### Error: "Usuario o contraseña incorrectos"
→ Verifica las credenciales de la tabla de usuarios arriba

### TypeError: "fetch is not defined"
→ Asegúrate de estar en React Native. `fetch` debe estar disponible nativamente

## 📊 Estructura de Carpetas

```
/
├── projectContainer/              # Frontend - React Native
│   ├── src/
│   │   ├── components/            # Componentes reutilizables
│   │   ├── services/api.js        # Conexión con backend
│   │   ├── screens/auth/          # LoginScreen con integración
│   │   └── ...
│   └── package.json
│
└── projectContainer-backend/      # Backend - FastAPI
    ├── main.py                    # Aplicación principal
    ├── models.py                  # Esquemas Pydantic
    ├── database.py                # Usuarios estáticos
    ├── requirements.txt
    └── README.md
```

## 🔄 Próximos Pasos

- [ ] Implementar JWT tokens
- [ ] Hash de contraseñas (bcrypt)
- [ ] Endpoint de reparaciones en backend
- [ ] Persistencia real (PostgreSQL/MongoDB)
- [ ] Autenticación con middleware

## 📝 Notas Importantes

1. **Modo Desarrollo**: Las contraseñas están en texto plano. En producción, usar bcrypt.
2. **CORS**: Abierto para desarrollo. En producción, especificar origins exactos.
3. **Base de Datos**: Estática en memoria. Se reinicia al reiniciar el servidor.
4. **Token**: No implementado aún. Futuro: JWT.

## 🆘 Comandos Útiles

### Backend
```bash
# Reiniciar con cambios en caliente
python main.py

# Ejecutar con puerto específico
uvicorn main:app --port 8001

# Ver logs más detallados
uvicorn main:app --log-level debug
```

### Frontend
```bash
# Limpiar cache
npm start -- --reset-cache

# Instalar dependencia específica
npm install react-native-gesture-handler
```

## 👨‍💻 Contacto

Para dudas o problemas, revisa la documentación:
- Backend: http://localhost:8000/docs
- React Native: https://reactnative.dev/docs

---

**Última actualización**: Mayo 2026
**Estado**: Full Stack en desarrollo ✅
