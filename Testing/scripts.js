const stages = [
    { title: 'Этап 1', deals: 10 },
    { title: 'Этап 2', deals: 10 },
    { title: 'Этап 3', deals: 10 },
    { title: 'Этап 4', deals: 10 },
    { title: 'Этап 5', deals: 10 },
    { title: 'Этап 6', deals: 10 },
];

const funnel = document.querySelector('.funnel');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const dealsList = document.querySelector('.deals-list');

function createStageElement(stage, index) {
    const stageElement = document.createElement('div');
    stageElement.classList.add('stage');
    stageElement.innerHTML = `<h4>${stage.title}</h4><p>${stage.deals} сделок</p>`;
    stageElement.addEventListener('click', () => showDealsModal(index));
    return stageElement;
}

function showDealsModal(stageIndex) {
    const stage = stages[stageIndex];
    dealsList.innerHTML = '';

    for (let i = 0; i < stage.deals; i++) {
        const dealElement = document.createElement('li');
        dealElement.textContent = `Сделка ${i + 1} (${stage.title})`;
        dealsList.appendChild(dealElement);
    }

    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

stages.forEach(stage => {
    const stageElement = createStageElement(stage, funnel.children.length);
    funnel.appendChild(stageElement);
});

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', event => {
    if (event.target === modal) {
        closeModal();
    }
});
