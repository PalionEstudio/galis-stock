document.addEventListener('DOMContentLoaded', function () {
  const url =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQNY_a-ccwZz44nAHulbhVTruP-Qk-FbAH1hrMkBrkkoOG_A1hVnmhe_9v4HzMdEqEB07ObknvtRL7e/pub?output=csv';

  const tabla = document.getElementById('tabla');

  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const filas = data.trim().split('\n');
      filas.shift(); // Eliminamos la fila de encabezado

      filas.forEach((fila) => {
        const columnas = fila.split(',');

        const producto = columnas[0];
        const stock = columnas[1];
        const valor = columnas[2];

        if (producto && stock) {
          const filaHTML = document.createElement('tr');
          filaHTML.innerHTML = `
            <td>${producto}</td>
            <td>${stock}</td>
            <td>${valor ? `$${parseFloat(valor).toFixed(2)}` : ''}</td>
          `;
          tabla.appendChild(filaHTML);
        }
      });
    })
    .catch((error) => console.error('Error al cargar los datos:', error));
});
