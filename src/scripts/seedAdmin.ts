import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

/**
 * ADMIN SEED SCRIPT
 * 
 * Crea el usuario administrador en Firebase
 * 
 * Email: carojas@sudamericano.edu.ec
 * Password: antonella123.0
 * Role: ADMIN
 * 
 * Para ejecutar:
 * 1. Importar esta función en un componente temporal
 * 2. Llamarla una sola vez
 * 3. Eliminar la llamada después
 */

export async function seedAdminUser() {
    const ADMIN_EMAIL = 'carojas@sudamericano.edu.ec';
    const ADMIN_PASSWORD = 'antonella123.0';
    const ADMIN_NAME = 'Carolina Rojas';

    try {
        console.log('🔧 Creando usuario administrador...');

        // 1. Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            ADMIN_EMAIL,
            ADMIN_PASSWORD
        );

        const user = userCredential.user;
        console.log('✅ Usuario creado en Auth:', user.uid);

        // 2. Crear documento en Firestore con rol ADMIN
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            role: 'ADMIN', // ← ROL ADMIN
            status: 'ACTIVE',
            avatar_url: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        console.log('✅ Usuario ADMIN creado exitosamente en Firestore');
        console.log('📧 Email:', ADMIN_EMAIL);
        console.log('🔑 Password:', ADMIN_PASSWORD);
        console.log('👤 Role: ADMIN');

        return { success: true, uid: user.uid };
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('⚠️ El usuario admin ya existe');
            return { success: false, error: 'Usuario ya existe' };
        }

        console.error('❌ Error creando admin:', error);
        return { success: false, error: error.message };
    }
}

/**
 * INSTRUCCIONES DE USO:
 * 
 * 1. En App.tsx o cualquier componente, agregar temporalmente:
 * 
 * import { seedAdminUser } from './scripts/seedAdmin';
 * 
 * useEffect(() => {
 *     seedAdminUser();
 * }, []);
 * 
 * 2. Abrir la app en el navegador
 * 3. Verificar en consola que se creó el admin
 * 4. ELIMINAR el código del useEffect
 * 5. Ya puedes login con el admin
 */
