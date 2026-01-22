// Script para limpiar el localStorage de EchoBeat
// Ejecutar esto en la consola del navegador para borrar todos los datos mock/de prueba

console.log('🧹 Limpiando localStorage de EchoBeat...');

// Eliinar todas las canciones existentes (incluyendo las mock)
localStorage.removeItem('echobeat_songs');
console.log('✅ Canciones eliminadas');

// Opcional: también limpiar usuarios de prueba si es necesario
// localStorage.removeItem('echobeat_users');

console.log('✨ ¡Listo! La aplicación ahora está vacía y lista para que subas canciones reales.');
console.log('💡 Recarga la página para ver los cambios.');
