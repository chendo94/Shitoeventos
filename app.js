import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXMqbxVoSCZ117xHqWqY67abAk8iNrwMU",
  authDomain: "eventospagos-1414.firebaseapp.com",
  projectId: "eventospagos-1414",
  storageBucket: "eventospagos-1414.firebasestorage.app",
  messagingSenderId: "204292750312",
  appId: "1:204292750312:web:b8a314e2b9b67bdb5b425d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.mostrarSeccion = (id) => {
  document.querySelectorAll('.seccion').forEach(s => s.classList.add('oculto'));
  document.getElementById(id).classList.remove('oculto');
  if (id === 'consultar') cargarEventos();
};

window.marcarTodos = () => {
  const marcado = document.getElementById('todos').checked;
  document.querySelectorAll('.integrante').forEach(i => i.checked = marcado);
};

window.guardarEvento = async () => {
  const fecha = document.getElementById('fecha').value;
  const horas = document.getElementById('horas').value;
  const referencia = document.getElementById('referencia').value;

  const integrantes = [...document.querySelectorAll('.integrante')]
    .filter(i => i.checked)
    .map(i => i.value);

  if (!fecha || !horas || integrantes.length === 0) {
    alert("Completa todos los campos");
    return;
  }

  await setDoc(doc(db, "eventos", fecha), {
    fecha,
    horas,
    referencia,
    integrantes,
    creado: new Date()
  });

  document.getElementById('resumen').innerHTML = `
    ✅ <strong>Registro exitoso</strong><br>
    📅 ${fecha}<br>
    ⏱ ${horas} horas<br>
    👥 ${integrantes.join(', ')}<br>
    📝 ${referencia}
  `;
};

const cargarEventos = async () => {
  const lista = document.getElementById('listaEventos');
  lista.innerHTML = "";

  const snapshot = await getDocs(collection(db, "eventos"));
  snapshot.forEach(docSnap => {
    const e = docSnap.data();
    lista.innerHTML += `
      <div class="evento">
        <strong>${e.fecha}</strong><br>
        ⏱ ${e.horas} horas<br>
        👥 ${e.integrantes.join(', ')}<br>
        📝 ${e.referencia}<br>
        <button onclick="borrarEvento('${docSnap.id}')">🗑 Borrar</button>
      </div>
    `;
  });
};

window.borrarEvento = async (id) => {
  if (confirm("¿Seguro que deseas borrar este evento?")) {
    await deleteDoc(doc(db, "eventos", id));
    cargarEventos();
  }
};
