import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

// conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2902",
    database: "cafeteria-signin"
});

// ruta para registro
app.post("/register", async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;


    try {
        // encriptar contraseña
        const hash = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO `Sign-in` (username, Email, Password) VALUES (?, ?, ?)";
        db.query(sql, [username, email, hash], (err) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Error al registrar" });
            }

            res.json({ message: "Usuario registrado correctamente" });
        });

    } catch (error) {
        console.log(error);
        res.json({ message: "Error en el servidor" });
    }
});

// iniciar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body  // coincide con name="username"

  if (!username || !password) {
    return res.status(400).json({ error: 'Campos obligatorios' })
  }

  // Busca por email O por nombre de usuario
  const [rows] = await connection.query(
    'SELECT * FROM users WHERE email = ? OR username = ?',
    [username, username]  // mismo valor, dos columnas
  )

  if (rows.length === 0) {
    return res.status(401).json({ error: 'Usuario no encontrado' })
  }

  const user = rows[0]
  const match = await bcrypt.compare(password, user.password_hash)

  if (!match) {
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }

  res.status(200).json({ message: 'Login exitoso', userId: user.id })
})