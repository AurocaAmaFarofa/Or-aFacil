// appData do nosso aplicativo //

const appData = JSON.parse(localStorage.getItem('appData')) || {
  materiais: [],
  orcamentos: [],
  categorias: ['geral'],
  valorT: 0,
}

// SPA manager //

let paginaAtiva = 'main'

function mostrarPagina(idPagina) {
  document.querySelectorAll('.pagina').forEach((p) => {
    p.classList.remove('ativa')
  })

  const pagina = document.querySelector(`#${idPagina}-page`)
  if (pagina) {
    pagina.classList.add('ativa')
    paginaAtiva = idPagina
  }
}

mostrarPagina('main')

// salvar dados no appData //

function salvarDados() {
  localStorage.setItem('appData', JSON.stringify(appData))
}

// funcção pra renderizar tudo //

function renderizarTudo() {
  renderizarMateriais()
  renderizarTabela()
  renderizarMateriaisPagina()
}

// função pra mostrar erro com texto //

function mostrarErro(mensagem, lugar) {
  console.log(mensagem, lugar)
  lugar.textContent = ''
  lugar.classList.add('display-block')
  lugar.textContent = `${mensagem}`
}

function tempoErro(modalErro, duracao = 3000) {
  setTimeout(() => {
    modalErro.classList.remove('display-block')
    modalErro.textContent = ''
  }, duracao)
  return
}

// mostrar popup na tela //

const popupModal = document.querySelector('#popup-modal')
const popupCardTemplate = document.querySelector('.popup-card')
if (popupCardTemplate) {
  popupCardTemplate.remove() // excluimos a template pra nâo atrapalhar no HTML
}

function showPopup(text, duration = 2000) {
  if (!popupModal || !popupCardTemplate) return

  const popupCard = popupCardTemplate.cloneNode(true) // faz uma cópia completa do popupCardTemplate, já que excluimos ela
  const popupModalText = popupCard.querySelector('#popup-modal-text')

  popupModalText.textContent = text
  popupCard.style.setProperty('--popup-duration', `${duration}ms`)
  popupCard.classList.remove('exit')
  popupModal.appendChild(popupCard)
  popupModal.classList.add('show')

  requestAnimationFrame(() => {
    // pra animação do card aparecer
    popupCard.classList.add('show')
  })

  if (duration > 0) {
    setTimeout(() => {
      popupCard.classList.add('exit')
      setTimeout(() => {
        popupCard.remove()
        if (!popupModal.querySelector('.popup-card')) {
          popupModal.classList.remove('show')
        }
      }, 380)
    }, duration)
  }
}

function hidePopup() {
  if (!popupModal) return

  const popupCards = popupModal.querySelectorAll('.popup-card')

  popupCards.forEach((card) => {
    card.classList.add('exit')
    setTimeout(() => {
      card.remove()
      if (!popupModal.querySelector('.popup-card')) {
        popupModal.classList.remove('show')
      }
    }, 380)
  })
}

const confirmarExclusao = document.querySelector('#confirmar-exclusao') // card de verificação
const btnConfirmarExcluir = document.querySelector('#btn-confirmar-excluir') // btn pra confirmar
const btnCancelarExcluir = document.querySelector('#btn-cancelar-excluir') // btn pra cancelar
const backdropConfirmarExcluir = document.querySelector('.confirmar-backdrop') // div pra deixar o fundo escuro
let indiceParaExcluir = null // variavel pra verificar se vai ser excluido ou não

function abrirConfirmacao(indice) {
  indiceParaExcluir = indice

  if (confirmarExclusao) {
    confirmarExclusao.classList.add('show')
  } // função pra abrir o modal e pegar junto o indice pra excluir o item certo dai
}

function fecharConfirmacao() {
  indiceParaExcluir = null

  if (confirmarExclusao) {
    confirmarExclusao.classList.remove('show')
  } // função pra fechar o modal
}

let indiceEmEdicao = null

