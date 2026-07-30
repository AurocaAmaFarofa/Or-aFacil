const localPopupDescricao = document.querySelector('#modal-descricao')
const modalInnerDescricao = document.querySelector('#modal-inner-descricao')

class Item {
  constructor(nome) {
    this.nome = nome
  }
}

class Material extends Item {
  constructor(nome, valor, medida, categoria) {
    super(nome)

    this.valor = valor
    this.medida = medida
    this.categoria = categoria
  }

  nomeFormatado() {
    return palavraMaiuscula(this.nome)
  }

  valorFormatado() {
    return `R$ ${this.valor.toFixed(2)}`
  }
}

function mostrarDescricao(indice) {
  const materialBanco = appData.materiais[indice]

  const material = new Material(
    materialBanco.nome,
    materialBanco.valor,
    materialBanco.medida,
    materialBanco.categoria,
  )

  renderizarPopupDescricao(material)
}

function renderizarPopupDescricao(material) {
  modalInnerDescricao.innerHTML = `
    <div>
      <h3>${material.nomeFormatado()}</h3>
      <div class="container-info-material">
        <span>Valor: ${material.valorFormatado()}</span>
        <span>Medida: ${material.medida}</span>
        <span>Categoria: ${material.categoria}</span>
      </div>
    </div>
  `

  abrirFecharModal('abrir', localPopupDescricao)
}
