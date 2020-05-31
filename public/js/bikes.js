const ORIGIN = '//localhost:3000/api';
let findAndFilters;

function getFilterOptionsByTableName(tableName) {
    return fetch(`${ORIGIN}/${tableName}`).then(res => res.json());
}

async function addFilter(filterName, displayName) {
    const filterOptions = await getFilterOptionsByTableName(filterName);

    const checkedOptions = findAndFilters[filterName] || [];

    const filtersHTML = filterOptions.reduce((html, option) => html + `
        <div class="form-check">
            <input 
                class="form-check-input" 
                type="checkbox" 
                data-type="${filterName}" 
                data-label="${option.name}" 
                id="filter_${filterName}_${option.id}" 
                value="${option.id}"
                onchange="onChangeFilterOption(event)"
                ${checkedOptions.includes(option.id) ? 'checked' : ''}
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


    const cardEl = document.getElementById(`filter_${filterName}`);
    filterOptions
        .filter(o => checkedOptions.includes(o.id))
        .forEach(o => addBadge(cardEl, o.id, o.name, false));
}

function normalizeOptionValuesForQuery(params, optionType) {
    if (params[optionType]) {
        params[optionType] = Array.from(new Set(params[optionType].map(v => parseInt(v))));
    }
}

function queryCollection() {
    // Deep clone: might not be needed
    const params = JSON.parse(JSON.stringify(findAndFilters));

    normalizeOptionValuesForQuery(params, 'brands');
    normalizeOptionValuesForQuery(params, 'wheel_size_aliases');

    const paramsJSONString = JSON.stringify(params);

    localStorage.setItem('filter', paramsJSONString);

    return fetch(
        `${ORIGIN}/collection/query`,
        {
            method:  'POST',
            headers: {'Content-Type': 'application/json'},
            body:    paramsJSONString
        }).then(res => res.json());
}


async function updateCollection() {
    const updatedCollection = await queryCollection();

    document.getElementById('collection').innerHTML = updatedCollection.reduce((collectionHTML, bike) => {
        const {wheel_sizes, aliases} = bike;

        const wheelSizesHTML = wheel_sizes.length > 0 ? `<div>Wheel size(s): ${wheel_sizes.map(s => s.name).join(',')}</div>` : '';
        const akaHTML        = aliases.length > 0 ? `<div>Also known by: ${aliases.join(', ')}</div>` : '';

        return collectionHTML + `
        <a href="bike.html#${bike.id}"><div class="bike" id="collection_item_${bike.id}">
            <h4>${bike.name}</h4>
            ${wheelSizesHTML}
            ${akaHTML}
        </div></a>`
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

function onBadgeClick(event) {
    const badge       = event.target;
    const optionValue = badge.getAttribute('data-value');
    const checkbox    = badge.closest('.card').querySelector(`input[value="${optionValue}"]`);
    checkbox.click();
    badge.remove();
}

function addBadge(el, optionValue, optionLabel, shouldAnimate = true) {
    const cardHeaderBadgeContainer = el.closest('.card').querySelector('.active-options');

    const badge = document.createElement('span');
    badge.setAttribute('class', "badge badge-pill badge-primary mr-1 mb-1 " + (shouldAnimate ? '' : 'animate-in'));
    badge.setAttribute('data-value', optionValue);
    badge.setAttribute('onclick', "onBadgeClick(event)");
    badge.innerHTML = optionLabel;

    cardHeaderBadgeContainer.prepend(badge);

    if (shouldAnimate) {
        setTimeout(() => badge.classList.add('animate-in'), 0);
    }
}

function onChangeFilterOption(e) {
    const el          = e.target;
    const {checked}   = el;
    const optionType  = el.getAttribute('data-type');
    const optionValue = parseInt(el.value);
    const optionLabel = el.getAttribute('data-label');

    const foundBadge = el.closest('.card').querySelector(`.active-options span[data-value="${optionValue}"]`);

    if (checked) {
        if (!foundBadge) {
            addBadge(el, optionValue, optionLabel);
        }

        findAndFilters[optionType] = findAndFilters[optionType] || [];
        findAndFilters[optionType].push(optionValue);
        findAndFilters[optionType] = Array.from(new Set(findAndFilters[optionType]));
    } else {
        if (foundBadge) {
            foundBadge.remove();
        }

        findAndFilters[optionType] = (findAndFilters[optionType] || []).filter(v => v !== optionValue);
    }

    // Don't include in search if no options given
    if (findAndFilters[optionType].length === 0) {
        delete findAndFilters[optionType];
    }

    updateCollection();
}

async function onDOMContentLoaded() {
    try {
        findAndFilters = JSON.parse(localStorage.getItem('filter')) || {};
    } catch (e) {
        console.log('Error parsing saved filters!');
    }

    await addFilter('brands', 'Brand');
    await addFilter('wheel_size_aliases', 'Wheel size');

    await updateCollection();
}

// Entrypoint
window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