const inputEditarNome = document.querySelector('#editar-nome-material')
const inputEditarValor = document.querySelector('#editar-valor-material')
const selecionarEditarMedida = document.querySelector(
  '#editar-selecionar-medida',
)
const selecionarEditarCategoria = document.querySelector(
  '#editar-selecionar-categoria',
)
const modalEditar = document.querySelector('#editar-material')

const editarErroMaterial = document.querySelector('#editar-erro-material')
const editarErroValor = document.querySelector('#editar-erro-valor')
const editarErroMedida = document.querySelector('#editar-erro-medida-material')
const editarErroCategoria = document.querySelector('#editar-erro-categoria')

function editarMaterial(indice) {
  indiceEmEdicao = indice

  materialPraEditar = appData.materiais[indice]

  inputEditarNome.value = materialPraEditar.nome
  inputEditarValor.value = materialPraEditar.valor
  selecionarEditarMedida.value = materialPraEditar.medida

  modalEditar.classList.add('show')
}

function fecharModalEdicao() {
  if (modalEditar) {
    modalEditar.classList.remove('show')
  }
}

function salvarEdicao() {
  nomeAtual = appData.materiais[indiceEmEdicao].nome
  valorAtual = appData.materiais[indiceEmEdicao].valor
  medidaAtual = appData.materiais[indiceEmEdicao].medida

  if (nomeAtual !== inputEditarNome.value) {
    nomeFormatado = palavraMinuscula(inputEditarNome.value)
    if (appData.materiais.some((m) => m.nome === nomeFormatado)) {
      mostrarErro('Material já existe', editarErroMaterial)
      tempoErro(editarErroMaterial)
      return
    }
  }

  if (!inputEditarValor.value) {
    mostrarErro('Por favor, insira um valor', editarErroValor)
    tempoErro(editarErroValor)
    return
  }

  if (valorAtual !== Number(inputEditarValor.value)) {
    if (inputEditarValor <= 0) {
      mostrarErro('Insira um valor válido', editarErroValor)
      tempoErro(editarErroValor)
      return
    }
  }

  if (medidaAtual !== selecionarEditarMedida.value) {
    if (!selecionarEditarMedida) {
      mostrarErro('Por favor, selecione uma medida', editarErroMedida)
      tempoErro(editarErroMedida)
      return
    }
  }

  if (!inputEditarNome.value) {
    mostrarErro('Por favor, insira um novo nome', editarErroMaterial)
    tempoErro(editarErroMaterial)
    return
  }

  appData.materiais[indiceEmEdicao].nome = inputEditarNome.value
  appData.materiais[indiceEmEdicao].valor = Number(inputEditarValor.value)
  appData.materiais[indiceEmEdicao].medida = selecionarEditarMedida.value

  appData.orcamentos[indiceEmEdicao].material = inputEditarNome.value
  appData.orcamentos[indiceEmEdicao].preco = Number(inputEditarValor.value)
  appData.orcamentos[indiceEmEdicao].medida = selecionarEditarMedida.value

  salvarDados()
  renderizarTudo()
  fecharModalEdicao()
}

// excluir coisas //

const btnExcluirTudo = document.querySelector('#excluir-local-storage') // botão pra exluir localStorage

btnExcluirTudo.addEventListener('click', () => {
  localStorage.clear()
  window.location.reload()
})

function excluir(indice, array) {
  if (indice !== undefined) {
    if (indice < 0 || indice >= array.length) {
      return
    }

    array.splice(indice, 1)
    salvarDados()
    renderizarTudo()
  }
}

btnConfirmarExcluir?.addEventListener('click', () => {
  if (indiceParaExcluir !== null) {
    excluir(indiceParaExcluir, appData.orcamentos) // evento adicionado ao botão que se ele for clicado ele excloi o item
  }
  fecharConfirmacao()
})

btnCancelarExcluir?.addEventListener('click', fecharConfirmacao) // se o usuario escolher "não" o modal fecha
backdropConfirmarExcluir?.addEventListener('click', fecharConfirmacao) // fecha depois do clique

