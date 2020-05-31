const ORIGIN = '//localhost:3000/api';

function queryCollection() {
    return fetch(
        `${ORIGIN}/bike/${location.hash}`,
        {
            method:  'POST',
            headers: {'Content-Type': 'application/json'},
            body:    JSON.stringify(params)
        }).then(res => res.json());
}

async function onDOMContentLoaded() {
    await updateCollection();
}

// Entrypoint
window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
