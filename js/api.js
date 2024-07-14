document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://rickandmortyapi.com/api/character';
    const charactersContainer = document.getElementById('list-cards');
    const searchInput = document.getElementById('busca');
    const searchButton = document.getElementById('busca-botao');
    let currentPage = 1;

    // Função para buscar e exibir personagens
    async function fetchCharacters(url = `${API_URL}?page=${currentPage}`) {
        try {
            const response = await axios.get(url);
            const data = await response.data;
            displayCharacters(data.results.slice(0, 6)); // Exibir apenas 6 personagens
            updatePagination(data.info);
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
        }
    }

    // Função para exibir personagens
    function displayCharacters(characters) {
        charactersContainer.innerHTML = '';
        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.classList.add('col-md-4', 'd-flex', 'justify-content-center');
            characterCard.innerHTML = `
                <div class="card mb-4">
                    <img src="${character.image}" class="card-img-top" alt="${character.name}">
                    <div class="card-body">
                        <h5 class="card-title">${character.name}</h5>
                        <p class="card-text">Status: ${character.status}</p>
                        <p class="card-text">Species: ${character.species}</p>
                        <p class="card-text">Gender: ${character.gender}</p>
                    </div>
                </div>
            `;
            charactersContainer.appendChild(characterCard);
        });
    }

    // Função para atualizar a paginação
    function updatePagination(info) {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';

        if (info.prev) {
            const prevItem = document.createElement('li');
            prevItem.classList.add('page-item');
            prevItem.innerHTML = `<a class="page-link" href="#" data-url="${info.prev}">Anterior</a>`;
            paginationContainer.appendChild(prevItem);
        }

        if (info.next) {
            const nextItem = document.createElement('li');
            nextItem.classList.add('page-item');
            nextItem.innerHTML = `<a class="page-link" href="#" data-url="${info.next}">Próximo</a>`;
            paginationContainer.appendChild(nextItem);
        }

        // Adiciona evento de clique para paginação
        paginationContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = new URL(e.target.dataset.url);
                currentPage = url.searchParams.get('page');
                fetchCharacters(url);
            });
        });
    }

    // Evento de busca
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            currentPage = 1;
            fetchCharacters(`${API_URL}/?name=${query}&page=${currentPage}`);
        } else {
            fetchCharacters();
        }
    });

    // Chama a função para buscar personagens
    fetchCharacters();
});