// formatações //

function formatarNumero(numero) {
  return 'R$ ' + numero.toFixed(2)
}

function palavraMinuscula(palavra) {
  return palavra.toLowerCase()
}

function palavraMaiuscula(palavra) {
  const palavraNova = palavra.charAt(0).toUpperCase() + palavra.slice(1)
  return palavraNova
}

//=======================================================================================//
// primeira section (criar material) //

const inputMaterial = document.querySelector('#nome-material') // nome do material
const inputValorMaterial = document.querySelector('#valor-input') // valor do material
const selectMedida = document.querySelector('#selecionar-medida') // tipo de medida do material
const formMaterial = document.querySelector('#formulario-material') // form pra corrigir o bug de recarregar a pagina
const erroMaterialHtml = document.querySelector('#erro-material') // elemento html pro erro
const erroMaterialValor = document.querySelector('#valor-material-erro') // html pro erro valor
const erroMedida = document.querySelector('#erro-medida-material')
const erroCategoria = document.querySelector('#erro-selecionar-categoria')

formMaterial.addEventListener('submit', (evento) => {
  evento.preventDefault()

  const nomeMaterial = inputMaterial.value
  const valorMaterial = Number(inputValorMaterial.value)
  const medidaMaterial = selectMedida.value
  const selecionarCategoria = document.querySelector('#selecionar-categoria')

  let categoriaSelecionada = ''

  if (!nomeMaterial) {
    mostrarErro('Por favor, insira o nome do material', erroMaterialHtml)
    tempoErro(erroMaterialHtml)
    return
  }

  if (!valorMaterial) {
    mostrarErro('Por favor, insira o valor', erroMaterialValor)
    tempoErro(erroMaterialValor)
    return
  }

  if (valorMaterial <= 0) {
    mostrarErro('Insira um número positivo', erroMaterialValor)
    tempoErro(erroMaterialValor)
    return
  }

  if (!medidaMaterial) {
    mostrarErro('Por favor, selecione uma medida', erroMedida)
    tempoErro(erroMedida)
    return
  }

  if (appData.categorias.length > 1) {
    // existe uma categoria além da 'geral'?
    if (!selecionarCategoria.value) {
      // o usuario selecionou alguma? se não selecionou, joga o erro
      mostrarErro('Por favor, selecione uma categoria', erroCategoria)
      tempoErro(erroCategoria)
      return
    } else {
      // se ele selecionou
      categoriaSelecionada = selecionarCategoria.value
    }
  } else {
    categoriaSelecionada = 'geral'
  }

  const nomeFormatado = palavraMinuscula(nomeMaterial)

  if (appData.materiais.some((m) => m.nome === nomeFormatado)) {
    mostrarErro('Material já existe', erroMaterialHtml)
    tempoErro(erroMaterialHtml)
    return
  }

  const novoMaterial = {
    nome: nomeFormatado,
    valor: valorMaterial,
    medida: medidaMaterial,
    categoria: categoriaSelecionada,
  }

  appData.materiais.push(novoMaterial)
  salvarDados()
  renderizarTudo()

  showPopup('Novo Material Adicionado', 2500)

  inputMaterial.value = ''
  inputValorMaterial.value = ''
  selectMedida.value = ''
})

console.log(appData.categorias, appData.materiais)

// função pra renderizar os materiais na pagina de materiais-page //

const listaMateriais = document.querySelector('#lista-materiais')

function renderizarMateriaisPagina() {
  listaMateriais.innerHTML = ''
  const materiais = appData.materiais
  materiais.forEach((item, indice) => {
    const nomeFormatado = palavraMaiuscula(item.nome)

    listaMateriais.innerHTML += `
      <div class="card-material">
        <div class="card-material-inner">
          <h2 class="card-material-titulo">${nomeFormatado}</h2>
          <span class="card-material-valor">R$ ${item.valor}</span>
        </div>
        <div class="card-material-inner">
          <button class="card-material-btn" onclick="editarMaterial(${indice})">Editar</button>
          <h3 class="btn-excluir-material" onclick="excluir(${indice}, appData.materiais)">X</h3>
        </div>
      </div>
    `
  })
}

