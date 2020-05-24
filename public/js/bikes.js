const ORIGIN = '//localhost:3000/api';

function getFilterOptionsByTableName(tableName) {
    return fetch(`${ORIGIN}/${tableName}`).then(res => res.json());
}

async function addFilter(filterName, displayName, optionValueKey = 'id') {
    const filterOptions = await getFilterOptionsByTableName(filterName);

    const filtersHTML = filterOptions.reduce((html, option) => html + `
        <div class="form-check">
            <input 
                class="form-check-input" 
                type="checkbox" 
                data-type="${filterName}" 
                data-label="${option.name}" 
                id="filter_${filterName}_${option.id}" 
                value="${option[optionValueKey]}"
            />
            <label class="form-check-label w-100" for="filter_${filterName}_${option.id}">${option.name}</label>
        </div>`
        , '');

    document.getElementById('find_and_filter').innerHTML += `
        <div class="card mb-4" id="filter_${filterName}">
            <div class="card-header">${displayName} <div class="active-options"></div></div>
            <div class="card-body">
                ${filtersHTML}
            </div>
        </div>`;
}

const findAndFilters = {};

function normalizeOptionValuesForQuery(params, optionType) {
    if (params[optionType]) {
        params[optionType] = params[optionType].map(v => parseInt(v));
    }
}

function queryCollection() {
    // Deep clone
    const params = JSON.parse(JSON.stringify(findAndFilters));

    normalizeOptionValuesForQuery(params, 'brands');
    normalizeOptionValuesForQuery(params, 'wheel_size_aliases');

    return fetch(
        `${ORIGIN}/collection/query`,
        {
            method:  'POST',
            headers: {'Content-Type': 'application/json'},
            body:    JSON.stringify(params)
        }).then(res => res.json());
}


async function updateCollection() {
    const updatedCollection = await queryCollection();

    document.getElementById('collection').innerHTML = updatedCollection.reduce((collectionHTML, bike) => {
        const {wheel_sizes, aliases} = bike;

        const wheelSizesHTML = wheel_sizes.length > 0 ? `<div>Wheel size(s): ${wheel_sizes.map(s => s.name).join(',')}</div>` : '';
        const akaHTML        = aliases.length > 0 ? `<div>Also known by: ${aliases.join(', ')}</div>` : '';

        return collectionHTML + `
        <div class="bike" id="collection_item_${bike.id}">
            <h4>${bike.name}</h4>
            ${wheelSizesHTML}
            ${akaHTML}
        </div>`
    }, '');
}

async function searchCollectionByTerm(event) {
    event.preventDefault();
    event.stopPropagation();

    const term = document.getElementById('search-term').value.trim();

    if (term) {
        document.getElementById('search-title').innerText = `Results for "${term}"`;

        findAndFilters.term = term;
    } else {
        document.getElementById('search-title').innerText = `All in collection`;

        delete findAndFilters.term;
    }

    await updateCollection();
}

function onChangeFilterOption(e) {
    const el          = e.target;
    const {checked}   = el;
    const optionType  = el.getAttribute('data-type');
    const optionValue = el.value;
    const optionLabel = el.getAttribute('data-label');

    const cardHeaderBadgeContainer = el.closest('.card').querySelector('.active-options');

    const foundBadge = Array.from(cardHeaderBadgeContainer.children)
        .find(badgeEl => badgeEl.getAttribute('data-value') === optionValue);

    findAndFilters[optionType] = findAndFilters[optionType] || [];

    if (checked) {
        if (!foundBadge) {
            const badge = document.createElement('span');
            badge.setAttribute('class', "badge badge-pill badge-primary mr-1 mb-1");
            badge.setAttribute('data-value', optionValue);
            badge.innerHTML = optionLabel;
            cardHeaderBadgeContainer.appendChild(badge);
            badge.addEventListener('click', () => el.click());
        }

        findAndFilters[optionType].push(optionValue);
        findAndFilters[optionType] = Array.from(new Set(findAndFilters[optionType]));
    } else {
        if (foundBadge) {
            foundBadge.remove();
        }

        findAndFilters[optionType] = findAndFilters[optionType].filter(v => v !== optionValue);
    }

    // Don't include in search if no options given
    if (findAndFilters[optionType].length === 0) {
        delete findAndFilters[optionType];
    }
}

function addToggleFilterOption(checkboxEl) {
    checkboxEl.addEventListener('change', onChangeFilterOption);
}

async function onDOMContentLoaded() {
    await addFilter('brands', 'Brand');
    await addFilter('wheel_size_aliases', 'Wheel size');

    document.getElementById('find_and_filter').querySelectorAll('[type=checkbox]').forEach(
        addToggleFilterOption
    );

    await updateCollection();
}

// Entrypoint
window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
