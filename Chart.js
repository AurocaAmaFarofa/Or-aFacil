const grafico = document.querySelector('#grafico-materiais')

function renderizarGrafico() {
  let dataSets = {}
  const materiais = appData.materiais

  materiais.forEach((item, indice) => {
    if (dataSets[item.categoria] === undefined) {
      dataSets[item.categoria] = 1
    } else {
      dataSets[item.categoria] += 1
    }
  })

  const data = Object.values(dataSets)

  console.log(data)

  new Chart(grafico, {
    type: 'pie',
    data: {
      labels: appData.categorias,
      datasets: [
        { data, backgroundColor: ['#287fb9', '#6abbf2', '#235b81', '#3469db'] },
      ],
    },
    options: {},
  })
}

const data = { data: [] }

renderizarGrafico()
