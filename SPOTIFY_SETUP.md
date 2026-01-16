# Configuración de Spotify API para EchoBeat

## 📋 Pasos para Configurar Spotify API

### 1. Crear App en Spotify Developer Dashboard

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Click en "Create app"
4. Completa el formulario:
   - **App name**: EchoBeat
   - **App description**: Music streaming app with 30-second previews
   - **Redirect URI**: `http://localhost:5173/callback`
   - **Which API/SDKs are you planning to use?**: Marca "Web API"
5. Acepta los términos de servicio
6. Click en "Save"

### 2. Obtener Credenciales

1. En el dashboard de tu app, verás:
   - **Client ID**: Una cadena alfanumérica larga
   - **Client Secret**: Click en "Show client secret" para verlo

2. **Copia estos valores** - los necesitarás en el siguiente paso

### 3. Configurar Redirect URIs

1. En "Settings" de tu app
2. En "Redirect URIs", agrega:
   - `http://localhost:5173/callback` (para desarrollo)
   - Tu dominio de producción cuando lo tengas

### 4. Actualizar Configuración en tu Proyecto

Abre el archivo: `src/spotify/config.ts`

Reemplaza los valores:

```typescript
export const spotifyConfig = {
  clientId: "TU_CLIENT_ID",     // ← Pega tu Client ID aquí
  redirectUri: "http://localhost:5173/callback"
};
```

## 🎵 Características de Spotify API

### Previews de 30 Segundos

- Todas las canciones tienen un preview de ~30 segundos
- Calidad: 96 kbps MP3
- No requiere autenticación de usuario para previews
- Acceso a millones de canciones

### Datos Disponibles

- **Información de canciones**: Título, artista, álbum, duración
- **Portadas de álbumes**: En múltiples resoluciones
- **Metadata**: Género, año de lanzamiento, popularidad
- **Playlists**: Acceso a playlists públicas de Spotify

## 🚀 Uso en EchoBeat

### Álbumes

Todos los álbumes tienen sus canciones reales con:
- Preview de 30 segundos
- Portada oficial del álbum
- Información completa de tracks

### Moods

Cada mood tiene una playlist curada con:
- 5-10 canciones con previews
- Selección basada en el estado de ánimo
- Metadata completa

### Reproductor

El reproductor incluye:
- Play/Pause
- Barra de progreso (0-30 segundos)
- Control de volumen
- Skip a siguiente/anterior
- Información de la canción actual

## 📁 Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `src/spotify/config.ts` | Configuración de Spotify API |
| `src/spotify/service.ts` | Servicio para obtener música |
| `src/contexts/MusicContext.tsx` | Context para el reproductor global |
| `src/components/MusicPlayer.tsx` | Reproductor de música mejorado |

## ⚠️ Limitaciones

1. **Previews de 30 segundos**: No se puede reproducir la canción completa
2. **Rate Limits**: Spotify tiene límites de requests por minuto
3. **Disponibilidad**: Algunos tracks pueden no tener preview disponible
4. **Región**: Algunos contenidos pueden estar restringidos por región

## 🔒 Seguridad

> [!WARNING]
> El **Client Secret** debe mantenerse privado. Para producción:
> - Usa variables de entorno
> - No lo incluyas en el código del frontend
> - Implementa un backend para manejar la autenticación

## ✅ Checklist de Configuración

- [ ] Crear app en Spotify Developer Dashboard
- [ ] Copiar Client ID y Client Secret
- [ ] Configurar Redirect URI
- [ ] Actualizar `src/spotify/config.ts`
- [ ] Probar reproducción de previews
- [ ] Verificar que los álbumes cargan correctamente
- [ ] Probar playlists de mood

## 🐛 Troubleshooting

### Error: "Invalid client"
- Verifica que el Client ID sea correcto
- Asegúrate de que la app esté activa en Spotify Dashboard

### Error: "Invalid redirect URI"
- Verifica que `http://localhost:5173/callback` esté en la lista de Redirect URIs
- Asegúrate de que la URL coincida exactamente (incluyendo http/https)

### Previews no se reproducen
- Algunos tracks no tienen preview disponible
- Verifica la consola del navegador para errores
- Asegúrate de que tu navegador permita reproducción automática

### Error de CORS
- Spotify API permite CORS desde localhost
- Para producción, agrega tu dominio a las configuraciones

## 📚 Recursos

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Web API Reference](https://developer.spotify.com/documentation/web-api/reference)
- [Track Object](https://developer.spotify.com/documentation/web-api/reference/get-track)
- [Search API](https://developer.spotify.com/documentation/web-api/reference/search)

## 🎯 Próximos Pasos

1. Configura tu app en Spotify Dashboard
2. Actualiza las credenciales en `config.ts`
3. Reinicia el servidor de desarrollo
4. Prueba reproducir música en la app
5. Disfruta de los previews de 30 segundos! 🎵
