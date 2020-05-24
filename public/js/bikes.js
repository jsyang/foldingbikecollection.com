const ORIGIN = '//localhost:3000/api';

function getFilterOptionsByTableName(tableName) {
    return fetch(`${ORIGIN}/${tableName}`).then(res => res.json());
}

async function addFilter(filterName, displayName, optionValueKey = 'id') {
    const filterOptions = await getFilterOptionsByTableName(filterName);

    const filtersHTML = filterOptions.reduce((html, option) => html + `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="filter_${filterName}_${option.id}" value="${option[optionValueKey]}">
            <label class="form-check-label w-100" for="filter_${filterName}_${option.id}">${option.name}</label>
        </div>`
        , '');

    document.getElementById('find_and_filter').innerHTML += `
        <div class="card mb-4" id="filter_${filterName}">
            <div class="card-header">${displayName}</div>
            <div class="card-body">
                ${filtersHTML}
            </div>
        </div>`;
}

function queryCollection(params) {
    return fetch(
        `${ORIGIN}/collection/query`,
        {
            method:  'POST',
            headers: {'Content-Type': 'application/json'},
            body:    JSON.stringify(params)
        }).then(res => res.json());
}

async function updateCollection(findAndFilters = {}) {
    const updatedCollection = await queryCollection(findAndFilters);

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
    } else {
        document.getElementById('search-title').innerText = `All in collection`;
    }

    await updateCollection({term});
}

function uploadFile(event, fileInput){
    event.preventDefault();
    event.stopPropagation();

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', '/api/imageset/upload');
    xhr.onreadystatechange = async () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                console.log('Upload successful!');
            } else {
                alert('Could not upload file!');
            }
        }
    };

    xhr.send(fileInput.files[0]);
}

window.addEventListener('DOMContentLoaded', async () => {
    await addFilter('brands', 'Brand');
    await addFilter('wheel_size_aliases', 'Wheel size');
    await updateCollection();
});
