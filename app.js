// 🔥 CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDLGTFu_TNp_3qpfRWjNClLpelBZn6dNLw",
  authDomain: "citasautolavado.firebaseapp.com",
  projectId: "citasautolavado",
  storageBucket: "citasautolavado.firebasestorage.app",
  messagingSenderId: "901728075794",
  appId: "1:901728075794:web:ff19a18e0b18b19a8e98cb"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Referencias HTML
const form = document.getElementById("citaForm");
const estado = document.getElementById("estado");

let citaId = null;

// 🔁 AL CARGAR LA PÁGINA
window.addEventListener("load", () => {
  const citaGuardada = localStorage.getItem("citaId");

  if (citaGuardada) {
    citaId = citaGuardada;
    estado.innerText = "🔄 Revisando estado de tu cita...";
    estado.style.color = "#38bdf8";
    escucharEstado();
  }
});

// 📤 ENVIAR SOLICITUD
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: nombre.value,
    calle: calle.value,
    colonia: colonia.value,
    referencia: referencia.value,
    telefono: telefono.value,
    aceptada: false,
    fechaServicio: "",
    horaServicio: "",
    creada: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    const doc = await db.collection("citas").add(data);
    citaId = doc.id;

    // 💾 GUARDAR ID LOCAL
    localStorage.setItem("citaId", citaId);

    estado.innerText = "🕒 Solicitud enviada, espere confirmación...";
    estado.style.color = "#facc15";

    escucharEstado();
    form.reset();
  } catch (error) {
    estado.innerText = "❌ Error al enviar la solicitud";
    estado.style.color = "red";
    console.error(error);
  }
});

// 👂 ESCUCHAR CAMBIOS EN FIRESTORE
function escucharEstado() {
  if (!citaId) return;

  db.collection("citas").doc(citaId)
    .onSnapshot((doc) => {
      if (!doc.exists) {
        estado.innerText = "⚠️ No se encontró tu cita";
        estado.style.color = "red";
        return;
      }

      const cita = doc.data();

      if (cita.aceptada === false) {
        estado.innerText = "🕒 Tu cita sigue en espera de confirmación";
        estado.style.color = "#facc15";
      }

      if (cita.aceptada === true) {
        estado.innerText =
`✅ Cita aceptada
📅 Día: ${cita.fechaServicio}
⏰ Hora de llegada: ${cita.horaServicio}`;
        estado.style.color = "#22c55e";
      }
    });
}
