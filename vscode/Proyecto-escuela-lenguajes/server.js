const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de MySQL - Ajusta estos valores según tu configuración
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Lacacaesbonita1',
    database: 'login'
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a la base de datos MySQL');
    
    // Crear tabla de usuarios si no existe
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
      
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creando tabla usuarios:', err);
        } else {
            console.log('✅ Tabla "usuarios" verificada/creada');
        }
    });
    
    // CREAR TABLA DE CITAS - AGREGAR ESTO
    const createCitasTableQuery = `
        CREATE TABLE IF NOT EXISTS citas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            titulo VARCHAR(255) NOT NULL,
            fecha DATE NOT NULL,
            hora TIME NOT NULL,
            descripcion TEXT,
            color VARCHAR(50),
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `;
    
    db.query(createCitasTableQuery, (err) => {
        if (err) {
            console.error('Error creando tabla citas:', err);
        } else {
            console.log('✅ Tabla "citas" verificada/creada');
        }
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Obtener todos los usuarios
app.get('/get-users', (req, res) => {
    const query = 'SELECT * FROM usuarios ORDER BY fecha_registro DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error obteniendo usuarios:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al obtener usuarios' 
            });
        }
        
        res.json({ 
            success: true, 
            users: results 
        });
    });
});

// API: Crear nuevo usuario (registro)
app.post('/crear-usuario', (req, res) => {
    const { nombre, email, password } = req.body;
    
    // Validaciones básicas
    if (!nombre || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos son requeridos' 
        });
    }
    
    if (password.length < 8) {
        return res.status(400).json({ 
            success: false, 
            message: 'La contraseña debe tener al menos 8 caracteres' 
        });
    }
    
    // Verificar si el usuario ya existe
    const checkQuery = 'SELECT * FROM usuarios WHERE email = ? OR nombre = ?';
    db.query(checkQuery, [email, nombre], (err, results) => {
        if (err) {
            console.error('Error verificando usuario:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error en el servidor' 
            });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'El usuario o email ya están registrados' 
            });
        }
        
        // Insertar nuevo usuario
        const insertQuery = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
        db.query(insertQuery, [nombre, email, password], (err, result) => {
            if (err) {
                console.error('Error insertando usuario:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al crear usuario' 
                });
            }
            
            console.log(`✅ Nuevo usuario creado: ${nombre} (ID: ${result.insertId})`);
            
            // Obtener el usuario recién creado para devolverlo
            const getUserQuery = 'SELECT * FROM usuarios WHERE id = ?';
            db.query(getUserQuery, [result.insertId], (err, userResults) => {
                if (err || userResults.length === 0) {
                    return res.json({ 
                        success: true, 
                        message: 'Usuario creado exitosamente',
                        userId: result.insertId
                    });
                }
                
                res.json({ 
                    success: true, 
                    message: 'Usuario creado exitosamente',
                    usuario: userResults[0]
                });
            });
        });
    });
});

// API: Login de usuario
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email y contraseña son requeridos' 
        });
    }
    
    // Buscar usuario por email y contraseña
    const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error en login:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error en el servidor' 
            });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email o contraseña incorrectos' 
            });
        }
        
        // Login exitoso
        const user = results[0];
        
        // Registrar inicio de sesión (opcional: puedes crear otra tabla para logs)
        console.log(`✅ Inicio de sesión exitoso: ${user.nombre} (ID: ${user.id})`);
        
        res.json({ 
            success: true, 
            message: 'Login exitoso',
            usuario: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            }
        });
    });
});

// API: Eliminar usuario
app.delete('/delete-user/:id', (req, res) => {
    const userId = req.params.id;
    
    if (!userId) {
        return res.status(400).json({ 
            success: false, 
            message: 'ID de usuario requerido' 
        });
    }
    
    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error eliminando usuario:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al eliminar usuario' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }
        
        console.log(`✅ Usuario eliminado: ID ${userId}`);
        res.json({ 
            success: true, 
            message: 'Usuario eliminado exitosamente' 
        });
    });
});

