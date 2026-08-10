# OrçaFácil

> **Transforme estimativas em orçamentos precisos, organizados e profissionais.**

O **OrçaFácil** é uma aplicação desenvolvida para facilitar a criação, organização e apresentação de orçamentos.

A proposta é simples: em vez de tentar calcular um orçamento "de cabeça" e entregar ao cliente um valor aproximado, o OrçaFácil permite construir o orçamento de maneira **minuciosa, organizada e transparente**, calculando cada item individualmente até chegar ao valor final.

Um orçamento de **R$ 100,00**, por exemplo, pode transmitir a sensação de uma estimativa ou até mesmo de um "chute". Já um orçamento calculado detalhadamente, chegando a **R$ 76,90**, transmite a ideia de que cada componente foi considerado e calculado.

A diferença não está apenas nos R$ 23,10.

Está na **credibilidade do processo**.

---

## Objetivo

O OrçaFácil foi criado para tornar o processo de elaboração de orçamentos mais organizado e confiável.

A aplicação permite cadastrar itens, organizá-los em categorias, montar orçamentos, acompanhar informações e gerar documentos a partir dos dados cadastrados.

A ideia é que o usuário não precise depender de cálculos manuais ou informações espalhadas.

Tudo parte de uma estrutura central de dados.

---

# Como funciona

O fluxo básico da aplicação funciona da seguinte maneira:

```text
Cadastrar item
    ↓
Adicionar ao orçamento
    ↓
Calcular valores
    ↓
Organizar a tabela
    ↓
Revisar orçamento
    ↓
Imprimir / gerar documento
    ↓
Salvar como template
```

### 1. Cadastrar itens

O usuário pode cadastrar os itens utilizados nos seus orçamentos.

Cada item pode possuir informações como:

- Nome
- Categoria
- Valor
- Quantidade
- Outras informações relevantes

Depois de cadastrado, o item fica disponível para ser utilizado na criação de um orçamento.

### 2. Montar o orçamento

Os itens cadastrados podem ser adicionados ao orçamento.

O sistema organiza os dados e realiza os cálculos necessários, evitando que o usuário precise calcular manualmente cada valor.

### 3. Revisar

Antes de finalizar, o usuário pode revisar os itens, quantidades e valores.

Isso permite encontrar possíveis erros antes da apresentação do orçamento ao cliente.

### 4. Gerar e imprimir

Após finalizar o orçamento, os dados podem ser transformados em uma tabela organizada para impressão ou geração de documento.

O objetivo é que o resultado final seja muito mais apresentável do que simplesmente enviar uma lista de valores.

### 5. Salvar como template

Orçamentos que possuem uma estrutura recorrente podem ser utilizados como base para novos orçamentos.

Isso evita reconstruir manualmente a mesma estrutura diversas vezes.

---

# Funcionalidades

## Gerenciamento de itens

O sistema possui gerenciamento completo dos itens cadastrados.

É possível:

- Criar itens
- Visualizar itens
- Editar itens
- Excluir itens
- Organizar itens por categoria
- Utilizar itens cadastrados em novos orçamentos

O objetivo é transformar os itens cadastrados em uma espécie de catálogo reutilizável.

---

## Dashboard

O OrçaFácil possui um dashboard para visualizar informações dos itens cadastrados.

Entre as informações apresentadas está a distribuição dos itens por categoria.

A visualização utiliza a biblioteca **Chart.js**, transformando os dados armazenados no sistema em gráficos para facilitar a interpretação das informações.

---

## Tabelas e impressão

Os dados dos orçamentos podem ser organizados em tabelas e preparados para impressão.

Para isso, o projeto utiliza **jsPDF** juntamente com **AutoTable**, permitindo transformar os dados do orçamento em documentos estruturados.

A ideia é utilizar os mesmos dados do sistema para gerar uma apresentação mais profissional do orçamento.

---

## Histórico e logs

O sistema também possui uma estrutura de histórico/logs para registrar informações importantes relacionadas às operações realizadas.

Isso permite acompanhar melhor o comportamento do sistema e cria uma base para futuras funcionalidades de auditoria e acompanhamento de alterações.

---

# Sistema de dados — `appData`

Uma das partes centrais do OrçaFácil é o objeto `appData`.

