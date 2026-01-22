import React, { useEffect } from 'react';
import { seedAdminUser } from './scripts/seedAdmin';

/**
 * COMPONENTE TEMPORAL PARA CREAR ADMIN
 * 
 * Usar SOLO UNA VEZ para crear el usuario admin
 * 
 * Instrucciones:
 * 1. Importar este componente en App.tsx
 * 2. Agregarlo al render: <SeedAdminHelper />
 * 3. Abrir la app en el navegador
 * 4. Ver en consola que se creó el admin
 * 5. ELIMINAR este componente de App.tsx
 * 
 * Credenciales Admin:
 * Email: carojas@sudamericano.edu.ec
 * Password: antonella123.0
 */

const SeedAdminHelper: React.FC = () => {
    useEffect(() => {
        const createAdmin = async () => {
            console.log('🚀 Iniciando creación de admin...');
            const result = await seedAdminUser();

            if (result.success) {
                console.log('✅ ADMIN CREADO EXITOSAMENTE');
                console.log('📧 Email: carojas@sudamericano.edu.ec');
                console.log('🔑 Pass: antonella123.0');
                console.log('⚠️ ELIMINA <SeedAdminHelper /> de App.tsx');
            } else {
                console.log('⚠️', result.error);
            }
        };

        createAdmin();
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            zIndex: 9999,
            maxWidth: '300px',
        }}>
            <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>🔧 Seed Admin</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
                Creando usuario admin...
                <br />
                Ver consola para detalles.
            </p>
        </div>
    );
};

export default SeedAdminHelper;
