const modal = document.getElementById("modal");
const closeModalButton = document.querySelector(".close");
const dealModal = document.getElementById("deal-modal");
const mainModal = document.getElementById("modal");
const globalSearchInput = document.getElementById("global-search");
const searchResults = document.getElementById("search-results");
let deals = [];


async function fetchDealsByStage(stage) {
    const response = await fetch(`/deals/${encodeURIComponent(stage)}`);
    const deals = await response.json();
    return deals.slice(0, 5);
}

function updateDealsList(deals) {
    const searchInput = document.getElementById("stage-search");
    const filteredDeals = filterDeals(deals, searchInput.value);
    renderDeals(filteredDeals);
}

document.getElementById('clear-global-search').onclick = function() {
    document.getElementById('global-search').value = '';
}

document.getElementById('clear-stage-search').onclick = function() {
    const searchInput = document.getElementById('stage-search');
    searchInput.value = '';
    updateDealsList(deals);
}


function filterDeals(deals, query) {
    return deals.filter(deal => deal.name.toLowerCase().includes(query.toLowerCase()));
}


function showDealModal(deal) {
    const modal = document.getElementById("deal-modal");

    document.querySelector(".deal-title").innerText = deal.name;
    document.querySelector(".deal-stage").innerText = "Этап: " + deal.stage;
    document.querySelector(".deal-cost").innerText = "Сумма сделки: " + deal.cost;
    document.querySelector(".deal-created-date").innerText = "Дата создания сделки: " + deal.created_date;
    document.querySelector(".deal-client-name").innerText = "Имя заказчика: " + deal.client_name;
    document.querySelector(".deal-additional-info").innerText = deal.additional_info || 'Дополнительной информации нет.';

    modal.style.display = "block";

    const span = modal.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function renderDeals(deals) {
    const dealsList = document.querySelector(".deals-list");
    dealsList.innerHTML = "";
    deals.forEach(function (deal) {
        const listItem = document.createElement("li");
        listItem.textContent = deal.name;
        listItem.onclick = function () {
            showDealModal(deal);
        };
        dealsList.appendChild(listItem);
    });
}

async function showDealsModal(stage) {
    deals = await fetchDealsByStage(stage);
    const searchInput = document.getElementById("stage-search");

    searchInput.oninput = function() {
        updateDealsList(deals);
    };

    // Заменяем заголовок модального окна на название этапа
    document.querySelector(".modal-content h3").textContent = `Сделки этапа: ${stage}`;

    updateDealsList(deals);

    modal.style.display = 'block';
}

closeModalButton.onclick = () => {
    modal.style.display = "none";
};

window.addEventListener('click', (event) => {
    if (event.target === mainModal) {
        mainModal.style.display = "none";
    } else if (event.target === dealModal) {
        dealModal.style.display = "none";
    }
});

async function showSearchResults(query) {
    const response = await fetch(`/search_deals?query=${encodeURIComponent(query)}`);
    const deals = await response.json();
    return deals.slice(0, 5);
}

function renderSearchResults(deals) {
    searchResults.innerHTML = "";
    if (deals.length === 0) {
        searchResults.style.display = "none";
        return;
    }

    deals.forEach(function (deal) {
        const listItem = document.createElement("li");
        listItem.textContent = deal.name;
        listItem.onclick = function () {
            showDealModal(deal);
        };
        searchResults.appendChild(listItem);
    });

    searchResults.style.display = "block";
}

globalSearchInput.addEventListener("input", async () => {
    if (globalSearchInput.value.trim() === "") {
        searchResults.style.display = "none";
        return;
    }

    const deals = await showSearchResults(globalSearchInput.value);
    renderSearchResults(deals);
});

document.addEventListener("click", (event) => {
    if (event.target !== globalSearchInput && event.target !== searchResults) {
        searchResults.style.display = "none";
    }
});