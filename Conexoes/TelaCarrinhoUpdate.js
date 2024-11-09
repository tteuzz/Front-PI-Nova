
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
    finalizarPedidoBtn.disabled = true; // Desabilita o botão inicialmente
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
        const valorTotal = valorTotalProdutos + freteSelecionado;
        document.getElementById('resumo-valor').textContent = `Valor dos Produtos: R$ ${valorTotalProdutos.toFixed(2).replace('.', ',')}`;
        document.getElementById('resumo-total').textContent = `Valor Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }

    // Função para listar os endereços do usuário
    async function listarEndereco() {
        let user = JSON.parse(sessionStorage.getItem("usuarioLogado"));
        const url = `http://localhost:8015/Endereco/ListarEndereco/${user.idUsuario}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Não foi possível listar os endereços.");
            const enderecos = await response.json();
            const addressContainer = document.getElementById('added-addresses-container');
            addressContainer.innerHTML = '';
            enderecos.forEach(endereco => {
                const addressItem = document.createElement('div');
                addressItem.className = 'address-item';
                addressItem.id = `address-item-${endereco.id}`;
                addressItem.innerHTML = `
                    <div>
                        <p>${endereco.logradouro}, ${endereco.numero}, ${endereco.complemento}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.uf}, ${endereco.cep}</p>
                        <button class="button" onclick="definirEnderecoPrincipal(${endereco.id})">ENVIAR PARA ESSE ENDERECO</button>
                        <span class="default-label">${endereco.enderecoPrincipal ? 'Endereço Padrão' : ''}</span>
                        <span class="billing-label">${endereco.grupo === 'faturamento' ? 'Endereço de Faturamento' : ''}</span>
                    </div>
                `;
                addressContainer.appendChild(addressItem);
            });
        } catch (error) {
            console.error(error);
            alert("Erro ao listar endereços: " + error.message);
        }
    }

    // Função para definir o endereço principal
    window.definirEnderecoPrincipal = async function(idEndereco) {
        let user = JSON.parse(sessionStorage.getItem("usuarioLogado"));
        const url = `http://localhost:8015/Endereco/ListarEndereco/${user.idUsuario}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Não foi possível listar os endereços.");
            const enderecos = await response.json();
            const endereco = enderecos.find(end => end.id === idEndereco);
            if (!endereco) {
                alert("Endereço não encontrado.");
                return;
            }

            // Salva o endereço principal no sessionStorage
            sessionStorage.setItem('enderecoPrincipal', JSON.stringify(endereco));
            displayEnderecoPrincipal(endereco);
            exibirFretesDisponiveis(endereco.cep);

            alert("Endereço de entrega definido.");

            // Atualiza a interface
            const addressItems = document.querySelectorAll('.address-item');
            addressItems.forEach(item => {
                const defaultLabel = item.querySelector('.default-label');
                const button = item.querySelector('button');
                if (defaultLabel) defaultLabel.textContent = '';
                if (button) button.style.display = 'block';
            });

            // Marca o endereço selecionado como "endereço principal"
            const addressItem = document.getElementById(`address-item-${idEndereco}`);
            const defaultLabel = addressItem.querySelector('.default-label');
            const button = addressItem.querySelector('button');
            if (defaultLabel) defaultLabel.textContent = 'Endereço De Entrega';
            if (button) button.style.display = 'none';

        } catch (error) {
            console.error(error);
            alert("Erro ao definir o endereço: " + error.message);
        }
    };

    // Função para exibir o endereço principal
    function displayEnderecoPrincipal(endereco) {
        const enderecoContainer = document.getElementById('endereco-principal');
        enderecoContainer.innerHTML = `
            <p><strong>Endereço Principal:</strong></p>
            <p>${endereco.logradouro}, ${endereco.numero}, ${endereco.complemento}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.uf}, ${endereco.cep}</p>
        `;
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
        return Math.random() * (30 - 10) + 10; // Gera um valor entre 10 e 30
    }

    // Função para finalizar o pedido
    function finalizar() {
        // Salva os produtos no sessionStorage
        sessionStorage.setItem('produtos', JSON.stringify(products));
        window.location.href = 'Pagamentos.html'; 
      
    }

    
    // Inicialização
    displayProducts();
    listarEndereco();

    
    const addEnderecoBtn = document.getElementById('addEndereco');
    if (addEnderecoBtn) {
        addEnderecoBtn.addEventListener('click', function() {
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
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.erro) {
                                novoEndereco.querySelector('.logradouro').value = data.logradouro;
                                novoEndereco.querySelector('.bairro').value = data.bairro;
                                novoEndereco.querySelector('.cidade').value = data.localidade;
                                novoEndereco.querySelector('.uf').value = data.uf;
                                novoEndereco.querySelector('.logradouro').disabled = false;
                                novoEndereco.querySelector('.bairro').disabled = false;
                                novoEndereco.querySelector('.cidade').disabled = false;
                                novoEndereco.querySelector('.uf').disabled = false;
                            } else {
                                alert('CEP não encontrado');
                            }
                        });
                } else {
                    alert('CEP inválido');
                }
            });

            const salvarEnderecoBtn = novoEndereco.querySelector('#salvarEndereco');
            salvarEnderecoBtn.addEventListener('click', function() {
                const cep = novoEndereco.querySelector('.cep').value;
                const logradouro = novoEndereco.querySelector('.logradouro').value;
                const numero = novoEndereco.querySelector('.numero').value;
                const complemento = novoEndereco.querySelector('.complemento').value;
                const bairro = novoEndereco.querySelector('.bairro').value;
                const cidade = novoEndereco.querySelector('.cidade').value;
                const uf = novoEndereco.querySelector('.uf').value;

                const endereco = {
                    cep: cep,
                    logradouro: logradouro,
                    numero: numero,
                    complemento: complemento,
                    bairro: bairro,
                    cidade: cidade,
                    uf: uf,
                    enderecoPrincipal: false,
                    grupo: "envio",
                };

                cadastrarNovoEndereco(endereco)
                //displayEnderecoPrincipal();
                alert("Endereço salvo com sucesso!");
          
            });
        });
    }

    async function cadastrarNovoEndereco(endereco) {
        let user = sessionStorage.getItem("usuarioLogado");
        user = JSON.parse(user);
    
        const url = `http://localhost:8015/Endereco/adicionarMaisUm/${user.idUsuario}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(endereco)
            });
            if (!response.ok) {
                alert("Erro ao cadastrar endereços");
                return;
            }
            alert("Endereço adicionado com sucesso");
            
        } catch (error) {
            console.log("Erro no add:", error);
        }
    }

    finalizarPedidoBtn.addEventListener('click', finalizar);
});
