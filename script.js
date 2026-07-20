// appData do nosso aplicativo //

const appData = JSON.parse(localStorage.getItem('appData')) || {
  materiais: [],
  orcamentos: [],
  categorias: ['geral'],
  templates: [],
  valorT: 0,
  templateCarregado: null,
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
  renderizarCategorias()
  renderizarTemplates()
  renderizarItensTemplateCard()
  renderizarMateriaisTemplate()
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
  selecionarEditarCategoria.value = materialPraEditar.categoria

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
  categoriaAtual = appData.materiais[indiceEmEdicao].categoria

  if (nomeAtual !== inputEditarNome.value.trim()) {
    nomeFormatado = palavraMinuscula(inputEditarNome.value.trim())
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

  if (!selecionarEditarCategoria.value) {
    mostrarErro('Por favor, selecione uma categoria', editarErroCategoria)
    tempoErro(editarErroCategoria)
    return
  }

  appData.materiais[indiceEmEdicao].nome = inputEditarNome.value.trim()
  appData.materiais[indiceEmEdicao].valor = Number(inputEditarValor.value)
  appData.materiais[indiceEmEdicao].medida = selecionarEditarMedida.value
  appData.materiais[indiceEmEdicao].categoria = selecionarEditarCategoria.value

  appData.orcamentos.forEach((orcamento) => {
    if (orcamento.material === palavraMaiuscula(nomeAtual)) {
      orcamento.material = palavraMinuscula(inputEditarNome.value.trim())
      orcamento.categoria = palavraMinuscula(selecionarEditarCategoria.value)
      orcamento.preco = Number(inputEditarValor.value)
      orcamento.medida = selecionarEditarMedida.value
    }
  })

  salvarDados()
  renderizarTudo()
  fecharModalEdicao()
}

// abrir modal de categorias //

const modalCategoria = document.querySelector('#adicionar-categoria')

function abrirModalCategoria() {
  if (modalCategoria) {
    modalCategoria.classList.add('show')
  }
}

function fecharModalCategoria() {
  if (modalCategoria) {
    modalCategoria.classList.remove('show')
  }
}

const nomeCategoriaNova = document.querySelector('#nome-nova-categoria')
const erroCategoriaNome = document.querySelector('#erro-categoria-nome')

function addNovaCategoria() {
  if (modalCategoria) {
    if (!nomeCategoriaNova.value) {
      mostrarErro('Digite um nome pra categoria nova', erroCategoriaNome)
      tempoErro(erroCategoriaNome)
      return
    } else {
      const nome = nomeCategoriaNova.value.trim()

      const nomeF = palavraMinuscula(nome)

      appData.categorias.push(nomeF)
      salvarDados()
      renderizarTudo()

      console.log(appData.categorias)
    }

    nomeCategoriaNova.value = ''
    fecharModalCategoria()
  }
}

// abrir modal de templates //

const modalTemplate = document.querySelector('#modal-template')

function abrirModalTemplate() {
  if (modalTemplate) {
    modalTemplate.classList.add('show')
  }
}

function fecharModalTemplate() {
  if (modalTemplate) {
    modalTemplate.classList.remove('show')
  }
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

//função pra excluir o material em todos os lugares
function excluirMaterial(nomeMaterial) {
  const nomeMaterialFormatado = palavraMinuscula(nomeMaterial)

  const indice = appData.materiais.findIndex(
    (m) => m.nome === nomeMaterialFormatado,
  )

  if (indice !== -1) {
    appData.materiais.splice(indice, 1)
  }

  appData.orcamentos = appData.orcamentos.filter(
    (item) => item.material !== nomeMaterialFormatado,
  )

  appData.templates.forEach((template) => {
    template.itens = template.itens.filter(
      (item) => item.material !== nomeMaterialFormatado,
    )
  })

  salvarDados()
  renderizarTudo()
  renderizarTabela()
  showPopup('Material removido de todos os lugares!')
}

console.log(appData.templates)

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
const selecionarCategoria = document.querySelector('#selecionar-categoria')

formMaterial.addEventListener('submit', (evento) => {
  evento.preventDefault()

  const nomeMaterial = inputMaterial.value
  const valorMaterial = Number(inputValorMaterial.value)
  const medidaMaterial = selectMedida.value
  const categoria = selecionarCategoria.value

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
    if (!categoria) {
      // o usuario selecionou alguma? se não selecionou, joga o erro
      mostrarErro('Por favor, selecione uma categoria', erroCategoria)
      tempoErro(erroCategoria)
      return
    } else {
      // se ele selecionou
      categoriaSelecionada = categoria
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
          <span class="card-material-valor">${item.categoria}</span>
        </div>
        <div class="card-material-inner">
          <button class="card-material-btn" onclick="editarMaterial(${indice})">Editar</button>
          <h3 class="btn-excluir-material" onclick="excluirMaterial('${item.nome}')">X</h3>
        </div>
      </div>
    `
  })
}

renderizarMateriaisPagina()

const categoriasEditar = document.querySelector('#editar-selecionar-categoria')
const categoriasCriar = document.querySelector('#selecionar-categoria')
const categoriasPagina = document.querySelector('#lista-categorias')
const categoriasOrcamento = document.querySelector(
  '#selecionar-categoria-tabela',
)

let categoriaTabelaRender = null

function renderizarCategorias() {
  console.log('renderizando categorias')

  categoriasCriar.innerHTML = ''
  categoriasCriar.innerHTML = '<option value="">Selecionar Categoria</option>'

  categoriasEditar.innerHTML = ''
  categoriasEditar.innerHTML = '<option value="">Selecionar Categoria</option>'

  categoriasPagina.innerHTML = ''

  categoriasOrcamento.innerHTML = ''
  categoriasOrcamento.innerHTML = '<option value="Todos">Todos</option>'

  const categorias = appData.categorias
  categorias.forEach((item, indice) => {
    const nomeF = palavraMaiuscula(item)

    const categoriaSelect = `<option value="${nomeF}">${nomeF}</option>`

    categoriasCriar.innerHTML += categoriaSelect
    categoriasEditar.innerHTML += categoriaSelect

    categoriasPagina.innerHTML += `
      <div class="card-material">
        <div class="card-material-inner">
          <h2 class="card-material-titulo">${item}</h2>
        </div>
        <div>
          <h3 class="btn-excluir-material" onclick="excluirCategoria(${indice})">X</h3>
        </div>
      </div>
    `

    categoriasOrcamento.innerHTML += `<option value="${nomeF}">${nomeF}</option>`
  })
}

const btnSelecionarTabela = document.querySelector('#btn-pesquisar-tabela')

btnSelecionarTabela.addEventListener('click', () => {
  const categoriaSelecionada = categoriasOrcamento.value

  if (categoriaSelecionada === 'Todos') {
    categoriaTabelaRender = null
  } else {
    const nomeF = palavraMinuscula(categoriaSelecionada)
    categoriaTabelaRender = nomeF
  }

  console.log('btn ' + categoriaTabelaRender)

  renderizarTabela()
})

renderizarCategorias()

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

function renderizarMateriaisTemplate() {
  const selecionarMaterialTemplate = document.querySelector(
    '#selecionar-material-template',
  )

  if (selecionarMaterialTemplate) {
    selecionarMaterialTemplate.innerHTML = ''
    selecionarMaterialTemplate.innerHTML =
      '<option value="" disabled selected class="opcao-inicial">Selecionar itens</option>'

    const materiais = appData.materiais
    materiais.forEach((item) => {
      const nomeFormatado = palavraMaiuscula(item.nome)

      if (selecionarMaterialTemplate) {
        selecionarMaterialTemplate.innerHTML += `
          <option value="${nomeFormatado}">${nomeFormatado}</option>
        `
      }
    })
  }
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

  const categoriaFormatado = palavraMinuscula(unidade.categoria)
  console.log(categoriaFormatado)

  const novoItem = {
    medida: unidade.medida,
    material: materialF,
    categoria: categoriaFormatado,
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
    const material = palavraMaiuscula(item.material)
    const preco = Number(item.preco)
    const valorFP = item.quantia * preco

    valorT = valorFP + valorT
    const numeroFF = formatarNumero(valorT)
    appData.valorT = valorT

    const numeroF = formatarNumero(preco)
    const numeroF2 = formatarNumero(valorFP)

    const categoriaF = palavraMaiuscula(item.categoria)

    if (categoriaTabelaRender !== null) {
      if (item.categoria === categoriaTabelaRender) {
        tabelaHtml.innerHTML += `
          <tr>
            <td>${material}</td>
            <td>${item.medida}</td>
            <td>${item.quantia}</td>
            <td>${numeroF}</td>
            <td>${categoriaF}</td>
            <td>${numeroF2}</td>
            <td onclick="abrirConfirmacao(${indice})" class="table-dlt-btn">X</td>
            <td onclick="aumDimItem(${indice}, 'aumentar')" class="table-btn">+</td>
            <td onclick="aumDimItem(${indice}, 'diminuir')" class="table-btn">-</td>
          </tr>
        `
      } else {
        return
      }
    } else {
      tabelaHtml.innerHTML += `
        <tr>
          <td>${material}</td>
          <td>${item.medida}</td>
          <td>${item.quantia}</td>
          <td>${numeroF}</td>
          <td>${categoriaF}</td>
          <td>${numeroF2}</td>
          <td onclick="abrirConfirmacao(${indice})" class="table-dlt-btn">X</td>
          <td onclick="aumDimItem(${indice}, 'aumentar')" class="table-btn">+</td>
          <td onclick="aumDimItem(${indice}, 'diminuir')" class="table-btn">-</td>
        </tr> 
      `
    }
  })

  if (valorTotalHtml) {
    const numeroFF = formatarNumero(appData.valorT)
    valorTotalHtml.textContent = ''
    valorTotalHtml.textContent = numeroFF
  }
}

function aumDimItem(indice, aumentarDiminuir) {
  const item = Number(appData.orcamentos[indice].quantia)

  if (aumentarDiminuir === 'aumentar') {
    novoN = item + 1
    appData.orcamentos[indice].quantia = Number(novoN)
    salvarDados()
    renderizarTudo()
  } else if (aumentarDiminuir === 'diminuir') {
    if (item <= 0) {
      return
    } else {
      novoN = item - 1
      appData.orcamentos[indice].quantia = Number(novoN)
      salvarDados()
      renderizarTudo()
    }
  }
}

//=======================================================================================//
// templates //

const nomeTemplate = document.querySelector('#nome-template')
const erroNomeTemplate = document.querySelector('#erro-nome-template')
let decicao = null

console.log(appData)

function criarTemplate() {
  nomeTemplateValue = nomeTemplate.value

  if (!nomeTemplateValue) {
    mostrarErro('Por favor, adicione um nome', erroNomeTemplate)
    tempoErro(erroNomeTemplate)
    return
  }

  nomeF = palavraMinuscula(nomeTemplateValue.trim())

  if (appData.templates.some((T) => T.nome === nomeF)) {
    mostrarErro('Nome já existe', erroNomeTemplate)
    tempoErro(erroNomeTemplate)
    return
  }

  console.log(appData.orcamentos)

  const itensTemplate = JSON.parse(JSON.stringify(appData.orcamentos))
  console.log(itensTemplate)

  itensTemplate.forEach((item) => {
    const nomeF2 = palavraMinuscula(item.material)

    item.material = nomeF2
  })

  console.log(itensTemplate)

  const novoTemplate = {
    nome: nomeTemplateValue,
    itens: itensTemplate,
  }

  console.log(novoTemplate)
  appData.templates.push(novoTemplate)
  salvarDados()
  renderizarTudo()

  novoTemplateValue = ''

  fecharModalTemplate()
}

const selecionarTemplate = document.querySelector('#selecionar-template')
const listaTemplates = document.querySelector('#lista-templates')

function renderizarTemplates() {
  const templates = appData.templates

  selecionarTemplate.innerHTML = '<option value="">Selecionar Template</option>'
  listaTemplates.innerHTML = ''

  templates.forEach((item, indice) => {
    selecionarTemplate.innerHTML += `<option value="${item.nome}">${item.nome}</option>`

    listaTemplates.innerHTML += `
    <div class="card-material">
      <div class="card-material-inner">
        <h2 class="card-material-titulo">${item.nome}</h2>
      </div>
      <div class="card-material-inner">
        <button onclick="editarTemplate(${indice})">Editar</button>
        <h3 class="btn-excluir-material" onclick="excluir(${indice}, appData.templates)">X</h3>
      </div>
    </div>
    `
  })
}

const btnSelecionarTemplate = document.querySelector('#btn-selecionar-template')
const erroTemplateEncontrado = document.querySelector(
  '#erro-template-encontrado',
)

btnSelecionarTemplate.addEventListener('click', () => {
  const templateSelecionado = selecionarTemplate.value

  if (appData.orcamentos.length > 0) {
    abrirFecharModal('abrir', confirmarModalTemplate)
    return
  } else {
    carregarTemplate()
  }
})

function carregarTemplate() {
  const templateSelecionado = selecionarTemplate.value

  if (!templateSelecionado) {
    mostrarErro('Nenhum template selecionado', erroTemplateEncontrado)
    tempoErro(erroTemplateEncontrado)
    return
  }

  const indiceTemplate = appData.templates.findIndex(
    (T) => T.nome === templateSelecionado,
  )
  const templateEncontrado = appData.templates[indiceTemplate]

  if (!templateEncontrado) {
    mostrarErro('Template não encontrado', erroTemplateEncontrado)
    tempoErro(erroTemplateEncontrado)
    return
  }

  appData.orcamentos = JSON.parse(JSON.stringify(templateEncontrado.itens))

  appData.templateCarregado = indiceTemplate

  salvarDados()
  renderizarTudo()
  showPopup('Template selecionado!', 2500)
}

const confirmarModalTemplate = document.querySelector(
  '#confirmar-modal-template',
)

const btnSim = document.querySelector('#btn-sim')
const btnNao = document.querySelector('#btn-nao')

btnSim.addEventListener('click', () => {
  carregarTemplate()
  abrirFecharModal('fechar', confirmarModalTemplate)
})

btnNao.addEventListener('click', () => {
  abrirFecharModal('fechar', confirmarModalTemplate)
})

// função APENAS pra abrir e fechar o modal de confrimação
function abrirFecharModal(acao, local) {
  if (local) {
    if (acao === 'abrir') {
      local.classList.add('show')
    } else if (acao === 'fechar') {
      local.classList.remove('show')
    }
  }
}

function ModalConfirmacao(acao) {
  if (confirmarModalTemplate) {
    confirmarModalTemplate.classList.add()
  }
}

const modalEditarTemplate = document.querySelector('#editar-templates')
const headerTemplateCard = document.querySelector('#header-template-card')

function editarTemplate(indiceA) {
  modalEditarTemplate.innerHTML = ''
  modalEditarTemplate.innerHTML = `
    <div class="confirmar-backdrop"></div>
    <div class="confirmar-card">
      <div class="modal-editar-header">
        <h2 class="materiais-titulo" id="header-template-card">Editar "${appData.templates[indiceA].nome}"</h2>
        <button onclick="abrirFecharModal('fechar', modalEditarTemplate)">
          X
        </button>
      </div>

      <div class="adicionar-item-template">
        <div class="adicionar-item-inner">
          <form class="formulario" novalidate>
            <div>
              <label for="selecionar-material-template"
                >Adicionar itens</label
              >
              <select
                name="selecionar-material-template"
                id="selecionar-material-template"
              >
                <option value="">Selecionar material</option>
              </select>
              <span class="error-mensagem" id="erro-editar-template-material"></span>
            </div>

            <div class="adicionar-template-itens">
              <input
                type="number"
                required
                placeholder="Ex: 55, 19.50"
                name="numero-item-template"
                id="numero-item-template"
              />

              <button type="button" onclick="adicionarItemTemplate(${indiceA})">+</button>
            </div>
          </form>
        </div>
      </div>

      <div class="template-alert">
        <span>Cuidado, alterar os itens poderá atualizar os itens na tabela</span>
        <span class="btn-tirar-alert" onclick="sumirAlert()">X</span>
      </div>

      <div
        id="editar-template-itens"
        class="container-template-itens"
      ></div>
    </div>
  `

  abrirFecharModal('abrir', modalEditarTemplate)

  renderizarItensTemplateCard(indiceA)
  renderizarMateriaisTemplate()
}

function renderizarItensTemplateCard(indiceA) {
  const editarTemplateItens = document.querySelector('#editar-template-itens')

  if (editarTemplateItens !== undefined && indiceA !== undefined) {
    editarTemplateItens.innerHTML = ''

    const templates = appData.templates[indiceA]
    console.log(templates)

    templates.itens.forEach((item, indice) => {
      editarTemplateItens.innerHTML += `
        <div class="card-editar-template">
          <div class="divisao-card-template">
            <h3 id="item-name-template">${item.material}</h3>
            <h3>${item.quantia}</h3>
          </div>
          <div class="divisao-card-template">
            <h3 class="btn-excluir-material" onclick="excluirItemTemplate(${indiceA}, ${indice})">X</h3>
            <p class="table-btn" onclick="aumDimItemTemplate(${indice}, ${indiceA}, 'aumentar')">+</p>
            <p class="table-btn" onclick="aumDimItemTemplate(${indice}, ${indiceA}, 'diminuir')">-</p>
          </div>
        </div>
      `
    })
  }
}

function aumDimItemTemplate(indiceItem, indiceTemplate, aumentarDiminuir) {
  const item = Number(
    appData.templates[indiceTemplate].itens[indiceItem].quantia,
  )

  let novoN = 0

  if (aumentarDiminuir === 'aumentar') {
    novoN = item + 1
    appData.templates[indiceTemplate].itens[indiceItem].quantia = Number(novoN)
    salvarDados()
    renderizarTudo()
  } else if (aumentarDiminuir === 'diminuir') {
    if (item <= 0) {
      return
    } else {
      novoN = item - 1
      appData.templates[indiceTemplate].itens[indiceItem].quantia =
        Number(novoN)
      salvarDados()
      renderizarTudo()
    }
  }

  if (appData.templateCarregado !== indiceTemplate) {
    return
  } else {
    const itemOrcamento = appData.orcamentos[indiceItem]

    itemOrcamento.quantia = Number(novoN)
    salvarDados()

    renderizarTudo()
    renderizarItensTemplateCard(indiceTemplate)
    renderizarMateriaisTemplate()
  }
}

console.log(appData.materiais)

function adicionarItemTemplate(indiceTemplate) {
  const templateAdd = appData.templates[indiceTemplate].itens

  const materialParaAdd = document.querySelector(
    '#selecionar-material-template',
  )
  const quantiaParaAdd = document.querySelector('#numero-item-template')

  const material = palavraMinuscula(materialParaAdd.value.trim())
  const quantia = quantiaParaAdd.value

  const editarErroTemplateMaterial = document.querySelector(
    '#erro-editar-template-material',
  )

  if (editarErroTemplateMaterial) {
    if (!material) {
      mostrarErro(
        'Por favor, selecione um material',
        editarErroTemplateMaterial,
      )
      tempoErro(editarErroTemplateMaterial)
      return
    }

    if (!quantia || quantia <= 0) {
      mostrarErro(
        'Por favor, insira um valor válido',
        editarErroTemplateMaterial,
      )
      tempoErro(editarErroTemplateMaterial)
      return
    }
  }

  const materialAdd = appData.materiais.find((m) => m.nome === material)
  console.log(materialAdd)

  const pushMaterial = {
    medida: materialAdd.medida,
    material: materialAdd.nome,
    categoria: palavraMinuscula(materialAdd.categoria),
    quantia: Number(quantia),
    preco: materialAdd.valor,
  }

  templateAdd.push(pushMaterial)

  salvarDados()
  renderizarTudo()
  renderizarItensTemplateCard(indiceTemplate)

  //abrirFecharModal('fechar', modalEditarTemplate)
}

console.log(appData.materiais)
console.log(appData.orcamentos)

function excluirItemTemplate(indiceTemplate, indiceItem) {
  if (indiceTemplate !== undefined && indiceItem !== undefined) {
    appData.templates[indiceTemplate].itens.splice(indiceItem, 1)
  }

  salvarDados()
  renderizarTudo()
  renderizarItensTemplateCard(indiceTemplate)

  //EXCLUIR DA TABELA PQ NÃO TA EXCLUINDO QUANDO A GENTE SELECIONA UM TEMPLATE E ELE É CARREGADO
}

//FAZER VERIFICAÇÃO DE SE O ITEM JA EXISTE

//ADICIONAR BOTÕES DE ADICIONAR QUANTIDADE EM CADA ITEM NA TABELA E NO TEMPLATE

//FAZER FUNÇÃO DE EXCLUIR CATEGORIA COM "CATEGORIA.LENGTH <= 0 { CRIAR CATEGORIA 'GERAL' } "

//=======================================================================================//

renderizarTudo()
