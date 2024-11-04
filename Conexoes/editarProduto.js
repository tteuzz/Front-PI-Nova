//comentando pra main

var imgsDto = [];
let produtoEdit = JSON.parse(localStorage.getItem('produtoEdit'));
console.log('Dados do localStorage:', localStorage.getItem('imagesEdit'));

let imagesEdit = JSON.parse(localStorage.getItem('imagesEdit'));

function previewImages(event) {
    const files = event.target.files;
    const previewsContainer = document.getElementById('image-previews');
    previewsContainer.innerHTML = ''; 
    imgsDto = [];

    

    Array.from(files).forEach((file) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file); 
        img.className = 'image-preview';

        const blobObject = { 
            blobImg: file,
            imgPrincipal: false,
            imgElement: img 
        };
        imgsDto.push(blobObject);

    
        img.onclick = function () {
            imgsDto.forEach(imgObj => {
                imgObj.imgPrincipal = false; 
                imgObj.imgElement.classList.remove('principal'); 
            });
            blobObject.imgPrincipal = true; 
            img.classList.add('principal'); 
        };

        previewsContainer.appendChild(img);

        const removeButton = document.createElement('button');
        removeButton.innerText = 'x';
        removeButton.className = 'remove-button';
        removeButton.onclick = function () {
            previewsContainer.removeChild(img);
            previewsContainer.removeChild(removeButton);
            imgsDto = imgsDto.filter(i => i !== blobObject); 
            if (blobObject.imgPrincipal) {
                if (imgsDto.length > 0) {
                    imgsDto[0].imgPrincipal = true;
                    imgsDto[0].imgElement.classList.add('principal');
                }
            }
        };
        previewsContainer.appendChild(removeButton);
    });
}

document.addEventListener('DOMContentLoaded', () => {


    

    if (produtoEdit) {

        document.getElementById('nomeProduto').value = produtoEdit.nomeProduto || '';
        document.getElementById('avalProduto').value = produtoEdit.avalProduto || '1'; 
        document.getElementById('descDetalhadaProduto').value = produtoEdit.descDetalhadaProduto || '';
        document.getElementById('precoProduto').value = produtoEdit.precoProduto || '';
        document.getElementById('qtdEstoqueProduto').value = produtoEdit.qtdEstoqueProduto || '';
    }

    if (imagesEdit) {
        const previewsContainer = document.getElementById('image-previews');
        previewsContainer.innerHTML = ''; 

        imagesEdit.forEach(src => {
            const img = document.createElement('img');
            img.src = src.imgBlob;
            img.className = 'image-preview';
            previewsContainer.appendChild(img);
        });
    }
});

document.querySelector('.form-cadastro').onsubmit = function (event) {
    event.preventDefault();

    const nomeProduto = document.getElementById('nomeProduto').value;
    const avalProduto = parseFloat(document.getElementById('avalProduto').value);
    const descDetalhadaProduto = document.getElementById('descDetalhadaProduto').value;
    const precoProduto = parseFloat(document.getElementById('precoProduto').value.replace(',', '.'));
    const qtdEstoqueProduto = parseInt(document.getElementById('qtdEstoqueProduto').value);

    const produtoData = {
        nomeProduto,
        avalProduto,
        descDetalhadaProduto,
        precoProduto,
        qtdEstoqueProduto,
    };
  
    fetch(`http://localhost:8015/produto/update/${produtoEdit.idProduto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoData)
    })
    .then(response => response.json())
    .then(produto => {
    
        updateImg(produtoEdit.idProduto); 
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao cadastrar produto.');
    });
};

function updateImg(id) {
    const formData = new FormData();

    imgsDto.forEach(img => {
        formData.append('imgBlob', img.blobImg); 
        formData.append('imgPrincipal', img.imgPrincipal); 
    });


const imagesEdit = JSON.parse(localStorage.getItem('imagesEdit')) || [];
const ids = imagesEdit.map(image => image.id || 0); 

    imagesEdit.forEach(image => {

        const imageId = Number(image.id); 
        if (!isNaN(imageId)) {
            ids.push(imageId); 
        } else {
            console.warn('ID inválido encontrado:', image.id); 
        }
    });


    ids.forEach(imageId => {
        formData.append('id', imageId); 
    });

    console.log('IDs das imagens:', ids); 

    fetch(`http://localhost:8015/imgProduto/update/${id}`, {
        method: 'PUT',
        body: formData 
    })
    .then(response => response.json())
    .then(() => {
        window.location.href = 'ListaProdutos.html';
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao atualizar imagens.');
    });
}