Ele funciona como a estrutura central de armazenamento dos dados utilizados pela aplicação.

De maneira simplificada:

```javascript
const appData = {
  materiais: [],
  categorias: [],
  orcamentos: [],
  logs: [],
}
```

A aplicação utiliza essa estrutura para centralizar as informações manipuladas pelo JavaScript.

Em vez de cada funcionalidade possuir seus próprios dados espalhados pelo código, o `appData` funciona como uma fonte central de informações.

Isso facilita:

- Manipulação dos dados
- Criação de novos registros
- Edição
- Exclusão
- Renderização da interface
- Geração de gráficos
- Geração de documentos
- Criação de históricos

O projeto também utiliza o **LocalStorage** para persistência dos dados no navegador, permitindo que determinadas informações continuem disponíveis mesmo depois que a página seja recarregada.

---

# Por que calcular um orçamento detalhadamente?

Um orçamento não é apenas um número.

Ele também comunica **organização, cuidado e profissionalismo**.

Imagine dois cenários:

### Orçamento A

> **Total: R$ 100,00**

Sem uma composição clara, o cliente pode interpretar esse valor simplesmente como uma estimativa.

### Orçamento B

```text
Material A ........ R$ 21,50
Material B ........ R$ 18,40
Serviço ........... R$ 32,00
Material C ........ R$  5,00
Outros ............ R$  0,00
----------------------------
TOTAL ............. R$ 76,90
```

O segundo orçamento mostra que existe um processo por trás daquele número.

O valor final deixa de parecer um palpite e passa a representar uma **composição calculada**.

É justamente essa diferença que o OrçaFácil busca proporcionar.

> **Quanto mais organizado é o processo por trás do orçamento, maior é a percepção de precisão e profissionalismo do resultado.**

---

# Tecnologias utilizadas

### Front-end

- **HTML5** — estrutura da aplicação
- **CSS3** — estilização e layout
- **JavaScript** — lógica e manipulação dos dados

### Bibliotecas

- **Chart.js** — criação dos gráficos do dashboard
- **jsPDF** — geração de documentos PDF
- **AutoTable** — criação de tabelas em documentos PDF

---

# Melhorias futuras

O OrçaFácil ainda está em desenvolvimento e possui diversas possibilidades de evolução.

Entre as próximas funcionalidades planejadas estão:

### Clientes

Criar um sistema completo de clientes, permitindo:

- Cadastro
- Edição
- Exclusão
- Consulta
- Associação de clientes aos orçamentos

### Dashboard de orçamentos

A partir do histórico de orçamentos, será possível gerar métricas como:

- Total de orçamentos
- Orçamentos aprovados
- Orçamentos recusados
- Orçamentos pendentes
- Valor total orçado
- Valor total aprovado
- Orçamentos por mês
- Taxa de aprovação

Por exemplo:

> **42 orçamentos realizados**
>
> **30 aprovados**
>
> **Taxa de aprovação: 71,4%**

Isso transforma o histórico em uma fonte de informações úteis para análise.

### Backend

Uma evolução futura será substituir o armazenamento exclusivamente local por uma arquitetura com backend.

A aplicação poderá evoluir de:

```text
Frontend
    ↓
LocalStorage
```

para:

```text
Frontend
    ↓
API
    ↓
Node.js
    ↓
Banco de dados
```

Isso permitirá transformar o OrçaFácil em uma aplicação verdadeiramente Full Stack.

---

# Visão futura

O objetivo não é simplesmente criar uma calculadora de preços.

A ideia é evoluir o OrçaFácil para um sistema completo de gerenciamento de orçamentos.

Começando com:

```text
Cadastro de itens
      ↓
Orçamentos
      ↓
Histórico
      ↓
Clientes
      ↓
Status
      ↓
Dashboard
      ↓
Análises
      ↓
Backend + Banco de dados
```

O projeto também serve como uma aplicação prática para estudar e aplicar conceitos de desenvolvimento de software, JavaScript, manipulação de dados, bibliotecas externas, persistência, arquitetura e futuramente desenvolvimento Full Stack.

---

# Status do projeto

**Em desenvolvimento**

Novas funcionalidades estão sendo implementadas gradualmente, com foco em transformar o OrçaFácil em uma aplicação cada vez mais completa, organizada e próxima de um sistema utilizado em um cenário real.
