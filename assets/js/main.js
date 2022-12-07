const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('load-more-button')

// Limitando na quantidade de pokemon da primeira geração
const maxRecords = 151

// Controle da paginação
const limit = 12
let offset = 0;

// Convertendo a lista de pokemon em json para html
function convertPokemonToLi(pokemon) {
    return `
    <li class="pokemon ${pokemon.type}" id="pokemon-list" onclick="getClickedPokemon(${pokemon.number})">
      <span class="number" id="span-number">#${pokemon.number}</span>
      <span class="name" id="span-name">${pokemon.name}</span>
      <div class="detail" id="div-detail">
        <ol class="types">
          ${pokemon.types.map((type) => `<li class="type ${pokemon.type}">${type}</li>`).join("")}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name}" id="pokemon-img">
      </div>
    </li>
    `
  }

function loadPokemonItens(offset, limit) {
    // Pegando a lista de pokemons (nome e url)
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

// Inicializando a função para carregar os pokemons assim que abrir a aplicação
loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// Função para chamar a requisição do pokemon clicado
const modalPokemon = document.getElementById("modal-pokemon");
const pokemonHeader = document.getElementById("topo");
const pokemonAbout = document.getElementById("data-container");
const pokemonStats = document.getElementById("stats-container");
function loadPokemonClicked(id) {
  // Pegando detalhes do pokemon
  pokeApi.getPokemonClicked(id).then((pokemons = []) => {
    // Convertendo para o header para html
    const newHeader = convertPokemonHeaderToModal(pokemons);
    const newAbout = convertPokemonAboutToModal(pokemons);
    const newStats = convertPokemonStatsToModal(pokemons);
    setTimeout(function(){
      pokemonHeader.innerHTML = newHeader;
      pokemonAbout.innerHTML = newAbout;
      pokemonStats.innerHTML = newStats;
      modalPokemon.className = "";
      modalPokemon.classList.add("modal-pokemon");
      modalPokemon.classList.add(pokemons.type);
    }, 1000);
  })
  .catch((error) => console.error(error))
}

// Convertendo a lista de detalhes do header pokemon clicado para html
function convertPokemonHeaderToModal(pokemon) {
    return `
    <div class="modal-header">
      <h2>${pokemon.name}</h2>
      <span>#${pokemon.number}</span>
      <ol class="types">
        ${pokemon.types.map((type) => `<li class="type ${pokemon.type}">${type}</li>`).join("")}
      </ol>
      <img src="${pokemon.photo}" alt="${pokemon.name}">
    </div>
    `
  }
  
 // Convertendo a lista about pokemon clicado para html
function convertPokemonAboutToModal(pokemon) {
    return `
    <div class="left-data">
      <span>Height</span>
      <span>Weight</span>
      <span>Abilities</span>
    </div>
    <div class="right-data">
      <p>${pokemon.height} cm</p>
      <p>${pokemon.weight} kg</p>
      <p>${pokemon.abilities.map((abilities) => ` ${abilities}`).join()}</p>
    </div>
    `
  } 

// Convertendo a lista stats pokemon clicado para html
function convertPokemonStatsToModal(pokemon) {
    const sum = pokemon.stats.reduce(function(sum, i) {
      return sum + i;
  });
    return `
    <table>
      <tr>
        <td class="stats">HP</td>
        <td class="number-stats">${pokemon.stats[0]}</td>
        <td class="progress"><progress min="0" max="100" value="${pokemon.stats[0]}"></progress></td>
      </tr>
      <tr>
        <td class="stats">Attack</td>
        <td class="number-stats">${pokemon.stats[1]}</td>
        <td class="progress"><progress min="0" max="100" value="${pokemon.stats[1]}"></progress></td>
      </tr>
      <tr>
        <td class="stats">Defense</td>
        <td class="number-stats">${pokemon.stats[2]}</td>
        <td class="progress"><progress min="0" max="100" value="${pokemon.stats[2]}"></progress></td>
      </tr>
      <tr>
        <td class="stats">Sp. Atk</td>
        <td class="number-stats">${pokemon.stats[3]}</td>
        <td class="progress"><progress min="0" max="100" value="${pokemon.stats[3]}"></progress></td>
      </tr>
      <tr>
        <td class="stats">Sp. Def</td>
        <td class="number-stats">${pokemon.stats[4]}</td>
        <td class="progress"><progress min="0" max="100" value="${pokemon.stats[4]}"></progress></td>
      </tr>
      <tr>
        <td class="stats">Speed</td>
        <td class="number-stats">${pokemon.stats[5]}</td>
        <td class="progress"><progress min="0" max="100" value="${pokemon.stats[5]}"></progress></div></td>
      </tr>
      <tr>
        <td class="stats">Total</td>
        <td class="number-stats">${sum}</td>
        <td class="progress"><progress min="0" max="600" value="${sum}"></progress></td>
      </tr>
    </table>
    `
  }
  
  // Evento que chama a função openModal
function getClickedPokemon(pokemon) {
    loadPokemonClicked(pokemon);
    openModal();
  }

  // Função de abrir modal
function openModal() {
    const modal = document.getElementById("modal");
    const fade = document.getElementById("fade");
    modal.classList.add("show-modal"); 
    fade.style.display = "block";
    // Ativando botão de voltar (fechar modal)
    closeModal();
  }
  
  function closeModal() {
    const btn = document.getElementById("back-button");
    btn.addEventListener("click", () => { 
      modal.classList.remove("show-modal");
      fade.style.display = "none";
      clearModal();
    })
  }
  
  function clearModal() {
    pokemonHeader.innerHTML = `
    <div class="loading">
      <img src="assets/images/pokeball.gif" alt="Loading">
    </div>
    `;
    pokemonAbout.innerHTML = `
      <div>Loading...</div>
    `;
    pokemonStats.innerHTML = `
      <div>Loading...</div>
    `;
    modalPokemon.className = "";
    modalPokemon.classList.add("modal-pokemon");
    modalPokemon.classList.add("white");
  }
  
  // Função para abrir aba clicada do menu
  function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  
  // Pegando elemento com id="defaultOpen" e abrindo
  document.getElementById("defaultOpen").click();