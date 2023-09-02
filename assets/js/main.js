const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonBotao = document.getElementsByClassName('pokemonBotao')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
    <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join(' ')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
            
<ol class="popup">
        <li class="borderImg ${pokemon.type}">
            <div class="popupNameNumber">
                <span class="popupNumber">Nº ${pokemon.number}</span>
                <span class="popupName">${pokemon.name}</span>
            </div>
                <span><img src="${pokemon.photo}" alt="${pokemon.name}" class="popupImg"></span>
        </li>
        <li class="pesoAltura">
            <span">${pokemon.altura} metros  ${pokemon.peso} Kg</span>
        </li>
        <li class="detalhes">
                <div class="popupTypes">
                    <div>Tipo:</div>
                    ${pokemon.types.map((type) => `<span class="popupType ${type}">${type}</span>`).join(' ')}
                </div>
                <div class="abilities">
                    <div>Habilidades:</div>
                    ${pokemon.abilities.map((ability) => `<span class="ability">${ability}</span>`).join(' ')}
                </div>
            <div Class="Stats">
                Stats:
                <div class="stats">
                    <div >
                    ${pokemon.stats.map((stat) => `<span class="stat ${stat}">${stat}</span>`).join(' ')}
                    </div>
                    <div >
                    ${pokemon.baseStats.map((baseStat, stat) => `<span class="stat statNumber">${baseStat}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="pastTypes">
                Evolução:
                <div class="popupPastType ${pokemon.type}">
                ${pokemon.pastTypes.map((pastType) => `<span class="pastType">${pastType}</span>`).join(' ')}
                </div>
            </div>   
        </li> 
</ol>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

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
