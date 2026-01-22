// Auto-cleanup script - Se ejecuta automáticamente al cargar la app
// Borra TODOS los datos mock/demo del navegador

(function cleanupMockData() {
    // Verificar si ya se ejecutó la limpieza
    const cleanupDone = sessionStorage.getItem('echobeat_cleanup_done');
    
    if (!cleanupDone) {
        console.log('🧹 Limpiando datos mock del localStorage...');
        
        // Eliminar TODAS las canciones falsas
        localStorage.removeItem('echobeat_songs');
        
        // Eliminar usuarios de demo (excepto el usuario actual logueado)
        const currentUser = localStorage.getItem('user');
        const currentToken = localStorage.getItem('token');
        
        // Limpiar usuarios demo pero mantener sesión actual
        localStorage.removeItem('echobeat_users');
        localStorage.removeItem('is_demo_mode');
        
        // Marcar que ya se hizo la limpieza en esta sesión
        sessionStorage.setItem('echobeat_cleanup_done', 'true');
        
        console.log('✅ Limpieza completada. La app ahora solo usa datos del backend.');
    }
})();
