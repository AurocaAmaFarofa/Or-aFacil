const appData = JSON.parse(localStorage.getItem('appData')) || {
  materiais: [],
  orcamentos: [],
  categorias: ['geral'],
  templates: [],
  valorT: 0,
  templateCarregado: null,
  logs: [],
  clientes: [],
}

console.log(appData)

const materiais = {
  get lista() {
    return appData.materiais
  },

  buscaPorNome(nome) {
    const nomeFormatado = palavraMinuscula(nome.trim())

    return this.lista.find(
      (material) => palavraMinuscula(material.nome) === nomeFormatado,
    )
  },

  // RETORNA BOLLEAN = TRUE OU FALSE
  existe(nome) {
    return !!this.buscaPorNome(nome)
  },

  indicePorNome(nome) {
    const nomeFormatado = palavraMinuscula(nome.trim())

    return this.lista.findIndex(
      (material) => palavraMinuscula(material.nome) === nomeFormatado,
    )
  },

  excluir(nome) {
    const indice = this.indicePorNome(nome)

    if (indice === -1) return false

    this.lista.splice(indice, 1)

    return true
  },
}

const templates = {
  get lista() {
    return appData.templates
  },

  buscarTemplatesPeloNome(Nome, idTemplate) {
    const nomeTemplate = palavraMinuscula(Nome)

    return this.lista.find(palavraMinuscula(template.nome) === nomeTemplate)
  },
}

const logs = {
  get lista() {
    return appData.logs
  },
}

function garantirCategoria() {
  if (appData.categorias.length === 0) {
    appData.categorias.push('geral')

    criarLog('Categoria', 'Geral', 'Criada')

    salvarDados()
    renderizarTudo()
  }
}

function excluirCategoria(indice) {
  const nomeCategoria = appData.categorias[indice]

  if (palavraMinuscula(nomeCategoria) === 'geral') {
    showPopup('Impossivel excluir a categoria "Geral" ')
    return
  }

  appData.categorias.splice(indice, 1)

  materialCategoriaNomeF = palavraMinuscula(nomeCategoria).trim()

  appData.materiais.forEach((material) => {
    if (material.categoria === materialCategoriaNomeF) {
      material.categoria = 'geral'
    }
  })

  appData.orcamentos.forEach((item) => {
    if (item.categoria === materialCategoriaNomeF) {
      item.categoria = 'geral'
    }
  })

  appData.templates.forEach((template) => {
    template.itens.forEach((item) => {
      if (item.categoria) {
        item.categoria = 'geral'
      }
    })
  })

  criarLog('Categoria', `${nomeCategoria}`, 'Excluida')

  garantirCategoria()
  salvarDados()
  renderizarTudo()
}

let paginaAtiva = 'main'

