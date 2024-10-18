document.addEventListener('DOMContentLoaded', (event) => {
    const icone = document.querySelector('.icone');
    const cardLoginCadastro = document.getElementById('card-login-cadastro');
    const userLogado = sessionStorage.getItem("usuarioLogado")
    fetchProducts();
    icone.addEventListener('click', (event) => {
        event.stopPropagation(); 
        if (cardLoginCadastro.style.display === 'none' || cardLoginCadastro.style.display === '') {

            if(userLogado != null){
                cardLoginCadastro.innerHTML = `
                <button onclick="verPerfil()">Ver Perfil</button>
                <button onclick="logout()">Logout</button>
            `;
            } else{
                cardLoginCadastro.innerHTML = `
                <button onclick="login()">Logar</button>

            `;
            }
            cardLoginCadastro.style.display = 'block';
        } else {
            cardLoginCadastro.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (!icone.contains(event.target) && !cardLoginCadastro.contains(event.target)) {
            cardLoginCadastro.style.display = 'none';
        }
    });

    const myCarouselElement = document.querySelector('#carouselExampleIndicators');
    
    const carousel = new bootstrap.Carousel(myCarouselElement, {
        interval: 2000,
        touch: false
    });
});

function login() {
    window.location.href = 'Telainicial.html';
}

function cadastro() {
    window.location.href = 'TelaCadastroUsuario.html';
}

function verPerfil(){
    window.location.href = "TelaPerfil.html";
}

function logout() {
    alert("Você saiu da sessão");
    localStorage.clear();
    window.location.href = 'Telainicial.html';
}

function fetchProducts() {
    fetch('http://localhost:8015/produto/list') 
        .then(response => response.json())
        .then(data => {
            const products = data; 
            displayProducts(products); 
        })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
            alert('Erro ao buscar produtos.');
        });
}

function displayProducts(products) {
    const cardContainer = document.querySelector('.l-cards'); 
    cardContainer.innerHTML = ''; 

    const promises = products.map(product => {
        return fetch(`http://localhost:8015/imgProduto/${product.idProduto}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da rede');
            }
            return response.json();
        })
        .then(imagesData => {
            const principalImage = imagesData.find(img => img.imgPrincipal);
            
            if (principalImage) {
                const imgSrc = `data:image/jpeg;base64,${principalImage.imgBlob}`;
                
                return { product, imgSrc };
            }
        })
        .catch(error => {
            console.error('Erro ao buscar a imagem:', error);
        });
    });

    Promise.all(promises).then(results => {
        results.forEach(result => {
            if (result) { 
                const { product, imgSrc } = result;
                
                const card = document.createElement('article');
                card.classList.add('c-card');

                card.innerHTML = `
                    <div class="c-card__image">
                        <img src="${imgSrc}" width="100%" alt="${product.nomeProduto}">
                    </div>
                    <div class="c-card__content">
                        <h2 class="titulo-produto">${product.nomeProduto}</h2>
                        <p class="preco-produto">R$ ${product.precoProduto.toFixed(2)}</p>
                        <button class="button" onclick="viewProduct(${product.idProduto})">Detalhe</button>
                    </div>
                `;

                cardContainer.appendChild(card);
            }
        });
    });
}

function viewProduct(idProduto) {
    window.location.href = `DetalhesProdutos.html?id=${idProduto}`;
}