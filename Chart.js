const grafico = document.querySelector('#grafico-materiais')

function renderizarGrafico() {
  let contadorCategorias = {}
  let total = 0

  appData.materiais.forEach((item, indice) => {
    if (labels.some((n) => n === item.categoria) !== item.categoria) {
      novaCategoria = {
        categoria: item.categoria,
        quantia: 1,
      }

      labels.push(item.categoria)
      contadorCategorias.push(novaCategoria)
      total += 1

      if (
        contadorCategorias.some((c) => c.cateogria === item.categoria) ===
        item.categoria
      ) {
        contadorCategorias[indice].quantia += 1
      }
    }
  })
}