window.mostrarPagina = function (idPagina) {
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

function salvarDados() {
  localStorage.setItem('appData', JSON.stringify(appData))
}

function renderizarTudo() {
  renderizarMateriais()
  renderizarTabela()
  renderizarMateriaisPagina()
  renderizarCategorias()
  renderizarTemplates()
  renderizarItensTemplateCard()
  renderizarMateriaisTemplate()
  renderizarLogs()
  renderizarGrafico()
}

const popupModal = document.querySelector('#popup-modal')
const popupCardTemplate = document.querySelector('.popup-card')
if (popupCardTemplate) {
  popupCardTemplate.remove()
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

const confirmarExclusao = document.querySelector('#confirmar-exclusao')
const btnConfirmarExcluir = document.querySelector('#btn-confirmar-excluir')
const btnCancelarExcluir = document.querySelector('#btn-cancelar-excluir')
const backdropConfirmarExcluir = document.querySelector('.confirmar-backdrop')
let indiceParaExcluir = null

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
  console.log(materialPraEditar.categoria)
  console.log(selecionarEditarCategoria.value)

  modalEditar.classList.add('show')
}

function fecharModalEdicao() {
  if (modalEditar) {
    modalEditar.classList.remove('show')
  }
}

function salvarEdicao() {
  nomeAtual = appData.materiais[indiceEmEdicao].nome.trim()
  valorAtual = appData.materiais[indiceEmEdicao].valor
  medidaAtual = appData.materiais[indiceEmEdicao].medida
  categoriaAtual = appData.materiais[indiceEmEdicao].categoria

  if (nomeAtual !== inputEditarNome.value.trim()) {
    if (materiais.existe(inputEditarNome.value)) {
      showPopup('Material já existe', 3000)
      return
    }
  }

  if (!inputEditarValor.value) {
    showPopup('Por favor, insira um valor', 3000)
    return
  }

  if (valorAtual !== Number(inputEditarValor.value)) {
    if (inputEditarValor <= 0) {
      showPopup('Insira um valor válido', 3000)
      return
    }
  }

  if (medidaAtual !== selecionarEditarMedida.value) {
    if (!selecionarEditarMedida) {
      showPopup('Por favor, selecione uma medida', 3000)
      return
    }
  }

  if (!inputEditarNome.value) {
    showPopup('Por favor, insira um novo nome', 3000)
    return
  }

  if (!selecionarEditarCategoria.value) {
    showPopup('Por favor, selecione uma categoria', 3000)
    return
  }

  appData.materiais[indiceEmEdicao].nome = inputEditarNome.value.trim()
  appData.materiais[indiceEmEdicao].valor = Number(inputEditarValor.value)
  appData.materiais[indiceEmEdicao].medida = selecionarEditarMedida.value
  appData.materiais[indiceEmEdicao].categoria = selecionarEditarCategoria.value

  appData.orcamentos.forEach((orcamento) => {
    if (orcamento.material === palavraMinuscula(nomeAtual)) {
      orcamento.material = palavraMinuscula(inputEditarNome.value.trim())
      orcamento.categoria = palavraMinuscula(selecionarEditarCategoria.value)
      orcamento.preco = Number(inputEditarValor.value)
      orcamento.medida = selecionarEditarMedida.value
    }
  })

  criarLog('Material', `${appData.materiais[indiceEmEdicao]}`, 'Editado')

  salvarDados()
  renderizarTudo()
  fecharModalEdicao()
}

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
      showPopup('Digite um nome pra categoria nova', 3000)
      return
    } else {
      const nome = nomeCategoriaNova.value.trim()

      const nomeF = palavraMinuscula(nome)

      appData.categorias.push(nomeF)

      criarLog('Categoria', `${nome}`, 'Criado')

      salvarDados()
      renderizarTudo()
    }

    nomeCategoriaNova.value = ''
    fecharModalCategoria()
  }
}

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

const btnExcluirTudo = document.querySelector('#excluir-local-storage')

btnExcluirTudo.addEventListener('click', () => {
  localStorage.clear()
  window.location.reload()
})

function excluir(indice, array) {
  if (indice !== undefined) {
    if (indice < 0 || indice >= array.length) {
      return
    }

    criarLog(`Item`, `Excluido`, '')

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

function excluirMaterial(nomeMaterial) {
  const nomeMaterialFormatado = palavraMinuscula(nomeMaterial)

  if (!materiais.excluir(nomeMaterial)) return

  appData.orcamentos = appData.orcamentos.filter(
    (item) => item.material !== nomeMaterialFormatado,
  )

  appData.templates.forEach((template) => {
    template.itens = template.itens.filter(
      (item) => item.material !== nomeMaterialFormatado,
    )
  })

  criarLog('Material', `${nomeMaterial}`, 'Excluido')

  salvarDados()
  renderizarTudo()
  showPopup('Material removido de todos os lugares!')
}

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

// Função de confirmação geral

let acaoConfirmacaoGeral = null
const tituloModal = document.querySelector('#titulo-modal')
const btnConfirmar = document.querySelector('#btn-confirmar-geral')

function abrirConfirmacaoGeral({ titulo = '', callback = () => {} }) {
  tituloModal.textContent = titulo
  acaoConfirmacaoGeral = callback

  abrirFecharModal('abrir', modalConfirmacaoGeral)
}

const modalConfirmacaoGeral = document.querySelector('#confirmar-geral')

btnConfirmar.addEventListener('click', () => {
  if (acaoConfirmacaoGeral) {
    acaoConfirmacaoGeral()
    abrirFecharModal('fechar', modalConfirmacaoGeral)
    acaoConfirmacaoGeral = null
  }
})

// primeira section (criar material)

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
    showPopup('Por favor, insira o nome do material', 3000)
    return
  }

  if (!valorMaterial) {
    showPopup('Por favor, insira o valor', 3000)
    return
  }

  if (valorMaterial <= 0) {
    showPopup('Insira um número positivo', 3000)
    return
  }

  if (!medidaMaterial) {
    showPopup('Por favor, selecione uma medida', 3000)
    return
  }

  if (appData.categorias.length > 1) {
    // existe uma categoria além da 'geral'?
    if (!categoria) {
      // o usuario selecionou alguma? se não selecionou, joga o erro
      showPopup('Por favor, selecione uma categoria', 3000)
      return
    } else {
      // se ele selecionou
      categoriaSelecionada = categoria
    }
  } else {
    categoriaSelecionada = 'geral'
  }

  const nomeFormatado = palavraMinuscula(nomeMaterial)
  const nomeCategoriaFormatado = palavraMinuscula(categoriaSelecionada)

  if (appData.materiais.some((m) => m.nome === nomeFormatado)) {
    showPopup('Material já existe', 3000)
    return
  }

  const novoMaterial = {
    nome: nomeFormatado,
    valor: valorMaterial,
    medida: medidaMaterial,
    categoria: nomeCategoriaFormatado,
  }

  criarLog('Material', `${nomeMaterial}`, 'Criado')

  appData.materiais.push(novoMaterial)
  salvarDados()
  renderizarTudo()

  showPopup('Novo Material Adicionado', 2500)

  inputMaterial.value = ''
  inputValorMaterial.value = ''
  selectMedida.value = ''
})

