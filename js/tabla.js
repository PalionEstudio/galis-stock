const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQwn7lG9BEyC6TH3WhyOELMTLmP4Vw3SvQ8Dfc05PJJfxGHMoCtQ6o8OmqP41p7Zf_3buBROcl-57ZU/pub?gid=181536988&single=true&output=csv';

function cargarTabla() {
  document.getElementById('mensaje').textContent = 'Cargando stock...';
  document.getElementById('tabla-container').innerHTML = '';

  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      const filas = data.trim().split('\n').map(linea => linea.split(','));
      const headers = filas[0];
      let productos = filas.slice(1);

      // Filtrar por cantidad >= 5
      productos = productos.filter(f => parseInt(f[0]) >= 5);

      // Ordenar por nombre (columna 1)
      productos.sort((a, b) => a[1].localeCompare(b[1]));

      // Volver a incluir el encabezado
      const todas = [headers, ...productos];

      // Crear tabla
      const tabla = document.createElement('table');

      todas.forEach((fila, index) => {
        const tr = document.createElement('tr');

        fila.forEach((col, colIndex) => {
          const celda = index === 0 ? document.createElement('th') : document.createElement('td');

          if (colIndex === 0) {
            celda.classList.add('col-stock');
            if (index === 0) {
              celda.textContent = col;
            } else {
              const valor = parseInt(col);
              if (valor >= 5) {
                const circulo = document.createElement('span');
                circulo.className = 'indicador verde';
                celda.appendChild(circulo);
              }
            }
          }

          if (colIndex === 1) {
            celda.classList.add('col-producto');
            celda.textContent = col;
          }

          if (colIndex === 2) {
            celda.classList.add('col-valor');
            celda.textContent = index === 0 ? col : `$${parseInt(col).toLocaleString('es-AR')}`;
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
