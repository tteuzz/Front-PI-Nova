function previewImages(event) {
    const files = event.target.files;
    const previewsContainer = document.getElementById('image-previews');
    previewsContainer.innerHTML = ''; 
    const imgsDto = [];
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function() {
            const img = document.createElement('img');
            img.src = reader.result;
            img.className = 'image-preview';
            previewsContainer.appendChild(img);
            const blobObject = { 
                blobImg: new Blob([file], 
                { type: file.type }) };
                imgsDto.push(blobObject);
        };
        reader.readAsDataURL(file);
    });
}