const listaMateriais = document.querySelector('#lista-materiais')
const pesquisarMaterialInput = document.querySelector('#pesquisar-material')
const erroMaterialNotFound = document.querySelector('#material-not-found')
let buscaAtual = 0
let mostrarNumero = false

pesquisarMaterialInput.addEventListener('input', async () => {
  const idBusca = ++buscaAtual

  try {
    const materiais = await buscarMateriais(pesquisarMaterialInput.value.trim())
    if (idBusca !== buscaAtual) {
      return
    }
    mostrarNumero = true
    renderizarMateriaisPagina(materiais)
  } catch (erro) {
    if (idBusca !== buscaAtual) {
      return
    }
    erroMaterialNotFound.innerHTML = `
      <h3 class="material-not-found">Nenhum material encontrado</h3>
    `
    listaMateriais.innerHTML = ''
  }
})

async function buscarMateriais(pesquisa) {
  erroMaterialNotFound.innerHTML = ''
  erroMaterialNotFound.innerHTML = `<h3 class="material-not-found">Carregando...</h3>`
  await simularServidor('busca-materiais')

  const resultado = appData.materiais.filter(
    (material) =>
      material.nome.includes(palavraMinuscula(pesquisa)) ||
      material.categoria.includes(palavraMinuscula(pesquisa)),
  )

  if (resultado.length === 0) {
    throw new Error('Nenhum material encontrado0o0o0')
  }

  return resultado
}

function renderizarMateriaisPagina(arrayMateriais = appData.materiais) {
  const numeroMateriaisEncontrados = arrayMateriais.length
  erroMaterialNotFound.innerHTML = ''
  let html = ''
  const numeroMateriais = appData.materiais.length

  if (mostrarNumero) {
    erroMaterialNotFound.innerHTML = `
      <h3 class="material-not-found left">Mostrando ${numeroMateriaisEncontrados} de ${numeroMateriais} materiais</h3>
    `
  }

  arrayMateriais.forEach((item, indice) => {
    const nomeFormatado = palavraMaiuscula(item.nome)
    const categoriaFormatada = palavraMaiuscula(item.categoria)

    html += `
      <div class="card-material">
        <div class="card-material-inner">
          <h2 class="card-material-titulo">${nomeFormatado}</h2>
        </div>
        <div class="card-material-inner">
          <button class="card-material-btn" onclick="mostrarDescricao(${indice})">Descrição</button>
          <button class="card-material-btn" onclick="editarMaterial(${indice})">Editar</button>
          <button class="btn-excluir-material" onclick="abrirConfirmacaoGeral({titulo: 'Deseja mesmo excluir?', callback: () => excluirMaterial('${nomeFormatado}')})">X</button>
        </div>
      </div>
    `
  })

  listaMateriais.innerHTML = html
  mostrarNumero = false
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
  let htmlCC = '<option value="">Selecionar Categoria</option>'
  let htmlCE = '<option value="">Selecionar Categoria</option>'
  let htmlCO = '<option value="Todos">Todos</option>'
  let htmlCpagina = ''

  const categorias = appData.categorias
  categorias.forEach((item, indice) => {
    const nomeF = palavraMaiuscula(item)

    const categoriaSelect = `<option value="${item}">${nomeF}</option>`

    htmlCC += categoriaSelect
    htmlCE += categoriaSelect
    htmlCO += categoriaSelect

    htmlCpagina += `
      <div class="card-material">
        <div class="card-material-inner">
          <h2 class="card-material-titulo">${nomeF}</h2>
        </div>
        <div>
          <button class="btn-excluir-material" onclick="abrirConfirmacaoGeral({titulo: 'Deseja mesmo excluir essa categoria?', callback: () => excluirCategoria(${indice})})">X</button>
        </div>
      </div>
    `
  })

  categoriasCriar.innerHTML = htmlCC
  categoriasEditar.innerHTML = htmlCE
  categoriasPagina.innerHTML = htmlCpagina
  categoriasOrcamento.innerHTML = htmlCO
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

  renderizarTabela()
})

