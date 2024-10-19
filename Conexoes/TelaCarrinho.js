document.addEventListener('DOMContentLoaded', function() {
    let products = JSON.parse(localStorage.getItem('produtos')) || [];

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

    displayProducts();
    atualizarResumo();

    // Função para validar CEP e calcular frete
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