// API: Limpiar todos los usuarios (CUIDADO: solo para desarrollo)
app.delete('/clear-users', (req, res) => {
    const query = 'DELETE FROM usuarios';
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error limpiando usuarios:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al limpiar base de datos' 
            });
        }
        
        console.log(`✅ Base de datos limpiada: ${result.affectedRows} usuarios eliminados`);
        res.json({ 
            success: true, 
            message: `Base de datos limpiada exitosamente. ${result.affectedRows} usuarios eliminados.` 
        });
    });
});

// API: Exportar usuarios a CSV
app.get('/export-users/csv', (req, res) => {
    const query = 'SELECT * FROM usuarios ORDER BY fecha_registro DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error obteniendo usuarios para exportar:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al exportar usuarios' 
            });
        }
        
        // Crear CSV
        let csv = 'ID,Nombre,Email,Fecha Registro\n';
        results.forEach(user => {
            const fecha = new Date(user.fecha_registro).toLocaleString('es-MX');
            csv += `${user.id},"${user.nombre}","${user.email}","${fecha}"\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=usuarios-worldschool.csv');
        res.send(csv);
    });
});

// API: Obtener estadísticas
app.get('/stats', (req, res) => {
    const statsQueries = {
        total: 'SELECT COUNT(*) as total FROM usuarios',
        today: `SELECT COUNT(*) as today FROM usuarios WHERE DATE(fecha_registro) = CURDATE()`,
        lastMonth: `SELECT COUNT(*) as lastMonth FROM usuarios WHERE fecha_registro >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    };
    
    db.query(statsQueries.total, (err, totalResult) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error obteniendo estadísticas' });
        }
        
        db.query(statsQueries.today, (err, todayResult) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error obteniendo estadísticas' });
            }
            
            db.query(statsQueries.lastMonth, (err, lastMonthResult) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error obteniendo estadísticas' });
                }
                
                res.json({
                    success: true,
                    stats: {
                        total: totalResult[0].total,
                        today: todayResult[0].today,
                        lastMonth: lastMonthResult[0].lastMonth
                    }
                });
            });
        });
    });
});

// API: Obtener citas de un usuario específico
app.get('/get-citas/:usuario_id', (req, res) => {
    const usuarioId = req.params.usuario_id;
    
    const query = 'SELECT * FROM citas WHERE usuario_id = ? ORDER BY fecha, hora';
    
    db.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error obteniendo citas:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al obtener citas' 
            });
        }
        
        res.json({ 
            success: true, 
            citas: results 
        });
    });
});