renderizarCategorias()

// segunda section (selecionar quantidade)

const selecionarMaterial = document.querySelector('#selecionar-item') // vai servir na hora de fazer o calculo para qual item vamos colocar no orçamento
const quantidadeMaterial = document.querySelector('#quantidade-itens') // quantia de itens que serão utilizados no orçamento
const btnAddMaterialLan = document.querySelector('#btn-submit-add') // botão pra adicionar o item no orçamento
const formSelecionar = document.querySelector('#selecionar-quantias') // formulario do selecionar quantias
const erroSelecionar = document.querySelector('#erro-selecionar-iten') // span de erro de selecionar iten
const erroQuantidade = document.querySelector('#erro-quantidade') // span de erro da quantidade de itens

function renderizarMateriais() {
  let html = '<option value="">Selecionar itens</option>' //opção inicial

  const materiais = appData.materiais
  materiais.forEach((item) => {
    const nomeFormatado = palavraMaiuscula(item.nome)

    html += `<option value="${nomeFormatado}">${nomeFormatado}</option>` // armazena tudo aqui
  })

  selecionarMaterial.innerHTML = html // depois só joga pro HTML, assim não sobregarrega
}

function renderizarMateriaisTemplate(nomeTemplate = '') {
  const selecionarMaterialTemplate = document.querySelector(
    '#selecionar-material-template',
  )
  const mudarNomeTemplate = document.querySelector('#mudar-nome-template')

  let html =
    '<option value="" disabled selected class="opcao-inicial">Selecionar itens</option>'

  if (selecionarMaterialTemplate) {
    mudarNomeTemplate.value = ''
    mudarNomeTemplate.value = nomeTemplate

    const materiais = appData.materiais
    materiais.forEach((item) => {
      const nomeFormatado = palavraMaiuscula(item.nome)
      html += `
          <option value="${nomeFormatado}">${nomeFormatado}</option>
        `
    })

    selecionarMaterialTemplate.innerHTML = html
  }
}

formSelecionar.addEventListener('submit', (evento) => {
  evento.preventDefault()

  if (!selecionarMaterial.value) {
    showPopup('Por favor, selecione um item', 3000)
    return
  }

  if (!quantidadeMaterial.value) {
    showPopup('Por favor, digite uma quantia', 3000)
    return
  }

  if (quantidadeMaterial.value <= 0) {
    showPopup('Digite um número válido', 3000)
    return
  }

  const material = selecionarMaterial.value

  const quantia = Number(quantidadeMaterial.value)

  const unidade = materiais.buscaPorNome(material)

  const categoriaFormatado = palavraMinuscula(unidade.categoria)

  const materialF = palavraMinuscula(material)

  if (appData.orcamentos.some((m) => m.material === materialF)) {
    showPopup('Item já está no orçamento', 3000)
    return
  }

  const novoItem = {
    medida: unidade.medida,
    material: materialF,
    categoria: categoriaFormatado,
    quantia: quantia,
    preco: unidade.valor,
  }

  criarLog('Orçamento', `${material}`, 'Adicionado')

  appData.orcamentos.push(novoItem)
  salvarDados()
  renderizarTudo()

  selecionarMaterial.value = ''
  quantidadeMaterial.value = ''
})

// tabela onde serão criados os orçamentos

const tabelaHtml = document.querySelector('#table-body') // elemento html da tabela
const valorTotalHtml = document.querySelector('#valor-total') // visor do valor total do orçamento

