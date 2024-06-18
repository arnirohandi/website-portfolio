// IIFE
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=30';

  /**
  * Add pokemon to the pokemon list
  * @param {Pokemon} pokemon
  */
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  /**
  * Add pokemon info to pokemon list,
  * create unordered list,
  * create pokemon as button in html page
  * @param {Pokemon} pokemon 
  */
  function addListItem(pokemon) {
    let pokemonInfo = pokemon.name + " (height: " + pokemon.height + ")";

    // Check if the height is above a certain value to highlight special Pokémon
    if (pokemon.height > 10) {
      pokemonInfo += " - Wow, that's big!";
    }

    // Get ul node
    let pokemonList = document.querySelector('#pokemon-list');

    // Create li node
    let listItem = document.createElement('li');

    // Add class list-group-item
    listItem.classList.add('list-group-item');

    // Create button node
    let button = document.createElement('button');
    button.innerText = pokemonInfo;
    button.classList.add('btn', 'btn-warning');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');

    // Event listener
    button.addEventListener('click', function () { showDetails(pokemon) });

    // Append button to li node
    listItem.appendChild(button);

    // Append li node to ul node
    pokemonList.appendChild(listItem);
  }

  /**
  * Get pokemon list
  * @return {Array<Pokemon>} Array of pokemon 
  */
  function getAll() {
    return pokemonList
  }

  /**
  * Fetch pokemons from API server
  * @return {Promise<json>} Promise 
  */
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(
        function (json) {
          json.results.forEach(function (item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        }
      )
      .catch(
        function (e) {
          console.error(e);
        }
      )
  }

  /**
  * Get details of pokemon from API server
  * @param {Pokemon} item
  */
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function (e) {
      console.error(e);
    });
  }

  /**
  * Show details of pokemon list
  * @param {Pokemon} pokemon 
  */
  function showDetails(pokemon) {
    loadDetails(pokemon);
    showModal(
      pokemon.name,
      pokemon.height,
      pokemon.imageUrl
    );
  }

  return {
    add: add,
    addListItem: addListItem,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

/**
* Show modal of Pokemon profile
* @param {string} title Title of the modal
* @param {string} text Content inside the modal
* @param {string} imgUrl Link to picture of pokemon
*/
function showModal(title, text, imgUrl) {

  let modalBody = $(".modal-body");
  let modalTitle = $(".modal-title");
  modalTitle.empty();
  modalBody.empty();

  // Creating element for name in modal content
  let nameElement = $("<h1>" + title + "</h1>");
  // Creating img in modal content
  let imageElementFront = $('<img class="modal-img" style="width:50%">');
  imageElementFront.attr("src", imgUrl);
  let heightElement = $("<p>" + "Height : " + text + "</p>");

  modalTitle.append(nameElement);
  modalBody.append(imageElementFront);
  modalBody.append(heightElement);
}

/**
* Hide modal of Pokemon profile
*/
function hideModal() {
  let modalContainer = document.querySelector('#modal-container');
  modalContainer.classList.remove('is-visible');
}

pokemonRepository.loadList()
.then(function () {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    // Load the datails first, otherwise the pokemon only has name and url
    pokemonRepository.loadDetails(pokemon)
    .then(function () {
      pokemonRepository.addListItem(pokemon);
    });
  });
});

// Listner for escape key
window.addEventListener('keydown', (e) => {
  let modalContainer = document.querySelector('#modal-container');
  if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
    hideModal();
  }
});