renderizarMateriaisPagina()

//=======================================================================================//
// segunda section (selecionar quantidade) //

const selecionarMaterial = document.querySelector('#selecionar-item') // vai servir na hora de fazer o calculo para qual item vamos colocar no orçamento
const quantidadeMaterial = document.querySelector('#quantidade-itens') // quantia de itens que serão utilizados no orçamento
const btnAddMaterialLan = document.querySelector('#btn-submit-add') // botão pra adicionar o item no orçamento
const formSelecionar = document.querySelector('#selecionar-quantias') // formulario do selecionar quantias
const erroSelecionar = document.querySelector('#erro-selecionar-iten') // span de erro de selecionar iten
const erroQuantidade = document.querySelector('#erro-quantidade') // span de erro da quantidade de itens

function renderizarMateriais() {
  selecionarMaterial.innerHTML = ''
  selecionarMaterial.innerHTML = '<option value="">Selecionar itens</option>'
  const materiais = appData.materiais
  materiais.forEach((item) => {
    const nomeFormatado = palavraMaiuscula(item.nome)

    selecionarMaterial.innerHTML += `
      <option value="${nomeFormatado}">${nomeFormatado}</option>
    `
  })
}

formSelecionar.addEventListener('submit', (evento) => {
  evento.preventDefault()

  if (!selecionarMaterial.value) {
    mostrarErro('Por favor, selecione um item', erroSelecionar)
    tempoErro(erroSelecionar)
    return
  }

  if (!quantidadeMaterial.value) {
    mostrarErro('Por favor, digite uma quantia', erroQuantidade)
    tempoErro(erroQuantidade)
    return
  }

  if (quantidadeMaterial.value <= 0) {
    mostrarErro('Digite um número válido', erroQuantidade)
    tempoErro(erroQuantidade)
    return
  }

  const material = selecionarMaterial.value

  const materialF = palavraMinuscula(material) //formatar pro .find()

  const quantia = Number(quantidadeMaterial.value)
  const unidade = appData.materiais.find((m) => m.nome === materialF) || {}

  const materialFormatado = palavraMaiuscula(materialF) //formatar nome antes de ir pro appData
  const novoItem = {
    medida: unidade.medida,
    material: materialFormatado,
    quantia: quantia,
    preco: unidade.valor,
  }

  appData.orcamentos.push(novoItem)
  salvarDados()
  renderizarTudo()

  selecionarMaterial.value = ''
  quantidadeMaterial.value = ''
})

//=======================================================================================//
// tabela onde serão criados os orçamentos //

const tabelaHtml = document.querySelector('#table-body') // elemento html da tabela
const valorTotalHtml = document.querySelector('#valor-total') // visor do valor total do orçamento

function renderizarTabela() {
  tabelaHtml.innerHTML = ''
  let valorT = 0
  appData.orcamentos.forEach((item, indice) => {
    const material = item.material
    const preco = Number(item.preco)
    const valorFP = item.quantia * preco

    valorT = valorFP + valorT
    const numeroFF = formatarNumero(valorT)
    appData.valorT = valorT

    console.log(item)

    const numeroF = formatarNumero(preco)
    const numeroF2 = formatarNumero(valorFP)

    tabelaHtml.innerHTML += `
      <tr>
        <td>${material}</td>
        <td>${item.medida}</td>
        <td>${item.quantia}</td>
        <td>${numeroF}</td>
        <td>${numeroF2}</td>
        <td onclick="abrirConfirmacao(${indice})" class="table-dlt-btn">X</td>
      </tr>
    `
  })

  if (valorTotalHtml) {
    const numeroFF = formatarNumero(appData.valorT)
    valorTotalHtml.textContent = ''
    valorTotalHtml.textContent = numeroFF
  }
}

//=======================================================================================//

renderizarTudo()