function renderizarTabela() {
  let html = ''

  let valorT = 0
  appData.orcamentos.forEach((item, indice) => {
    const material = palavraMaiuscula(item.material)
    const preco = Number(item.preco)
    const valorFP = item.quantia * preco
    valorT = valorFP + valorT
    const numeroFF = formatarNumero(valorT)
    const numeroF = formatarNumero(preco)
    const numeroF2 = formatarNumero(valorFP)

    const categoriaF = palavraMaiuscula(item.categoria)

    if (categoriaTabelaRender !== null) {
      if (item.categoria === categoriaTabelaRender) {
        html += `
          <tr>
            <td>${material}</td>
            <td>${item.medida}</td>
            <td>${item.quantia}</td>
            <td>${numeroF}</td>
            <td>${categoriaF}</td>
            <td>${numeroF2}</td>
            <td onclick="abrirConfirmacao(${indice})" class="table-dlt-btn">X</td>
            <td class="input-number-table"><input placeholder="10, 2..." type="number" name="quantia" class="id-input-number-table"/><button onclick="mudarQuantidade(${indice})">=</button></td>
          </tr> 
        `
      } else {
        return
      }
    } else {
      html += `
        <tr>
          <td>${material}</td>
          <td>${item.medida}</td>
          <td>${item.quantia}</td>
          <td>${numeroF}</td>
          <td>${categoriaF}</td>
          <td>${numeroF2}</td>
          <td onclick="abrirConfirmacao(${indice})" class="table-dlt-btn">X</td>
          <td class="input-number-table"><input placeholder="10, 2..." type="number" name="quantia" class="id-input-number-table"/><button onclick="mudarQuantidade(${indice})">=</button></td>
        </tr> 
      `
    }
  })

  tabelaHtml.innerHTML = html

  appData.valorT = valorT

  if (valorTotalHtml) {
    const numeroFF = formatarNumero(appData.valorT)
    valorTotalHtml.textContent = ''
    valorTotalHtml.textContent = numeroFF
  }
}

function mudarQuantidade(indice) {
  const inputNumero = document.querySelectorAll('.id-input-number-table')
  const item = appData.orcamentos[indice]
  const valor = inputNumero[indice].value

  if (valor <= 0) {
    showPopup('Número inválido', 3000)
    return
  }

  criarLog('Orçamento', `${item.material}`, 'Quantidade Alterada')

  item.quantia = Number(valor)
  salvarDados()
  renderizarTudo()
}

// templates

const nomeTemplate = document.querySelector('#nome-template')
const erroNomeTemplate = document.querySelector('#erro-nome-template')
let decicao = null

function criarTemplate() {
  nomeTemplateValue = nomeTemplate.value

  if (!nomeTemplateValue) {
    showPopup('Por favor, adicione um nome', 3000)
    return
  }

  nomeF = palavraMinuscula(nomeTemplateValue.trim())

  if (appData.templates.some((T) => T.nome === nomeF)) {
    showPopup('Nome já existe', 3000)
    return
  }

  const itensTemplate = JSON.parse(JSON.stringify(appData.orcamentos))

  itensTemplate.forEach((item) => {
    const nomeF2 = palavraMinuscula(item.material)

    item.material = nomeF2
  })

  const novoTemplate = {
    nome: nomeF,
    itens: itensTemplate,
  }

  criarLog('Template', `${nomeTemplateValue}`, 'Criado')

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

  let htmlTL = ''
  let htmlT = '<option value="">Selecionar Template</option>'

  templates.forEach((item, indice) => {
    const nomeF = palavraMaiuscula(item.nome)

    htmlT += `<option value="${item.nome}">${item.nome}</option>`

    htmlTL += `
    <div class="card-material">
      <div class="card-material-inner">
        <h2 class="card-material-titulo">${nomeF}</h2>
      </div>
      <div class="card-material-inner">
        <button onclick="editarTemplate(${indice})">Editar</button>
        <button class="btn-excluir-material" onclick="abrirConfirmacaoGeral({titulo: 'Deseja mesmo excluir esse template?', callback: () => excluir(${indice}, appData.templates)})">X</button>
      </div>
    </div>
    `
  })

  selecionarTemplate.innerHTML = htmlT
  listaTemplates.innerHTML = htmlTL
}

const btnSelecionarTemplate = document.querySelector('#btn-selecionar-template')
const erroTemplateEncontrado = document.querySelector(
  '#erro-template-encontrado',
)