// API: Crear nueva cita
app.post('/crear-cita', (req, res) => {
    const { usuario_id, titulo, fecha, hora, descripcion, color } = req.body;
    
    console.log('Recibiendo datos para cita:', { usuario_id, titulo, fecha, hora, descripcion, color });
    
    if (!usuario_id || !fecha || !hora) {
        return res.status(400).json({ 
            success: false, 
            message: 'Usuario, fecha y hora son requeridos' 
        });
    }
    
    // Validar que usuario_id sea un número
    const userId = parseInt(usuario_id);
    if (isNaN(userId)) {
        return res.status(400).json({ 
            success: false, 
            message: 'ID de usuario inválido' 
        });
    }
    
    // Verificar primero si el usuario existe
    const checkUserQuery = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(checkUserQuery, [userId], (err, userResults) => {
        if (err) {
            console.error('Error verificando usuario:', err);
            return res.status(500).json({
                success: false,
                message: 'Error verificando usuario'
            });
        }
        
        if (userResults.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El usuario no existe'
            });
        }
        
        // Verificar si ya existe una cita en esa fecha y hora para este usuario
        const checkCitaQuery = 'SELECT * FROM citas WHERE usuario_id = ? AND fecha = ? AND hora = ?';
        db.query(checkCitaQuery, [userId, fecha, hora], (err, citaResults) => {
            if (err) {
                console.error('Error verificando cita existente:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error verificando disponibilidad'
                });
            }
            
            if (citaResults.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya tienes una cita en esta fecha y hora'
                });
            }
            
            // Crear la cita
            const insertQuery = 'INSERT INTO citas (usuario_id, titulo, fecha, hora, descripcion, color) VALUES (?, ?, ?, ?, ?, ?)';
            const params = [userId, titulo || 'Clase de Inglés', fecha, hora, descripcion || '', color || '#a8a054'];
            
            db.query(insertQuery, params, (err, result) => {
                if (err) {
                    console.error('Error creando cita:', err);
                    console.error('SQL Error:', err.sqlMessage);
                    
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error al crear cita en la base de datos',
                        error: err.code
                    });
                }
                
                console.log('Cita creada con ID:', result.insertId);
                
                // Obtener la cita creada con todos sus datos
                const getCitaQuery = 'SELECT * FROM citas WHERE id = ?';
                db.query(getCitaQuery, [result.insertId], (err, citaResults) => {
                    if (err || citaResults.length === 0) {
                        // Si no podemos obtener la cita, al menos devolvemos el ID
                        return res.json({ 
                            success: true, 
                            message: 'Cita creada exitosamente',
                            citaId: result.insertId,
                            fecha: fecha,
                            hora: hora
                        });
                    }
                    
                    res.json({ 
                        success: true, 
                        message: 'Cita creada exitosamente',
                        cita: citaResults[0]
                    });
                });
            });
        });
    });
});

// API: Eliminar cita
app.delete('/delete-cita/:id', (req, res) => {
    const citaId = req.params.id;
    
    const query = 'DELETE FROM citas WHERE id = ?';
    db.query(query, [citaId], (err, result) => {
        if (err) {
            console.error('Error eliminando cita:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al eliminar cita' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cita no encontrada' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Cita eliminada exitosamente' 
        });
    });
});

// API: Obtener estadísticas de usuarios (para admin)
app.get('/admin-stats', (req, res) => {
    const statsQueries = {
        totalUsuarios: 'SELECT COUNT(*) as total FROM usuarios',
        totalCitas: 'SELECT COUNT(*) as total FROM citas',
        usuariosHoy: 'SELECT COUNT(*) as hoy FROM usuarios WHERE DATE(fecha_registro) = CURDATE()',
        citasHoy: 'SELECT COUNT(*) as hoy FROM citas WHERE DATE(fecha) = CURDATE()',
        usuariosActivos: 'SELECT COUNT(DISTINCT usuario_id) as activos FROM citas WHERE fecha >= CURDATE()'
    };
    
    // Ejecutar todas las consultas
    Promise.all([
        queryAsync(statsQueries.totalUsuarios),
        queryAsync(statsQueries.totalCitas),
        queryAsync(statsQueries.usuariosHoy),
        queryAsync(statsQueries.citasHoy),
        queryAsync(statsQueries.usuariosActivos)
    ])
    .then(results => {
        res.json({
            success: true,
            stats: {
                totalUsuarios: results[0][0].total,
                totalCitas: results[1][0].total,
                usuariosHoy: results[2][0].hoy,
                citasHoy: results[3][0].hoy,
                usuariosActivos: results[4][0].activos
            }
        });
    })
    .catch(err => {
        console.error('Error obteniendo estadísticas:', err);
        res.status(500).json({ success: false, message: 'Error obteniendo estadísticas' });
    });
});

// Función helper para promisificar queries
function queryAsync(query, params = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

// Manejar rutas no encontradas - REEMPLAZADO
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Ruta no encontrada' 
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Panel de administración: http://localhost:${PORT}/admin.html`);
});

// Manejar cierre del servidor
process.on('SIGINT', () => {
    console.log('\n👋 Cerrando servidor y conexión a MySQL...');
    db.end();
    process.exit();
});