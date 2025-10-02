# 📅 API Google Calendar - Integración Completa

Una API robusta para integrar Google Calendar con autenticación OAuth2, encriptación de tokens y arquitectura MVC.

## 🚀 Características

- ✅ **Autenticación OAuth2** con Google
- ✅ **Encriptación de tokens** para seguridad
- ✅ **Arquitectura MVC** limpia y mantenible
- ✅ **Resources** para formateo de datos
- ✅ **Services** para lógica de negocio
- ✅ **CRUD completo** de eventos
- ✅ **Manejo automático** de refresh tokens

## 🔧 Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
GOOGLE_OAUTH_REDIRECT=http://localhost:3000/api/auth/callback/google

# Database Configuration
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db"

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🔑 Configuración de Google Cloud Console

### 1. Crear Proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Calendar API**

### 2. Configurar OAuth2
1. Ve a **APIs & Services** → **Credentials**
2. Haz clic en **Create Credentials** → **OAuth 2.0 Client IDs**
3. Selecciona **Web application**
4. Configura las URLs autorizadas:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

### 3. Obtener Credenciales
1. Copia el **Client ID** y **Client Secret**
2. Pégalos en tu archivo `.env`

## 🎯 Estrategia de Autenticación

### Flujo de Autenticación con Ventana Emergente

```javascript
// Frontend - Estrategia con ventana emergente
function authenticateWithGoogle() {
  // 1. Abrir ventana emergente
  const authWindow = window.open(
    'http://localhost:3000/api/auth/google',
    'googleAuth',
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );

  // 2. Escuchar mensaje de la ventana
  window.addEventListener('message', (event) => {
    if (event.origin !== 'http://localhost:3000') return;
    
    if (event.data.success) {
      // 3. Autenticación exitosa
      const { apiKey, user } = event.data;
      localStorage.setItem('apiKey', apiKey);
      localStorage.setItem('user', JSON.stringify(user));
      authWindow.close();
      
      // 4. Redirigir o actualizar UI
      window.location.href = '/dashboard';
    } else {
      // 5. Manejar error
      console.error('Error de autenticación:', event.data.error);
      authWindow.close();
    }
  });
}
```

### Modificación del Callback para Ventana Emergente

