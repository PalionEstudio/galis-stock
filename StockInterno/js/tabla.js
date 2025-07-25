const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQwn7lG9BEyC6TH3WhyOELMTLmP4Vw3SvQ8Dfc05PJJfxGHMoCtQ6o8OmqP41p7Zf_3buBROcl-57ZU/pub?gid=181536988&single=true&output=csv';

let datosOriginales = [];

function cargarTabla() {
  document.getElementById('mensaje').textContent = 'Cargando stock...';
  document.getElementById('tabla-container').innerHTML = '';

  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      const filas = data.trim().split('\n').map(linea => linea.split(','));
      datosOriginales = filas.slice(1); // sin cabecera
      renderizarTabla([filas[0], ...datosOriginales]);
      document.getElementById('mensaje').textContent = '';
      document.getElementById('update-time').textContent = 'Última actualización: ' + new Date().toLocaleString();
    })
    .catch(err => {
      document.getElementById('mensaje').textContent = 'Error al cargar el stock.';
      console.error(err);
    });
}

function renderizarTabla(filas) {
  const contenedor = document.getElementById('tabla-container');
  contenedor.innerHTML = '';
  const tabla = document.createElement('table');

  filas.forEach((fila, index) => {
    const tr = document.createElement('tr');
    let valor = null;

    fila.forEach((col, colIndex) => {
      const celda = index === 0 ? document.createElement('th') : document.createElement('td');

      if (colIndex === 0) {
        celda.classList.add('col-stock');
        if (index !== 0) {
          valor = parseInt(col);
          if (!isNaN(valor)) {
            celda.textContent = valor;
            if (valor > 5) celda.style.color = '#22c55e';       // verde
            else if (valor > 0) celda.style.color = '#facc15';  // amarillo
            else celda.style.color = '#ef4444';                 // rojo
          } else {
            celda.textContent = '';
          }
        } else {
          celda.textContent = col;
        }
      }

      if (colIndex === 1) {
        celda.classList.add('col-producto');
        celda.textContent = col;
        if (index !== 0 && !isNaN(valor) && valor < 0) {
          celda.style.color = '#ef4444';
        }
      }

      tr.appendChild(celda);
    });

    tabla.appendChild(tr);
  });

  contenedor.appendChild(tabla);
}

function ordenar(tipo, orden) {
  if (!datosOriginales.length) return;

  const filasOrdenadas = [...datosOriginales];

  filasOrdenadas.sort((a, b) => {
    if (tipo === 'cantidad') {
      const valA = parseInt(a[0]);
      const valB = parseInt(b[0]);
      return orden === 'asc' ? valA - valB : valB - valA;
    } else {
      const nomA = a[1].toLowerCase();
      const nomB = b[1].toLowerCase();
      return orden === 'asc' ? nomA.localeCompare(nomB) : nomB.localeCompare(nomA);
    }
  });

  renderizarTabla([['Cantidad', 'Producto'], ...filasOrdenadas]);
}

cargarTabla();
