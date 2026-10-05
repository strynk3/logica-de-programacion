const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta actual
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Lacacaesbonita1",
  database: "calendario"
});

// Verificar conexión
db.connect(err => {
  if (err) {
    console.error("Error de conexión a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL correctamente");
});

// ============================
// GUARDAR CITA
// ============================
app.post("/citas", (req, res) => {
  const { nombre, expediente, telefono, tramite, fecha, hora } = req.body;

  // Validación
  if (!nombre || !telefono || !tramite || !fecha || !hora) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO citas (nombre, expediente, telefono, tramite, fecha, hora) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nombre, expediente, telefono, tramite, fecha, hora], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al guardar la cita" });
    }

    res.json({
      message: "Cita guardada correctamente",
      id: result.insertId
    });
  });
});

// ============================
// OBTENER CITAS (MODIFICADO)
// ============================
app.get("/citas", (req, res) => {
  // Ahora también pedimos el estado y lo que decidió cada juez
  const sql = `
    SELECT 
      id, nombre, expediente, telefono, tramite, 
      DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, hora,
      estado, juez1, juez2, juez3
    FROM citas
    ORDER BY fecha, hora
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener citas" });
    }
    res.json(result);
  });
});

// ============================
// ACTUALIZAR ESTADO Y JUECES (NUEVO)
// ============================
app.put("/citas/:id/estado", (req, res) => {
  const { id } = req.params;
  const { estado, juez1, juez2, juez3 } = req.body;

  const sql = `
    UPDATE citas 
    SET estado = ?, juez1 = ?, juez2 = ?, juez3 = ? 
    WHERE id = ?
  `;

  db.query(sql, [estado, juez1, juez2, juez3, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al actualizar la base de datos" });
    }
    res.json({ message: "Actualizado correctamente en la base de datos" });
  });
});

// ============================
// RUTA PRINCIPAL - Sirve el archivo HTML
// ============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "principal.html"));
});

app.delete("/citas/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM citas WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al eliminar la cita" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.json({ message: "Cita eliminada correctamente" });
  });
});



// ============================
// INICIAR SERVIDOR
// ============================
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});