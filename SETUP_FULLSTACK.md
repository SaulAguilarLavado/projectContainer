# Configuración full stack

La configuración vigente del frontend y backend está documentada en:

- [README.md](./README.md): instalación y variables de red.
- [APF3_DOCUMENTACION.md](./APF3_DOCUMENTACION.md): arquitectura, rúbrica y guion de presentación.

Resumen:

```bash
# Terminal 1
cd /Users/saulaguilar/dev/projectContainer-backend
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2
cd /Users/saulaguilar/dev/projectContainer
cp .env.example .env.local
npx expo start -c --lan
```

En teléfono físico, define `EXPO_PUBLIC_API_URL=http://IP-LOCAL:8000` en `.env.local`.
