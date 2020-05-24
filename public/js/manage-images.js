function submitSingleFile(e, fileInput) {
    e.preventDefault();
    e.stopPropagation();

    uploadFile(fileInput.files[0]);
}

function uploadFile(file, batch_id) {
    console.log(batch_id);

    return new Promise(resolve => {
        let queryString = '';

        if (batch_id) {
            queryString = `?batch_id=${encodeURIComponent(batch_id)}`;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `/api/imageset/upload${queryString}`);
        xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('Upload successful!');
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    alert('Could not upload file!');
                    resolve(null);
                }
            }
        };

        xhr.send(file);
    });
}

// Drag and drop functionality
function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const filesToUpload = [];
    for (let f of e.dataTransfer.files) filesToUpload.push(f);

    fetch('/api/uuid/generate')
        .then(res => res.json())
        .then(async ({uuidv4}) => {
            await Promise.all(filesToUpload.map(
                f => uploadFile(f, uuidv4)
            ));

            await updateImagesQuery();
        });
}

// Update management gallery
async function updateImagesQuery() {
    const images = await (fetch('/api/imageset/all')
        .then(res => res.json()));

    document.getElementById('images').innerHTML = images.reduce((html, img) => html + `<img src="${img.location}">`, '');
}

async function onDOMContentLoaded() {
    await updateImagesQuery();
}

// Entrypoint
window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
