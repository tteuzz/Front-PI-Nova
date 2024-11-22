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
            console.error('Erro ao buscar pedidos:', error);
            alert('Erro ao buscar pedidos.');
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
        <td>${product.numeroPedido || 'N/A'}</td>
        <td>${product.nomePedido || 'N/A'}</td>
        <td>${product.statusPedido !== null ? product.avalProduto : 'N/A'}</td>
        <td>${product.enderecoPedido || 'N/A'}</td>
        <td>${status}</td>
        <td>
            <button onclick="viewProduct(${product.numeroPedido})">Visualizar</button>
               ${grupoUsuario === 'administrador' ? `<button onclick="alterarStatus(${product.numeroPedido})">Alterar Status</button>` : ''}
               ${grupoUsuario === 'administrador' ? `<button onclick="editarProduto(${product.numeroPedido})">editar Produto</button>` : ''}
        </td>
    `;
        tableBody.appendChild(row);
    });

    document.getElementById('page-info').textContent = `Página ${paginaAtual} de ${Math.ceil(products.length / itemsPorPagina)}`;
}

function viewPedido(numeroPedido) {
    const product = products.find(p => p.idProduto === idProduto); 

    if (product) {
        console.log(product.nomeProduto);
        document.getElementById('modal-numero').textContent = product.numeroPedido;
        document.getElementById('modal-nome').textContent = product.nomePedido;
        document.getElementById('modal-status').textContent = product.statusPedido;
        document.getElementById('modal-endereco').textContent = product.enderecoPedido;

        const carouselImages = document.getElementById('carousel-images');
        carouselImages.innerHTML = '';

        fetch(`http://localhost:8015/imgProduto/${product.numeroPedido}/list`)
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