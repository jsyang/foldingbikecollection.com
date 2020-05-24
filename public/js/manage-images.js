function uploadFile(event, fileInput) {
    event.preventDefault();
    event.stopPropagation();

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', '/api/imageset/upload');
    xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Upload successful!');
            } else {
                alert('Could not upload file!');
            }
        }
    };

    xhr.send(fileInput.files[0]);
}
