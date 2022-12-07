
const pokeApi = {}

// Requisição lista de pokemons
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url) // busca lista de pokemons
        .then((response) => response.json()) // converte o retorno para JSON
        .then((jsonBody) => jsonBody.results) // retornando os results (name, url)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // mapeando a lista de requisições
        .then((detailRequests) => Promise.all(detailRequests)) // esperando o termino das requisições
        .then((pokemonsDetails) => pokemonsDetails) // retornando a lista completa com detalhes dos pokemons
        .catch((error) => console.error(error))
}

// Convertendo resultado da requisição de detalhes para o pokemon-model
function convertPokeApiToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    
// Pegando tipo principal, [type] é o nome da váriavel que vai receber o primeiro item do array types
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    
    return pokemon
}

// Requisição detalhes dos pokemons
pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiToPokemon)
}

// Requisição para pokemon clicado
pokeApi.getPokemonClicked = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return fetch(url)
      .then((response) => response.json()) // acessando o pokemon, convertendo lista e retornando os detalhes em JSON
      .then(convertPokeApiToPokemonClicked)
  }

// Convertendo resultado da requisição do pokemon clicado para o pokemon-model
function convertPokeApiToPokemonClicked(pokeDetail) {
    const pokemonClicked = new PokemonClicked();
    pokemonClicked.number = pokeDetail.id;
    pokemonClicked.name = pokeDetail.name;
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    
    // Pegando tipo principal, [type] é o nome da váriavel que vai receber o primeiro item do array types
    const [type] = types;
    pokemonClicked.types = types;
    pokemonClicked.type = type;
    pokemonClicked.photo = pokeDetail.sprites.other.dream_world.front_default;
    pokemonClicked.height = (pokeDetail.height) * 10;
    pokemonClicked.weight = (pokeDetail.weight) / 10;
    const abilities = pokeDetail.abilities.map((pokeAbilities) => pokeAbilities.ability.name)
    pokemonClicked.abilities = abilities;
    const stats = pokeDetail.stats.map((baseStats) => baseStats.base_stat);
    pokemonClicked.stats = stats;
  
    return pokemonClicked;
}