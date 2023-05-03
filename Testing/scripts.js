const modal = document.getElementById("modal");
const closeModalButton = document.querySelector(".close");
const dealsList = document.querySelector(".deals-list");
const dealModal = document.getElementById("deal-modal");
const mainModal = document.getElementById("modal");
const globalSearchInput = document.getElementById("global-search");
const searchResults = document.getElementById("search-results");


async function fetchDealsByStage(stage) {
    const response = await fetch(`/deals/${encodeURIComponent(stage)}`);
    const deals = await response.json();
    return deals;
}


function filterDeals(deals, query) {
    return deals.filter(deal => deal.name.toLowerCase().includes(query.toLowerCase()));
}


function showDealModal(deal) {
    var modal = document.getElementById("deal-modal");

    document.querySelector(".deal-title").innerText = deal.name;
    document.querySelector(".deal-stage").innerText = "Этап: " + deal.stage;
    document.querySelector(".deal-cost").innerText = "Сумма сделки: " + deal.cost;
    document.querySelector(".deal-created-date").innerText = "Дата создания сделки: " + deal.created_date;
    document.querySelector(".deal-client-name").innerText = "Имя заказчика: " + deal.client_name;
    document.querySelector(".deal-additional-info").innerText = deal.additional_info || '';

    modal.style.display = "block";

    var span = modal.getElementsByClassName("close")[0];
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
    var dealsList = document.querySelector(".deals-list");
    dealsList.innerHTML = "";
    deals.forEach(function (deal) {
        var listItem = document.createElement("li");
        listItem.textContent = deal.name;
        listItem.onclick = function () {
            showDealModal(deal);
        };
        dealsList.appendChild(listItem);
    });
}

async function showDealsModal(stage) {
    const deals = await fetchDealsByStage(stage);
    const searchInput = document.getElementById("search");

    function updateDealsList() {
        const filteredDeals = filterDeals(deals, searchInput.value);
        renderDeals(filteredDeals);
    }

    searchInput.value = "";
    searchInput.oninput = updateDealsList;

    updateDealsList();

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
    return deals;
}

function renderSearchResults(deals) {
    searchResults.innerHTML = "";
    if (deals.length === 0) {
        searchResults.style.display = "none";
        return;
    }

    deals.forEach(function (deal) {
        var listItem = document.createElement("li");
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