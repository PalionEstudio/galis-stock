const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQwn7lG9BEyC6TH3WhyOELMTLmP4Vw3SvQ8Dfc05PJJfxGHMoCtQ6o8OmqP41p7Zf_3buBROcl-57ZU/pub?gid=181536988&single=true&output=csv';

function cargarTabla() {
  document.getElementById('mensaje').textContent = 'Cargando stock...';
  document.getElementById('tabla-container').innerHTML = '';

  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      const filas = data.trim().split('\n').map(linea => linea.split(','));
      const tabla = document.createElement('table');

      filas.forEach((fila, index) => {
        const tr = document.createElement('tr');

        fila.forEach((col, colIndex) => {
          const celda = index === 0 ? document.createElement('th') : document.createElement('td');

          // Columna stock
          if (colIndex === 0) {
            celda.classList.add('col-stock');
            if (index !== 0) {
              const valor = parseInt(col);
              if (isNaN(valor)) {
                celda.textContent = '';
              } else if (valor > 5) {
                celda.innerHTML = '<span class="indicador verde"></span>';
              } else {
                celda.textContent = valor;
                celda.style.color = '#facc15';
              }
            } else {
              celda.textContent = col;
            }
          }

          // Columna producto
          if (colIndex === 1) {
            celda.classList.add('col-producto');
            celda.textContent = col;
          }

          tr.appendChild(celda);
        });

        tabla.appendChild(tr);
      });

      document.getElementById('tabla-container').appendChild(tabla);
      document.getElementById('mensaje').textContent = '';
      document.getElementById('update-time').textContent = 'Última actualización: ' + new Date().toLocaleString();
    })
    .catch(err => {
      document.getElementById('mensaje').textContent = 'Error al cargar el stock.';
      console.error(err);
    });
}

cargarTabla();
