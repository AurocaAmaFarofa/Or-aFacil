// appData do nosso aplicativo //

const appData = JSON.parse(localStorage.getItem('appData')) || {
  materiais: [],
  orcamentos: [],
  valorT: 0,
}

// salvar dados no appData //

function salvarDados() {
  localStorage.setItem('appData', JSON.stringify(appData))
}

// funcção pra renderizar tudo //

function renderizarTudo() {
  renderizarMateriais()
  renderizarTabela()
}

// função pra mostrar erro com texto //

function mostrarErro(mensagem, lugar) {
  console.log(mensagem, lugar)
  lugar.textContent = ''
  lugar.classList.add('display-block')
  lugar.textContent = `${mensagem}`
}

function tempoErro(modalErro) {
  setTimeout(() => {
    modalErro.classList.remove('display-block')
    modalErro.textContent = ''
  }, 3000)
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

//=======================================================================================//
// primeira section (criar material) //

const inputMaterial = document.querySelector('#nome-material') // nome do material
const inputValorMaterial = document.querySelector('#valor-input') // valor do material
const selectMedida = document.querySelector('#selecionar-medida') // tipo de medida do material
const formMaterial = document.querySelector('#formulario-material') // form pra corrigir o bug de recarregar a pagina
const erroMaterialHtml = document.querySelector('#erro-material') // elemento html pro erro
const erroMaterialValor = document.querySelector('#valor-material-erro') // html pro erro valor
const erroMedida = document.querySelector('#erro-medida-material')

formMaterial.addEventListener('submit', (evento) => {
  evento.preventDefault()

  const nomeMaterial = inputMaterial.value
  const valorMaterial = Number(inputValorMaterial.value)
  const medidaMaterial = selectMedida.value

  if (!nomeMaterial) {
    mostrarErro('Por favor, insira o nome do material', erroMaterialHtml)
    setTimeout(() => {
      erroMaterialHtml.classList.remove('display-block')
      erroMaterialHtml.textContent = ''
    }, 3000)
    return
  }

  if (!valorMaterial) {
    mostrarErro('Por favor, insira o valor', erroMaterialValor)
    setTimeout(() => {
      erroMaterialValor.classList.remove('display-block')
      erroMaterialValor.textContent = ''
    }, 3000)
    return
  }

  if (!medidaMaterial) {
    mostrarErro('Por favor, selecione uma medida', erroMedida)
    setTimeout(() => {
      erroMedida.classList.remove('display-block')
      erroMedida.textContent = ''
    }, 3000)
    return
  }

  console.log(nomeMaterial, valorMaterial, medidaMaterial)

  const novoMaterial = {
    nome: nomeMaterial,
    valor: valorMaterial,
    medida: medidaMaterial,
  }

  appData.materiais.push(novoMaterial)
  salvarDados()
  renderizarTudo()

  showPopup('Novo Material Adicionado', 2500)

  inputMaterial.value = ''
  inputValorMaterial.value = ''
  selectMedida.value = ''
})

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
    selecionarMaterial.innerHTML += `
      <option value="${item.nome}">${item.nome}</option>
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

  const material = selecionarMaterial.value
  const quantia = Number(quantidadeMaterial.value)

  const novoItem = {
    material: material,
    quantia: quantia,
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
    const filtroMaterial = appData.materiais.find((M) => {
      return M.nome === material
    })

    if (filtroMaterial) {
      const preco = filtroMaterial.valor
      const valorFP = item.quantia * preco
      valorT = valorFP + valorT
      const numeroFF = formatarNumero(valorT)
      appData.valorT = numeroFF

      const numeroF = formatarNumero(preco)
      const numeroF2 = formatarNumero(valorFP)

      tabelaHtml.innerHTML += `
      <tr>
        <td>${material}</td>
        <td>${filtroMaterial.medida}</td>
        <td>${item.quantia}</td>
        <td>${numeroF}</td>
        <td>${numeroF2}</td>
        <td onclick="abrirConfirmacao(${indice})" class="table-dlt-btn">X</td>
      </tr>
    `
    }
  })

  if (valorTotalHtml) {
    valorTotalHtml.textContent = ''
    valorTotalHtml.textContent = appData.valorT
  }
}

//=======================================================================================//

renderizarTudo()