```typescript
// src/controllers/auth/googleCallback.controller.ts
export const googleCallback = async (req: Request, res: Response) => {
  try {
    // ... lógica de autenticación existente ...
    
    const user = await UserService.createOrUpdateUser(googleProfile, tokens);

    // Enviar respuesta a la ventana emergente
    res.send(`
      <script>
        // Enviar datos al parent window
        window.opener.postMessage({
          success: true,
          apiKey: '${user.apiKey}',
          user: {
            email: '${user.email}',
            name: '${user.name}'
          }
        }, '${process.env.FRONTEND_URL || 'http://localhost:3000'}');
        
        // Cerrar ventana
        window.close();
      </script>
    `);
  } catch (error) {
    res.send(`
      <script>
        window.opener.postMessage({
          success: false,
          error: '${error.message}'
        }, '${process.env.FRONTEND_URL || 'http://localhost:3000'}');
        window.close();
      </script>
    `);
  }
};
```

## 📚 Endpoints de la API

### Autenticación
```http
GET /api/auth/google
# Inicia el flujo de autenticación OAuth2

GET /api/auth/callback/google
# Callback de Google (manejado automáticamente)
```

### Calendario (Chatbot)
```http
# Obtener eventos
GET /api/calendar/events
Authorization: Bearer <apiKey>
Query: ?days=7&limit=10&type=all

# Crear evento
POST /api/calendar/create
Authorization: Bearer <apiKey>
Body: {
  "title": "Reunión importante",
  "date": "2024-01-15",
  "time": "10:00",
  "minutes": 60,
  "email": "cliente@ejemplo.com",
  "location": "Oficina"
}

# Buscar eventos
GET /api/calendar/search?q=reunión&days=30
Authorization: Bearer <apiKey>

# Eliminar evento
DELETE /api/calendar/delete/:eventId
Authorization: Bearer <apiKey>
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── config/
│   ├── db.ts              # Configuración de base de datos
│   ├── env.ts             # Variables de entorno
│   └── google.ts          # Configuración OAuth2
├── controllers/
│   └── auth/
│       ├── googleAuth.controller.ts      # Iniciar auth
│       └── googleCallback.controller.ts  # Callback
├── middlewares/
│   └── auth.middleware.ts # Middleware de autenticación
├── models/
│   └── user.model.ts      # Modelo de usuario
├── services/
│   ├── userGoogle.service.ts        # Lógica de usuario
│   └── googleCalendarService.ts     # Lógica de calendario
├── resources/
│   └── EventResource.ts   # Formateo de eventos
├── helpers/
│   ├── dateHelper.ts      # Utilidades de fechas
│   └── durationHelper.ts  # Utilidades de duración
├── routes/
│   ├── auth.routes.ts     # Rutas de autenticación
│   └── calendar.routes.ts # Rutas de calendario
└── utils/
    └── crypto.ts          # Encriptación de tokens
```

## 🔒 Seguridad Implementada

### 1. Encriptación de Tokens
- Los tokens se encriptan antes de guardar en BD
- Se desencriptan automáticamente al usar
- Clave de encriptación en variables de entorno

### 2. API Key Authentication
- Cada usuario tiene una API key única
- Middleware valida la API key en cada request
- Tokens se renuevan automáticamente

### 3. Manejo de Refresh Tokens
- Renovación automática de access tokens
- Persistencia segura de refresh tokens
- Manejo de errores de autenticación

## 🚀 Instalación y Uso

### 1. Instalar Dependencias
```bash
npm install
# o
bun install
```

### 2. Configurar Base de Datos
```bash
# Ejecutar migraciones de Prisma
npx prisma migrate dev
```

### 3. Iniciar Servidor
```bash
npm run dev
# o
bun run dev
```

### 4. Probar Autenticación
```bash
# Abrir en navegador
http://localhost:3000/api/auth/google
```

## 📱 Integración Frontend

### React/Next.js
```jsx
// Componente de autenticación
const GoogleAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  const handleGoogleAuth = () => {
    const authWindow = window.open(
      'http://localhost:3000/api/auth/google',
      'googleAuth',
      'width=500,height=600'
    );

    window.addEventListener('message', (event) => {
      if (event.data.success) {
        setApiKey(event.data.apiKey);
        setIsAuthenticated(true);
        authWindow.close();
      }
    });
  };

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={handleGoogleAuth}>
          Conectar con Google Calendar
        </button>
      ) : (
        <div>¡Conectado! API Key: {apiKey}</div>
      )}
    </div>
  );
};
```

### Vue.js
```vue
<template>
  <div>
    <button v-if="!isAuthenticated" @click="authenticate">
      Conectar con Google Calendar
    </button>
    <div v-else>
      ¡Conectado! API Key: {{ apiKey }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: false,
      apiKey: null
    }
  },
  methods: {
    authenticate() {
      const authWindow = window.open(
        'http://localhost:3000/api/auth/google',
        'googleAuth',
        'width=500,height=600'
      );

      window.addEventListener('message', (event) => {
        if (event.data.success) {
          this.apiKey = event.data.apiKey;
          this.isAuthenticated = true;
          authWindow.close();
        }
      });
    }
  }
}
</script>
```

## 🐛 Solución de Problemas

### Error: "Invalid redirect URI"
- Verifica que la URL de callback esté configurada en Google Cloud Console
- Asegúrate de que coincida exactamente con `GOOGLE_OAUTH_REDIRECT`

### Error: "Access token expired"
- El sistema renueva automáticamente los tokens
- Si persiste, el usuario debe re-autenticarse

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de que la base de datos esté ejecutándose

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un issue en GitHub
- Contacta al desarrollador
- Revisa la documentación de Google Calendar API