btnSelecionarTemplate.addEventListener('click', () => {
  const templateSelecionado = selecionarTemplate.value

  criarLog('Template', `${selecionarTemplate.value}`, 'Selecionado')

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
    showPopup('Nenhum template selecionado', 3000)
    return
  }

  const indiceTemplate = appData.templates.findIndex(
    (T) => T.nome === templateSelecionado,
  )
  const templateEncontrado = appData.templates[indiceTemplate]

  if (!templateEncontrado) {
    showPopup('Template não encontrado', 3000)
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

let templateEditando = null

async function editarTemplate(indiceA) {
  loadingScreen()
  await simularServidor()
  fecharLoadingScreen()

  modalEditarTemplate.innerHTML = ''

  nomeFormatadoo = palavraMaiuscula(appData.templates[indiceA].nome)

  modalEditarTemplate.innerHTML = `
    <div class="confirmar-backdrop"></div>
    <div class="confirmar-card">
      <div class="modal-editar-header">
        <h2 class="materiais-titulo" id="header-template-card">Editar "${nomeFormatadoo}"</h2>
        <button onclick="abrirFecharModal('fechar', modalEditarTemplate)">
          X
        </button>
      </div>

      <div class="adicionar-item-template">
        <div class="adicionar-item-inner">
          <form class="formulario" novalidate>
            <div>
              <label for="mudar-nome-template">Mudar nome</label>
              <input type="text" 
              placeholder="Novo nome" 
              id="mudar-nome-template" 
              name="mudar-nome-template"
              />
            </div>

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

      <hr class="hr"/>

      <div
        id="editar-template-itens"
        class="container-template-itens"
      ></div>

      <div>
        <button onclick="salvarEditarTemplate(${indiceA})">Salvar</button>
      </div>
    </div>
  `

  templateEditando = structuredClone(appData.templates[indiceA])

  abrirFecharModal('abrir', modalEditarTemplate)

  renderizarItensTemplateCard(indiceA)
  renderizarMateriaisTemplate(appData.templates[indiceA].nome)
}

function salvarEditarTemplate(indiceTemplate) {
  const mudarNomeTemplate = document.querySelector('#mudar-nome-template')
  const inputNome = mudarNomeTemplate.value // nome que o usuario deu

  const inputs = document.querySelectorAll('.input-numero-editar-template') // lista de inputs dos materiais

  if (!inputNome) {
    showPopup('Digite um nome')
    return
  }

  let itensErrados = []

  // percorre a lista de inputs
  inputs.forEach((input, indiceItem) => {
    if (input.value <= 0) {
      // salvarItens = false // se um item estiver errado ele já não salva tudo
      itensErrados.push(templateEditando.itens[indiceItem].material)
      return
    }
  })

  if (itensErrados.length > 0) {
    showPopup('Valor invalido para: ' + itensErrados.join(', '))
    return
  } // se um estiver errado ele retorna a função mostrando que um item está errado, porém eu quero mostrar QUAL item é

  // se passou pelo primeiro if ali ele vai percorrer o array dnv e salvar os numeros, já que todos estarão certos
  inputs.forEach((input, indiceItem) => {
    templateEditando.itens[indiceItem].quantia = Number(input.value)
  })

  if (appData.templateCarregado === indiceTemplate) {
    templateEditando.itens.forEach((item) => {
      const itemOrcamento = appData.orcamentos.findIndex(
        (o) => o.material === item.material,
      )

      if (itemOrcamento !== -1) {
        appData.orcamentos[itemOrcamento].quantia = item.quantia
      }
    })
  }

  criarLog('Template', `${templateEditando.nome}`, 'Alterado')

  templateEditando.nome = String(inputNome)

  appData.templates[indiceTemplate] = templateEditando

  if (appData.templateCarregado === indiceTemplate) {
    appData.orcamentos = structuredClone(templateEditando.itens)
  }

  salvarDados()
  renderizarTudo()
  abrirFecharModal('fechar', modalEditarTemplate)

  templateEditando = null
}

function renderizarItensTemplateCard(indiceA) {
  const editarTemplateItens = document.querySelector('#editar-template-itens')

  if (editarTemplateItens !== undefined && indiceA !== undefined) {
    let html = ''

    const templates = templateEditando

    templates.itens.forEach((item, indice) => {
      html += `
        <div class="card-editar-template">
          <div class="divisao-card-template">
            <h3 id="item-name-template">${item.material}</h3>
            <h3 class="item-quantia-tmeplate-edit">${item.quantia}</h3>
          </div>
          <div class="divisao-card-template">
            <button class="btn-excluir-material" onclick="excluirItemTemplate(${indiceA}, ${indice})">X</button>
            <input 
              type="number" 
              class="input-numero-editar-template"
              placeholder="55, 19..."
              required
              value="${item.quantia}"
              name="input-numero-editar-template"
            />
          </div>
        </div>
      `
    })

    editarTemplateItens.innerHTML = html
  }
}

function adicionarItemTemplate(indiceTemplate) {
  const templateAdd = templateEditando.itens

  const materialParaAdd = document.querySelector(
    '#selecionar-material-template',
  )
  const quantiaParaAdd = document.querySelector('#numero-item-template')
  const quantia = quantiaParaAdd.value

  const editarErroTemplateMaterial = document.querySelector(
    '#erro-editar-template-material',
  )

  const material = palavraMinuscula(materialParaAdd.value)

  if (editarErroTemplateMaterial) {
    if (!material) {
      showPopup('Por favor, selecione um material', 3000)
      return
    }

    if (!quantia || quantia <= 0) {
      showPopup('Por favor, insira um valor válido', 3000)
      return
    }
  }

  if (templateEditando.itens.some((m) => m.material === material)) {
    showPopup('Item já está no template', 3000)
    return
  }

  console.log(material)

  const materialAdd = materiais.buscaPorNome(material)

  const pushMaterial = {
    medida: materialAdd.medida,
    material: materialAdd.nome,
    categoria: palavraMinuscula(materialAdd.categoria),
    quantia: Number(quantia),
    preco: materialAdd.valor,
  }

  templateAdd.push(pushMaterial)

  renderizarTudo()
  renderizarItensTemplateCard(indiceTemplate)
  renderizarMateriaisTemplate(appData.templates[indiceTemplate].nome)

  //abrirFecharModal('fechar', modalEditarTemplate)
}

function excluirItemTemplate(indiceTemplate, indiceItem) {
  if (indiceTemplate !== undefined && indiceItem !== undefined) {
    templateEditando.itens.splice(indiceItem, 1)
  }

  renderizarTudo()
  renderizarItensTemplateCard(indiceTemplate)
  renderizarMateriaisTemplate(appData.templates[indiceTemplate].nome)
}

// Funções do Historico //

const modalHistoricos = document.querySelector('#modal-historicos')

function criarLog(texto1, texto2, acaoo) {
  const hoje = new Date()
  const dataHoje = hoje.toLocaleString('pt-BR')

  const log = {
    tipo: texto1,
    nome: texto2,
    acao: acaoo,
    data: dataHoje,
  }

  console.log(log)

  appData.logs.push(log)
}

function renderizarLogs() {
  const containerLogs = document.querySelector('#container-logs')
  const logs = appData.logs
  let html = ''
  containerLogs.innerHTML = ''

  logs
    .slice()
    .reverse()
    .forEach((item) => {
      html += `
      <div class="log">
        <span>${item.data}</span>
        <p>${item.tipo} "${item.nome}" ${item.acao}</p>
      </div>
    `
    })

  containerLogs.innerHTML = html
}

// siumulação de loading da tela //

const loadingModal = document.querySelector('#loading-modal')
const loadingText = document.querySelector('#loading-text')
let loadingIntervalo

function loadingScreen() {
  const palavras = ['Carregando.', 'Carregando..', 'Carregando...']
  let indice = 0
  loadingText.textContent = 'Carregando'

  loadingIntervalo = setInterval(function () {
    loadingText.textContent = palavras[indice]
    indice = (indice + 1) % 3
  }, 500)

  loadingModal.classList.add('show')
}

function fecharLoadingScreen() {
  clearInterval(loadingIntervalo)
  loadingModal.classList.remove('show')
  loadingText.textContent = ''
}

async function simularServidor(verificarMaterial = '') {
  if (verificarMaterial === 'busca-materiais') {
    const tempo = Math.random() * 2500 + 500
    return new Promise((resolve) => {
      setTimeout(resolve, tempo)
    })
  }

  const tempo = Math.random() * 2500 + 500
  return new Promise((resolve) => {
    setTimeout(resolve, tempo)
  })
}

// funções do grafico //

const btnTirarInfoGrafico = document.querySelector('#btn-tirar-span')
const spanGraficoInfo = document.querySelector('#span-grafico')

btnTirarInfoGrafico.addEventListener('click', () => {
  spanGraficoInfo.classList.add('pagina')
  btnTirarInfoGrafico.classList.add('pagina')
})

let chart = null

function renderizarGrafico() {
  const grafico = document.querySelector('#grafico-materiais')
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

  const labels = Object.keys(dataSets)
  const dataaa = Object.values(dataSets)

  if (chart) {
    chart.data.labels = labels
    chart.data.datasets[0].data = dataaa

    chart.update()

    return
  }

  chart = new Chart(grafico, {
    type: 'pie',
    data: {
      labels: appData.categorias,
      datasets: [
        { data, backgroundColor: ['#287fb9', '#6abbf2', '#235b81', '#3469db'] },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      animation: {
        duration: 800,
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })
}

const btnImprimirTabela = document.querySelector('#btn-imprimir-tabela')

btnImprimirTabela.addEventListener('click', criarPdf)
const { jsPDF } = window.jspdf

function pedirCliente() {}

function criarPdf() {
  const pdf = new jsPDF()
  const cabecalho = [['Nome', 'Quantia', 'Valor', 'Subtotal']]
  let corpo = []
  const itensOrcamento = appData.orcamentos.reverse()
  let cont = 0

  itensOrcamento.forEach((item) => {
    const subtotalItem = item.preco * item.quantia
    cont += subtotalItem

    const novoItem = [
      `${item.material}`,
      `${item.quantia}`,
      `${item.preco}`,
      subtotalItem,
    ]

    corpo.push(novoItem)
  })

  pdf.autoTable({
    didDrawPage: function (data) {
      pdf.setFontSize(20)
      pdf.text('Orça Fácil', 14, 10)
      pdf.setFontSize(12)
      pdf.text(`Empresa: ${appData.nomeEmpresa}`, 14, 17)
      // Futuramente colocar dados do cliente
    },
    startY: 20,
    head: cabecalho,
    body: corpo,
    styles: {
      halign: 'center',
    },
  })

  cont = cont.toFixed(2)

  pdf.setFontSize(15)
  pdf.text(`Valor total: R$ ${cont}`, 15, pdf.lastAutoTable.finalY + 8)

  const pdfUrl = pdf.output('bloburl')

  window.open(pdfUrl, '_Blank')
}

// clientes //

const btnAbrirModalClientes = document.querySelector('#btn-adicionar-clientes')
const modalAdicionarClientes = document.querySelector(
  '#modal-adicionar-clientes',
)

function abrirModalClientes() {
  abrirFecharModal('abrir', modalAdicionarClientes)
}

btnAbrirModalClientes.addEventListener('click', () => {
  abrirModalClientes()
})

function criarCliente() {
  const inputCliente = document.querySelector('#cliente-cpf-cnpj')
  const inputNomeCliente = document.querySelector('#cliente-nome')
  const inputTelefone = document.querySelector('#cliente-telefone')
  const inputEmail = document.querySelector('#cliente-email')
  const inputClienteEndereço = document.querySelector('#cliente-endereco')

  const cpfCnpj = inputCliente.value
  const nome = inputNomeCliente.value
  const telefone = inputTelefone.value
  const email = inputEmail.value
  const endereco = inputClienteEndereço.value

  // verificações //

  let cpfCnpjCorreto = cpfCnpj.replace(/\D/g, '')

  if (!cpfCnpjCorreto) {
    showPopup('Insira um cpf ou Cnpj')
    return
  } else if (cpfCnpjCorreto.length < 11 || cpfCnpjCorreto.length > 14) {
    showPopup('Insira um cpf ou Cnpj válido')
    return
  } else if (appData.clientes.some((c) => c.cpfCnpj === cpfCnpjCorreto)) {
    showPopup('Cpf/Cnpj já cadastrado')
  }

  let nomeCorreto = palavraMinuscula(nome)

  if (!nome) {
    showPopup('Insira um nome')
    return
  } else if (appData.clientes.some((c) => c.nome === nomeCorreto)) {
    showPopup('Nome já existente')
    return
  }

  if (!telefone) {
    showPopup('Insira um telefone')
    return
  } else if (telefone.length !== 11) {
    showPopup('Telefone inválido')
    return
  }

  if (!endereco) {
    showPopup('Insira um endereço')
    return
  }

  let emailCorreto

  if (!email) {
    emailCorreto = 'sem email'
  } else {
    emailCorreto = palavraMinuscula(email).trim()
  }

  //correção de texto //

  let telefoneCorreto = telefone.replace(/\D/g, '')
  let enderecoCorreto = palavraMinuscula(endereco)

  // push //

  novoCliente = {
    cpfCnpj: cpfCnpjCorreto,
    nome: nomeCorreto,
    telefone: telefoneCorreto,
    email: emailCorreto,
    endereco: enderecoCorreto,
  }

  appData.clientes.push(novoCliente)
  salvarDados()
  renderizarTudo()
  console.log(appData)
}

function renderizarClientes() {
  //renderizar tanto na pagina, quanto na hora de imprimir
}

function editarCliente() {}

function ExcluirCliente() {}

// orçamentos //

/* Ideia de orçamento pro app

appData.orcamentosItens = [
    {
        id: 1,
        cliente: {...}, Vamos fazer clientes ainda...
        itens: [...],
        data: "2026-08-10",
        status: "pendente"
    },

    {
        id: 2,
        cliente: {...},
        itens: [...],
        data: "2026-08-10",
        status: "aprovado"
    }
]

*/

// RoadMap pro app

// melhoria no CSS container-template-itens deve ser scrolavel para baixo, para melhor visão do usuario
// Antes de imprimir orçamento, pedir pra qual cliente é
// Puxar materiais por um XML

// Criar medidas
// Backup do LocalStorage
// Impressão otimizada (Ctrl + P)

// Histórico de orçamentos
// Clientes
// Mão de obra
// Descontos
// Lucro
// Impostos
// Dados da empresa e logo
// Tema escuro
// Login e banco de dados

//=======================================================================================//

renderizarTudo()
