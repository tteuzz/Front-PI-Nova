//comentando pra main

let products = [];
const itemsPorPagina = 10;
let paginaAtual = 1;
let currentImageIndex = 0; 
let images = []; 
let imagesToEdit = []

const grupoUsuario = localStorage.getItem("grupoUsuario");

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

function fetchProducts() {
    fetch('http://localhost:8015/produto/list') 
        .then(response => response.json())
        .then(data => {
            products = data; 
            displayProducts();
        })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
            alert('Erro ao buscar produtos.');
        });
}

function displayProducts() {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = '';

    const start = (paginaAtual - 1) * itemsPorPagina;
    const end = start + itemsPorPagina;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach(product => {
        const isActive = product.prodDhInativo === null;
        const status = isActive ? 'Ativo' : 'Inativo';
        
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${product.idProduto || 'N/A'}</td>
        <td>${product.nomeProduto || 'N/A'}</td>
        <td>${product.avalProduto !== null ? product.avalProduto : 'N/A'}</td>
        <td>${product.descDetalhadaProduto || 'N/A'}</td>
        <td>R$ ${product.precoProduto ? product.precoProduto.toFixed(2) : 'N/A'}</td>
        <td>${product.qtdEstoqueProduto || 0}</td>
        <td>${status}</td>
        <td>
            <button onclick="viewProduct(${product.idProduto})">Visualizar</button>
               ${grupoUsuario === 'administrador' ? `<button onclick="alterarStatus(${product.idProduto})">Alterar Status</button>` : ''}
               ${grupoUsuario === 'administrador' ? `<button onclick="editarProduto(${product.idProduto})">editar Produto</button>` : ''}
             ${grupoUsuario === 'estoquista' ? `<button onclick="openModal(${product.idProduto}, ${product.qtdEstoqueProduto})">Alterar a quantidade</button>` : ''}
        </td>
    `;
        tableBody.appendChild(row);
    });

    document.getElementById('page-info').textContent = `Página ${paginaAtual} de ${Math.ceil(products.length / itemsPorPagina)}`;
}


function editarProduto(id) {
    fetch(`http://localhost:8015/produto/${id}/acharProduto`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar produto');
            }
            return response.json();
        })
        .then(produto => {
            localStorage.setItem('produtoEdit', JSON.stringify(produto));

            return fetch(`http://localhost:8015/imgProduto/${produto.idProduto}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar imagens do produto');
            }
            return response.json();
        })
        .then(data => {
            const imagesToEdit = data.map(img => ({
                id: img.idImgProd,
                imgBlob: `data:image/jpeg;base64,${img.imgBlob}`
            }));
            

            localStorage.setItem('imagesEdit', JSON.stringify(imagesToEdit));

          
            window.location.href = 'TelaEditarProduto.html';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao buscar os dados do produto.');
        });
}

function viewProduct(idProduto) {
    const product = products.find(p => p.idProduto === idProduto); 

    if (product) {
        console.log(product.nomeProduto);
        document.getElementById('modal-name').textContent = product.nomeProduto;
        document.getElementById('modal-avaliacao').textContent = product.avalProduto;
        document.getElementById('modal-descricao').textContent = product.descDetalhadaProduto;
        document.getElementById('modal-preco').textContent = product.precoProduto;
        document.getElementById('modal-qtd').textContent = product.qtdEstoqueProduto;

        const carouselImages = document.getElementById('carousel-images');
        carouselImages.innerHTML = '';

        fetch(`http://localhost:8015/imgProduto/${product.idProduto}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da rede');
            }
            return response.json();
        })
        .then(data => {
            images = [];
            const principalImage = data.find(img => img.imgPrincipal); 
            if (principalImage) {
                const principalImgElement = document.createElement('img');
                principalImgElement.src = `data:image/jpeg;base64,${principalImage.imgBlob}`;
                principalImgElement.alt = principalImage.nomeArquivos; 
                principalImgElement.classList.add('carousel-image'); 
                carouselImages.appendChild(principalImgElement);
                images.push(principalImgElement.src);
            }
            data.forEach(img => {
                if (!img.imgPrincipal) {
                    const imgElement = document.createElement('img');
                    imgElement.src = `data:image/jpeg;base64,${img.imgBlob}`;
                    imgElement.alt = img.nomeArquivos; 
                    imgElement.classList.add('carousel-image'); 
                    carouselImages.appendChild(imgElement);
                    images.push(imgElement.src);
                }
            });

            if (images.length > 0) {
                currentImageIndex = 0; 
                carouselImages.firstChild.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar a imagem:', error);
            alert('Erro ao buscar a imagem.');
        });

        document.getElementById('product-modal').style.display = 'block';
    } else {
        console.error('Produto não encontrado.');
    }
}


function nextImage() {
    const carouselImages = document.getElementById('carousel-images');
    const imgs = carouselImages.getElementsByTagName('img');
    if (imgs.length > 0) {
        imgs[currentImageIndex].style.display = 'none'; 
        currentImageIndex = (currentImageIndex + 1) % imgs.length; 
        imgs[currentImageIndex].style.display = 'block'; 
    }
}

function prevImage() {
    const carouselImages = document.getElementById('carousel-images');
    const imgs = carouselImages.getElementsByTagName('img');
    if (imgs.length > 0) {
        imgs[currentImageIndex].style.display = 'none';
        currentImageIndex = (currentImageIndex - 1 + imgs.length) % imgs.length; 
        imgs[currentImageIndex].style.display = 'block'; 
    }
}

function closeModal() {
    console.log('closeModal called');
    document.getElementById('product-modal').style.display = 'none';
}


function nextPage() {
    if (paginaAtual * itemsPorPagina < products.length) {
        paginaAtual++;
        displayProducts();
    }
}

function prevPage() {
    if (paginaAtual > 1) {
        paginaAtual--;
        displayProducts();
    }
}

function openModal(id, quantidade) {
    document.getElementById('idProduto').value = id;
    document.getElementById('qtdEstoqueProduto').value = quantidade;
    document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveQuantity() {
    const idProduto = document.getElementById('idProduto').value;
    const novaQuantidade = parseInt(document.getElementById('qtdEstoqueProduto').value);

    if (novaQuantidade < 0) {
        alert('Por favor, insira uma quantidade válida (maior ou igual a zero).');
        return;
    }

    if (novaQuantidade === 0) {
        alterarStatus(idProduto)
            .then(() => atualizarQuantidade(idProduto, novaQuantidade))
            .catch(error => console.error('Erro ao alterar status:', error));
    } else {
        atualizarQuantidade(idProduto, novaQuantidade);
    }
}

function atualizarQuantidade(idProduto, novaQuantidade) {
    fetch(`http://localhost:8015/produto/${idProduto}/${novaQuantidade}/alteraQuantidade`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Quantidade atualizada com sucesso!');
            closeEditModal();
            const produto = products.find(p => p.idProduto === idProduto);
            if (produto) {
                produto.qtdEstoqueProduto = novaQuantidade;
                produto.prodDhInativo = novaQuantidade === 0 ? new Date() : null;
            }
            displayProducts();
            window.location.reload();

        } else {
            alert('Erro ao atualizar quantidade.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);


        alert('Erro ao atualizar quantidade.');
    });
}

function alterarStatus(idProduto) {
    if (confirm('Deseja alterar o status?')) {
        return fetch(`http://localhost:8015/produto/${idProduto}/alterarStatus`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                alert('Erro ao alterar status.');
                throw new Error('Erro ao alterar status');
            } else {
                displayUsers();
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    } else {
        console.log('Alteração de status cancelada.');
    }
}