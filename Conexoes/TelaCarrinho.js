document.addEventListener('DOMContentLoaded', function() {
    let products = JSON.parse(localStorage.getItem('produtos')) || [];
    let enderecoPrincipal = JSON.parse(sessionStorage.getItem('enderecoPrincipal')) || null;

    const itemsPerPage = 10;
    let currentPage = 1;

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
        product.total = `R$ ${total.toFixed(2).replace('.', ',')}`;
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
        const valorTotal = products.reduce((acc, product) => acc + (parseFloat(product.preco) * product.quantidade), 0);
        document.getElementById('resumo-valor').textContent = `Valor dos Produtos: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }

    function displayEnderecoPrincipal() {
        if (enderecoPrincipal) {
            const enderecoContainer = document.getElementById('endereco-principal');
            enderecoContainer.innerHTML = `
                <p><strong>Endereço Principal:</strong></p>
                <p>${enderecoPrincipal.logradouro}, ${enderecoPrincipal.numero}, ${enderecoPrincipal.complemento}, ${enderecoPrincipal.bairro}, ${enderecoPrincipal.cidade}, ${enderecoPrincipal.uf}, ${enderecoPrincipal.cep}</p>
            `;
        }
    }

    document.getElementById('addEndereco').addEventListener('click', function() {
        const novoEndereco = document.createElement('div');
        novoEndereco.className = 'endereco novo-endereco'; 
        novoEndereco.id = 'novo-endereco-form';
    
        novoEndereco.innerHTML = `
            <input type="text" placeholder="Digite o CEP" class="cep" required>
            <input type="text" class="logradouro" placeholder="Logradouro" disabled>
            <input type="text" class="numero" placeholder="Número" required>
            <input type="text" class="complemento" placeholder="Complemento">
            <input type="text" class="bairro" placeholder="Bairro" disabled>
            <input type="text" class="cidade" placeholder="Cidade" disabled>
            <input type="text" class="uf" placeholder="UF" disabled>
            <button type="button" id="salvarEndereco">Salvar novo Endereço</button>
        `;
    
        const resumoCard = document.getElementById('resumo-card');
        const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
        resumoCard.insertBefore(novoEndereco, finalizarPedidoBtn);
    
        const cepInput = novoEndereco.querySelector('.cep');
        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length === 8) {
                buscarEnderecoFaturamento(cep, novoEndereco);
            } else {
                alert("CEP deve ter 8 dígitos.");
            }
        });

        document.getElementById('salvarEndereco').addEventListener('click', function() {
            const endereco = {
                cep: novoEndereco.querySelector('.cep').value,
                logradouro: novoEndereco.querySelector('.logradouro').value,
                numero: novoEndereco.querySelector('.numero').value,
                complemento: novoEndereco.querySelector('.complemento').value,
                bairro: novoEndereco.querySelector('.bairro').value,
                cidade: novoEndereco.querySelector('.cidade').value,
                uf: novoEndereco.querySelector('.uf').value,
                enderecoPrincipal: true,
                grupo: "envio"
            };

            sessionStorage.setItem('enderecoPrincipal', JSON.stringify(endereco));

            resumoCard.removeChild(novoEndereco);

            displayEnderecoPrincipal();
        });
    });

    async function buscarEnderecoFaturamento(cep, enderecoDiv) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                alert("CEP inválido");
                return;
            }
            enderecoDiv.querySelector('.logradouro').value = data.logradouro;
            enderecoDiv.querySelector('.bairro').value = data.bairro;
            enderecoDiv.querySelector('.cidade').value = data.localidade;
            enderecoDiv.querySelector('.uf').value = data.uf;
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            alert("Erro ao buscar endereço. Tente novamente.");
        }
    }

    displayProducts();
    atualizarResumo();
    displayEnderecoPrincipal();

    document.getElementById("validarCep").addEventListener("click", function () {
        const cep = document.getElementById("cep").value;
        const primeiroQuantil = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA"];
        const segundoQuantil = ["MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS"];
        const terceiroQuantil = ["RO", "RR", "SC", "SP", "SE", "TO"];

        if (cep.length !== 8 || isNaN(cep)) {
            alert("CEP inválido. Digite um CEP válido com 8 dígitos numéricos.");
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(dados => {
            if (dados.erro) {
                alert("CEP inválido.");
                return;
            }

            let frete = 0;
            if (primeiroQuantil.includes(dados.uf)) {
                frete = 35;
            } else if (segundoQuantil.includes(dados.uf)) {
                frete = 25;
            } else if (terceiroQuantil.includes(dados.uf)) {
                frete = 15;
            } else {
                document.getElementById("frete-resultado").innerHTML = "UF não está na tabela de preços.";
                return;
            }

            const valorTotalProdutos = products.reduce((acc, product) => acc + (parseFloat(product.preco) * product.quantidade), 0);
            const valorTotalCompra = valorTotalProdutos + frete;

            document.getElementById("frete-resultado").innerHTML = `
                <p>Frete: R$ ${frete.toFixed(2).replace('.', ',')}</p>
                <p><strong>Valor Total da Compra: R$ ${valorTotalCompra.toFixed(2).replace('.', ',')}</strong></p>
            `;
        })
        .catch(error => {
            alert("Erro ao buscar o CEP: " + cep);
        });
    });
});