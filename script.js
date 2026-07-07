// appData do nosso aplicativo //

const appData = JSON.parse(localStorage.getItem('appData')) || {
  materiais: [],
  orçamentos: [],
}

// salvar dados no appData //

function salvarDados() {
  localStorage.setItem('appData', JSON.stringify(appData))
}

// funcção pra renderizar tudo //

function renderizarTudo() {
  renderizarMateriais()
}

// função pra mostrar erro com texto //

function mostrarErro(mensagem, lugar) {
  console.log(mensagem, lugar)
  lugar.textContent = ''
  lugar.classList.add('display-block')
  lugar.textContent = `${mensagem}`
}

// mostrar popup na tela //

const popupModal = document.querySelector('#popup-modal')
const popupModalText = document.querySelector('#popup-modal-text')
const popupCard = document.querySelector('.popup-card')

function showPopup(text, duration = 2000) {
  if (!popupModal || !popupCard) return
  popupModalText.textContent = text
  popupModal.style.setProperty('--popup-duration', `${duration}ms`)
  popupCard.classList.remove('exit')
  popupModal.classList.remove('show')
  void popupModal.offsetWidth
  popupModal.classList.add('show')

  if (duration > 0) {
    setTimeout(() => {
      popupCard.classList.add('exit')
      setTimeout(() => {
        popupModal.classList.remove('show')
        popupCard.classList.remove('exit')
        popupModalText.textContent = ''
      }, 380)
    }, duration)
  }
}

function hidePopup() {
  if (!popupModal || !popupCard) return
  popupCard.classList.add('exit')
  setTimeout(() => {
    popupModal.classList.remove('show')
    popupCard.classList.remove('exit')
    popupModalText.textContent = ''
  }, 380)
}

// excluir localStorage //

const btnExcluirTudo = document.querySelector('#excluir-local-storage') // botão pra exluir localStorage

btnExcluirTudo.addEventListener('click', () => {
  localStorage.clear()
  window.location.reload()
})

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
const formSelecionar = document.querySelector('#selecionar-quantias')

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

formSelecionar.addEventListener('submit', () => {})

//=======================================================================================//
// tabela onde serão criados os orçamentos //

const tabelaHtml = document.querySelector('#table-body') // elemento html da tabela
const valorTotalHtml = document.querySelector('#valor-total') // visor do valor total do orçamento

//=======================================================================================//

renderizarTudo()
