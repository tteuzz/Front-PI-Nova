
function verPerfil(){
    window.location.href = "TelaPerfil.html";
}

function verPedidos(){
    window.location.href = "MeusPedidos.html";
}

function logout() {
    alert("Você saiu da sessão");
    sessionStorage.clear();
    window.location.href = 'Telainicial.html';
}




document.addEventListener('DOMContentLoaded', function() {
    let products = JSON.parse(localStorage.getItem('produtos')) || [];
    let freteSelecionado = 0;

    const itemsPerPage = 10;
    let currentPage = 1;

    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    finalizarPedidoBtn.disabled = true; 
    finalizarPedidoBtn.classList.add('botao-desabilitado'); // Adiciona a classe de botão desabilitado



    const icone = document.querySelector('.icone');
    const cardLoginCadastro = document.getElementById('card-login-cadastro');
    const userLogado = sessionStorage.getItem("usuarioLogado")
    icone.addEventListener('click', (event) => {
        event.stopPropagation(); 
        if (cardLoginCadastro.style.display === 'none' || cardLoginCadastro.style.display === '') {
            if(userLogado != null){
                cardLoginCadastro.innerHTML = `
                <button onclick="verPerfil()">Ver Perfil</button>
                <button onclick="verPedidos()">Ver pedidos</button>
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




    // Função para exibir os produtos
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

    // Função para aumentar a quantidade de um produto
    function increaseQuantity(index) {
        products[index].quantidade += 1;
        updateProductTotal(index);
        updateLocalStorageAndDisplay();
    }

    // Função para diminuir a quantidade de um produto
    function decreaseQuantity(index) {
        if (products[index].quantidade > 1) {
            products[index].quantidade -= 1;
            updateProductTotal(index);
            updateLocalStorageAndDisplay();
        }
    }

    // Atualiza o total do produto
    function updateProductTotal(index) {
        const product = products[index];
        const total = parseFloat(product.preco) * product.quantidade;
        product.total = total;
    }

    // Remove um produto
    function removeProduct(index) {
        products.splice(index, 1); 
        updateLocalStorageAndDisplay();
    }

    // Atualiza o localStorage e re-renderiza os produtos
    function updateLocalStorageAndDisplay() {
        localStorage.setItem('produtos', JSON.stringify(products));
        displayProducts();
        atualizarResumo();
    }

    // Atualiza o resumo de valores (produtos + frete)
    function atualizarResumo() {
        const valorTotalProdutos = products.reduce((acc, product) => acc + (parseFloat(product.preco) * product.quantidade), 0);
        freteSelecionado = parseFloat(sessionStorage.getItem('freteSelecionado')) || 0;
        const valorTotal = valorTotalProdutos + freteSelecionado;
        document.getElementById('resumo-valor').textContent = `Valor dos Produtos: R$ ${valorTotalProdutos.toFixed(2).replace('.', ',')}`;
        document.getElementById('resumo-total').textContent = `Valor Total (com frete): R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }


    // Função para exibir as opções de frete disponíveis
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
    
        // Adiciona o evento de mudança para quando o usuário selecionar um frete
        document.querySelectorAll('input[name="frete"]').forEach(radio => {
            radio.addEventListener('change', function() {
                // Armazena o valor selecionado no sessionStorage
                const freteSelecionado = parseFloat(this.value);
                sessionStorage.setItem('freteSelecionado', freteSelecionado.toFixed(2));  // Salva com 2 casas decimais
    
                // Atualiza o resumo de valores
                atualizarResumo();
    
                // Habilita o botão de finalizar pedido
                finalizarPedidoBtn.disabled = false;
                finalizarPedidoBtn.classList.remove('botao-desabilitado');
                finalizarPedidoBtn.classList.add('botao-ativado');
            });
        });
    }
    

    // Função para gerar valores fictícios de frete
    function gerarValorFrete() {
        return Math.random() * (30 - 10) + 10; 
    }

    const finalizarBtn = document.getElementById('finalizar-pedido');
    const modal = document.getElementById('modal-verificacao');
    const fecharModal = document.getElementById('fechar-modal');
    const simBtn = document.getElementById('sim-conta');
    const naoBtn = document.getElementById('nao-conta');

    finalizarBtn.addEventListener('click', function() {
        const userLogado = sessionStorage.getItem("usuarioLogado")
        if (!userLogado) {
            modal.style.display = 'block';
            console.log(products)
            console.log(sessionStorage.getItem("freteSelecionado"))
        } else {
            sessionStorage.setItem('produtos', JSON.stringify(products));
            window.location.href = 'Endereco.html'; 
        }
    });

    fecharModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    simBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        alert("Ótimo! você será redirecionado para a tela de login.");
        window.location.href = "Telainicial.html";
    });

    naoBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        alert("Você será redirecionado para a tela de cadastro de usuário.");
        window.location.href = "TelaCadastroUsuario.html"; 
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

          


    const addEnderecoBtn = document.getElementById('addEndereco');
    if (addEnderecoBtn) {
        addEnderecoBtn.addEventListener('click', function() {
            const novoEndereco = document.createElement('div');
            novoEndereco.className = 'endereco novo-endereco'; 
            novoEndereco.id = 'novo-endereco-form';

            novoEndereco.innerHTML = `
                <input type="text" placeholder="Digite o CEP" class="cep" required>
                <button type="button" id="salvarEndereco">ENVIAR CEP PARA CALCULO</button>
            `;

            const resumoCard = document.getElementById('resumo-card');
            const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
            resumoCard.insertBefore(novoEndereco, finalizarPedidoBtn);

 
            const salvarEnderecoBtn = novoEndereco.querySelector('#salvarEndereco');
            salvarEnderecoBtn.addEventListener('click', function() {
            exibirFretesDisponiveis(20903232)  
            });
        });
    }
    
    // Inicialização
    displayProducts();
    atualizarResumo();
    
});
