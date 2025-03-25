document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000/characters";
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const nameDisplay = document.getElementById("name");
    const imageDisplay = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const votesInput = document.getElementById("votes");
    const resetButton = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");
    const newNameInput = document.getElementById("new-name");
    const newImageInput = document.getElementById("image-url");

    let currentCharacter = null;

    // Fetch characters and display in character bar
    function fetchCharacters() {
        fetch(baseUrl)
            .then(response => response.json())
            .then(characters => {
                characterBar.innerHTML = "";
                characters.forEach(character => {
                    displayCharacterInBar(character);
                });
            });
    }

    function displayCharacterInBar(character) {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacterDetails(character));
        characterBar.appendChild(span);
    }

    function displayCharacterDetails(character) {
        currentCharacter = character;
        nameDisplay.textContent = character.name;
        imageDisplay.src = character.image;
        imageDisplay.alt = character.name;
        voteCount.textContent = character.votes;
    }

    // votes  submission
    votesForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const votesToAdd = parseInt(votesInput.value) || 0;
        if (currentCharacter) {
            const newVotes = currentCharacter.votes + votesToAdd;
            updateVotes(currentCharacter.id, newVotes);
        }
        votesForm.reset();
    });

    function updateVotes(characterId, newVotes) {
        fetch(`${baseUrl}/${characterId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: newVotes })
        })
            .then(response => response.json())
            .then(updatedCharacter => {
                currentCharacter.votes = updatedCharacter.votes;
                voteCount.textContent = updatedCharacter.votes;
            });
    }

    //  reset button
    resetButton.addEventListener("click", () => {
        if (currentCharacter) {
            updateVotes(currentCharacter.id, 0);
        }
    });

    // new character submission
    characterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newCharacter = {
            name: newNameInput.value,
            image: newImageInput.value,
            votes: 0
        };

        fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCharacter)
        })
            .then(response => response.json())
            .then(savedCharacter => {
                displayCharacterInBar(savedCharacter);
                displayCharacterDetails(savedCharacter);
            });

        characterForm.reset();
    });

    // fetch
    fetchCharacters();
});// Your code here
