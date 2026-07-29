// Criar classe materiais pra aprender de vez o Prototype

const bancoMateriais = appData.materiais[0]
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

  descricao() {
    return `
      Nome: ${this.nome}
      Valor: R$ ${this.valor}
      Medida: ${this.medida}
      Categoria: ${this.categoria}
    `
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

  const nomeF = palavraMaiuscula(materialBanco.nome)

  modalInnerDescricao.innerHTML = `
    <div>
      <h3>${nomeF}</h3>
    </div>
  `

  abrirFecharModal('abrir', localPopupDescricao)
}

//class Item {}

//abrirPopup(material) {
//    popup.innerHTML = material.descricao();
//}
