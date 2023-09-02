const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.altura = pokeDetail.height / 10
    pokemon.peso = pokeDetail.weight / 10
    pokemon.experiencia_base = pokeDetail.base_experience

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)
    const [ability] = abilities
    pokemon.abilities = abilities
    pokemon.ability = ability

    const stats = pokeDetail.stats.map((statSlot) => statSlot.stat.name)
    const [stat] = stats
    pokemon.stats = stats
    pokemon.stat = stat
    
    const baseStats = pokeDetail.stats.map((baseStatSlot) => baseStatSlot.base_stat)
    const [baseStat] = baseStats
    pokemon.baseStats = baseStats
    pokemon.baseStat = baseStat

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}


pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(async (pokeDetail) => {
            // Faz a requisição dos past_types
            const speciesResponse = await fetch(pokeDetail.species.url);
            const speciesData = await speciesResponse.json();
            const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
            const evolutionChainData = await evolutionChainResponse.json();
            const pastTypes = evolutionChainData.chain ? getPastTypes(evolutionChainData.chain, []) : [];

            // Cria o objeto Pokemon com os dados
            const convertedPokemon = convertPokeApiDetailToPokemon(pokeDetail);
            convertedPokemon.pastTypes = pastTypes;

            return convertedPokemon;
        });
}

// Função recursiva para obter os past_types da cadeia de evolução
function getPastTypes(evolutionChain, pastTypes) {
    pastTypes.push(evolutionChain.species.name);
    if (evolutionChain.evolves_to.length > 0) {
        return getPastTypes(evolutionChain.evolves_to[0], pastTypes);
    }
    return pastTypes;
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}


