# Configuración de Firebase para EchoBeat

## 📋 Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto" o "Add project"
3. Nombra tu proyecto: **EchoBeat**
4. Acepta los términos y continúa
5. Desactiva Google Analytics (opcional)
6. Click en "Crear proyecto"

### 2. Registrar tu App Web

1. En la página principal del proyecto, click en el ícono **Web** (`</>`)
2. Registra la app con el nombre: **EchoBeat Web**
3. **NO** marques "Firebase Hosting" por ahora
4. Click en "Registrar app"

### 3. Copiar Configuración de Firebase

Verás un código similar a este:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "echobeat-xxxxx.firebaseapp.com",
  projectId: "echobeat-xxxxx",
  storageBucket: "echobeat-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
\`\`\`

**Copia estos valores** - los necesitarás en el siguiente paso.

### 4. Actualizar Configuración en tu Proyecto

Abre el archivo: \`src/firebase/config.ts\`

Reemplaza los valores de placeholder con tu configuración:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY",              // ← Pega tu apiKey aquí
  authDomain: "TU_AUTH_DOMAIN",      // ← Pega tu authDomain aquí
  projectId: "TU_PROJECT_ID",        // ← Pega tu projectId aquí
  storageBucket: "TU_STORAGE_BUCKET", // ← Pega tu storageBucket aquí
  messagingSenderId: "TU_MESSAGING_SENDER_ID", // ← Pega tu messagingSenderId aquí
  appId: "TU_APP_ID"                 // ← Pega tu appId aquí
};
\`\`\`

### 5. Habilitar Autenticación en Firebase

1. En Firebase Console, ve a **Authentication** en el menú lateral
2. Click en "Get started" o "Comenzar"
3. Ve a la pestaña **Sign-in method**

#### Habilitar Google:
1. Click en "Google"
2. Activa el toggle "Enable"
3. Selecciona un email de soporte (tu email)
4. Click en "Save"

#### Habilitar Facebook:
1. Click en "Facebook"
2. Activa el toggle "Enable"
3. **Necesitarás crear una App en Facebook Developers:**

   a. Ve a [Facebook Developers](https://developers.facebook.com/)
   
   b. Click en "My Apps" → "Create App"
   
   c. Selecciona "Consumer" como tipo de app
   
   d. Nombra tu app: **EchoBeat**
   
   e. En el dashboard de tu app, ve a "Settings" → "Basic"
   
   f. Copia el **App ID** y **App Secret**
   
   g. Regresa a Firebase Console
   
   h. Pega el **App ID** y **App Secret** en Firebase
   
   i. Copia el **OAuth redirect URI** que Firebase te muestra
   
   j. Regresa a Facebook Developers
   
   k. Ve a "Facebook Login" → "Settings"
   
   l. Pega el **OAuth redirect URI** en "Valid OAuth Redirect URIs"
   
   m. Guarda los cambios

4. Click en "Save" en Firebase

#### Habilitar Email/Password:
1. Click en "Email/Password"
2. Activa el toggle "Enable"
3. Click en "Save"

### 6. Configurar Dominios Autorizados (Opcional)

1. En Firebase Console → Authentication → Settings
2. Ve a "Authorized domains"
3. Agrega tu dominio si vas a deployar (ej: `echobeat.com`)
4. `localhost` ya está autorizado por defecto

## 🚀 Probar la Autenticación

### Desarrollo Local

1. Asegúrate de que el servidor esté corriendo:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Abre http://localhost:5173

3. Verás la página de Login con 3 opciones:
   - **Continuar con Google** (botón blanco)
   - **Continuar con Facebook** (botón azul)
   - **Email y Contraseña** (formulario tradicional)

### Probar Google Login

1. Click en "Continuar con Google"
2. Selecciona tu cuenta de Google
3. Autoriza la aplicación
4. Deberías ser redirigido a `/main/home`

### Probar Facebook Login

1. Click en "Continuar con Facebook"
2. Inicia sesión con Facebook
3. Autoriza la aplicación
4. Deberías ser redirigido a `/main/home`

### Probar Email/Password

1. Ve a "Regístrate aquí"
2. Completa el formulario de registro
3. Click en "Crear Cuenta"
4. Deberías ser redirigido a `/main/home`

## 📁 Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| \`src/firebase/config.ts\` | Configuración de Firebase |
| \`src/firebase/auth.ts\` | Servicios de autenticación |
| \`src/pages/Login.tsx\` | Página de login con social auth |
| \`src/pages/Register.tsx\` | Página de registro con social auth |
| \`src/pages/Login.css\` | Estilos para botones sociales |

## 🔒 Seguridad

> [!WARNING]
> **IMPORTANTE**: Nunca subas tu archivo \`config.ts\` con las credenciales reales a un repositorio público.

Para producción:
1. Usa variables de entorno
2. Agrega \`config.ts\` a \`.gitignore\`
3. Usa Firebase App Check para proteger tu app

## 🎨 Botones de Autenticación Social

Los botones siguen las guías de diseño oficiales:

- **Google**: Fondo blanco (#FFFFFF), texto oscuro
- **Facebook**: Fondo azul (#1877F2), texto blanco
- **Efectos hover**: Elevación y cambio de color sutil

## ✅ Checklist de Configuración

- [ ] Crear proyecto en Firebase Console
- [ ] Registrar app web
- [ ] Copiar configuración de Firebase
- [ ] Actualizar \`src/firebase/config.ts\`
- [ ] Habilitar Google Sign-in
- [ ] Habilitar Facebook Sign-in (crear app en Facebook Developers)
- [ ] Habilitar Email/Password Sign-in
- [ ] Probar login con Google
- [ ] Probar login con Facebook
- [ ] Probar registro con Email

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que hayas actualizado \`config.ts\` con tus credenciales reales

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Agrega tu dominio a "Authorized domains" en Firebase Console

### Facebook login no funciona
- Verifica que hayas configurado correctamente el OAuth redirect URI
- Asegúrate de que tu app de Facebook esté en modo "Live" (no Development)

### Error: "Firebase: Error (auth/popup-blocked)"
- Permite popups en tu navegador para el dominio localhost

## 📚 Recursos

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin)
- [Facebook Login](https://firebase.google.com/docs/auth/web/facebook-login)
- [Email/Password Auth](https://firebase.google.com/docs/auth/web/password-auth)
