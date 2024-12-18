document.addEventListener('DOMContentLoaded', function() {
    let products = JSON.parse(localStorage.getItem('produtos')) || [];
   // let enderecoPrincipal = JSON.parse(sessionStorage.getItem('enderecoPrincipal')) || null;
    let freteSelecionado = 0;

    const itemsPerPage = 10;
    let currentPage = 1;

    
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    finalizarPedidoBtn.disabled = true; // Desabilita o botão inicialmente
    finalizarPedidoBtn.classList.add('botao-desabilitado'); // Adiciona a classe de botão desabilitado

    // window.definirEnderecoPrincipal = async function(index) {
    //     const enderecos = JSON.parse(sessionStorage.getItem('enderecos')) || [];
    //     const endereco = enderecos[index];

    //     sessionStorage.setItem('enderecoPrincipal', JSON.stringify(endereco));
    //     enderecoPrincipal = endereco;

    //     displayEnderecoPrincipal();
    //     exibirFretesDisponiveis(endereco.cep);
    //     alert("Endereço de entrega definido");

    //     const addressItems = document.querySelectorAll('.address-item');
    //     addressItems.forEach(item => {
    //         const defaultLabel = item.querySelector('.default-label');
    //         const button = item.querySelector('button');
    //         if (defaultLabel) {
    //             defaultLabel.textContent = '';
    //         }
    //         if (button) {
    //             button.style.display = 'block';
    //         }
    //     });

    //     const addressItem = document.getElementById(`address-item-${index}`);
    //     const defaultLabel = addressItem.querySelector('.default-label');
    //     const button = addressItem.querySelector('button');
    //     if (defaultLabel) {
    //         defaultLabel.textContent = 'Endereço De Entrega';
    //     }
    //     if (button) {
    //         button.style.display = 'none';
    //     }
    // };

    function displayProducts() {
        const tableBody = document.getElementById('product-table-body');
        tableBody.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedProducts = products.slice(start, end);

        paginatedProducts.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `   
                <td><img src="${product.imagem}" alt="${product.nome}" style="width:100px;height:100px;"></td>
                <td>${product.nome}</td>
                <td class="preço">R$ ${parseFloat(product.preco).toFixed(2).replace('.', ',')}</td>
                <td>
                    <button class="decrease-btn" data-index="${index}">-</button>
                    <span class="quantidade">${product.quantidade}</span>
                    <button class="increase-btn" data-index="${index}">+</button>
                </td>
                <td class="total">R$ ${(parseFloat(product.preco) * product.quantidade).toFixed(2).replace('.', ',')}</td>
                <td><button class="remove-btn" data-index="${index}">Remover</button></td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.increase-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                increaseQuantity(index);
            });
        });

        document.querySelectorAll('.decrease-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                decreaseQuantity(index);
            });
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                removeProduct(index);
            });
        });
    }

    function increaseQuantity(index) {
        products[index].quantidade += 1;
        updateProductTotal(index);
        updateLocalStorageAndDisplay();
    }

    function decreaseQuantity(index) {
        if (products[index].quantidade > 1) {
            products[index].quantidade -= 1;
            updateProductTotal(index);
            updateLocalStorageAndDisplay();
        }
    }

    function updateProductTotal(index) {
        const product = products[index];
        const total = parseFloat(product.preco) * product.quantidade;
        product.total = total;
    }

    function removeProduct(index) {
        products.splice(index, 1); 
        updateLocalStorageAndDisplay();
    }

    function updateLocalStorageAndDisplay() {
        localStorage.setItem('produtos', JSON.stringify(products));
        displayProducts();
        atualizarResumo();
    }

    function atualizarResumo() {
        const valorTotalProdutos = products.reduce((acc, product) => acc + (parseFloat(product.preco) * product.quantidade), 0);
        const valorTotal = valorTotalProdutos + freteSelecionado;
        document.getElementById('resumo-valor').textContent = `Valor dos Produtos: R$ ${valorTotalProdutos.toFixed(2).replace('.', ',')}`;
        document.getElementById('resumo-total').textContent = `Valor Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }

    function displayEnderecoPrincipal() {
        const enderecoContainer = document.getElementById('endereco-principal');
        enderecoContainer.innerHTML = '';

        if (enderecoPrincipal) {
            enderecoContainer.innerHTML += `
                <p><strong>Endereço Principal:</strong></p>
                <p>${enderecoPrincipal.logradouro}, ${enderecoPrincipal.numero}, ${enderecoPrincipal.complemento}, ${enderecoPrincipal.bairro}, ${enderecoPrincipal.cidade}, ${enderecoPrincipal.uf}, ${enderecoPrincipal.cep}</p>
            `;
        }

        const enderecos = JSON.parse(sessionStorage.getItem('enderecos')) || [];
        const addedAddressesContainer = document.getElementById('added-addresses-container');
        addedAddressesContainer.innerHTML = '';

        enderecos.forEach((endereco, index) => {
            addedAddressesContainer.innerHTML += `
                <div class="address-item" id="address-item-${index}">
                    <p>${endereco.logradouro}, ${endereco.numero}, ${endereco.complemento}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.uf}, ${endereco.cep}</p>
                    <button class="button" onclick="definirEnderecoPrincipal(${index})">Definir como Entrega</button>
                    <span class="default-label">${endereco.enderecoPrincipal ? 'Endereço Padrão' : ''}</span>
                </div>
            `;
        });
    }

    function exibirFretesDisponiveis(cep) {
        const freteOpcoes = document.getElementById('frete-opcoes');
        const pac = gerarValorFrete();
        const sedex = gerarValorFrete();
        const muitoRapido = gerarValorFrete();

        freteOpcoes.innerHTML = `
            <p>Fretes disponíveis</p>
            <label>
                <input type="radio" name="frete" value="${pac}">
                PAC - R$ ${pac.toFixed(2).replace('.', ',')}
            </label>
            <label>
                <input type="radio" name="frete" value="${sedex}">
                SEDEX - R$ ${sedex.toFixed(2).replace('.', ',')}
            </label>
            <label>
                <input type="radio" name="frete" value="${muitoRapido}">
                Muito Rápido - R$ ${muitoRapido.toFixed(2).replace('.', ',')}
            </label>
        `;
        freteOpcoes.style.display = 'block';

        document.querySelectorAll('input[name="frete"]').forEach(radio => {
            radio.addEventListener('change', function() {
                freteSelecionado = parseFloat(this.value);
                atualizarResumo();
                finalizarPedidoBtn.disabled = false; // Habilita o botão quando um frete é selecionado
                finalizarPedidoBtn.classList.remove('botao-desabilitado');
                finalizarPedidoBtn.classList.add('botao-habilitado'); // Muda a cor do botão para vermelho
            });
        });
    }

    function gerarValorFrete() {
        return Math.random() * (50 - 20) + 20;
    }

  
    

    displayProducts();
    
});
