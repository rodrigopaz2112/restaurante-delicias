const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago"); // debe usar require, no import

const app = express();
const PORT = process.env.PORT || 3000;

mercadopago.configure({
  access_token:
    "TEST-7367127811004064-041620-2c9a3bf2acdd081258755e92d1266b38-423810740",
});

app.use(cors());
app.use(express.json());

app.post("/crear-preferencia", async (req, res) => {
  const { carrito } = req.body;

  const items = carrito.map((producto) => ({
    title: producto.nombre,
    unit_price: producto.precio,
    quantity: 1,
  }));

  try {
    const preferencia = await mercadopago.preferences.create({
      items,
      back_urls: {
        success: "https://tusitio.com/exito",
        failure: "https://tusitio.com/fallo",
        pending: "https://tusitio.com/pendiente",
      },
      auto_return: "approved",
    });

      res.json({ id: preferencia.body.id });
    } catch (error) {
      console.error("Error al crear preferencia:", error.response || error.message || error);
      res.status(500).json({ error: "Error al crear la preferencia", details: error.message });
    }
    
 
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

