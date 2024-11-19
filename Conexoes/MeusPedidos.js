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

document.addEventListener('DOMContentLoaded', function () {
    listarPedidos()
    
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
    
    async function listarPedidos() {
        let user = sessionStorage.getItem("usuarioLogado");
        user = JSON.parse(user)
        const url = `http://localhost:8015/pedido/listById/${user.idUsuario}`;
        
        try{
            const response = await fetch(url)
            if(!response.ok){
                alert("erro ao listar pedidos, possa ser que você não tenha pedidos ainda")
                return
            }
            
            const pedidos = await response.json();
            renderizarPedidos(pedidos)
        }catch(error){
            console.log(error)
        }
    }

    function renderizarPedidos(pedidos) {
        const tabela = document.querySelector('.tabela tbody');
        tabela.innerHTML = '';

        pedidos.forEach(pedido => {
            const tr = document.createElement('tr');

            // Número do Pedido
            const tdNumero = document.createElement('td');
            tdNumero.textContent = pedido.numeroPedido;
            tr.appendChild(tdNumero);

            // Data do Pedido
            const tdData = document.createElement('td');
            tdData.textContent = new Date(pedido.dataPedido).toLocaleDateString('pt-BR');
            tr.appendChild(tdData);

            // Valor Total
            const tdValor = document.createElement('td');
            tdValor.textContent = `R$ ${pedido.valorTotal.toFixed(2)}`;
            tr.appendChild(tdValor);

            // Status do Pedido
            const tdStatus = document.createElement('td');
            tdStatus.textContent = pedido.statusPedido;
            tr.appendChild(tdStatus);

            // Ações (exemplo de botão "Ver Detalhes")
            const tdAcoes = document.createElement('td');
            const botaoDetalhes = document.createElement('button');
            botaoDetalhes.textContent = 'Ver Detalhes';
            botaoDetalhes.addEventListener('click', () => {
                window.location.href = `DetalhesPedido.html?pedidoId=${pedido.idPedido}`;
            });
            tdAcoes.appendChild(botaoDetalhes);
            tr.appendChild(tdAcoes);

            // Adiciona a linha à tabela
            tabela.appendChild(tr);
        });
    }
});