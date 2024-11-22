document.addEventListener('DOMContentLoaded', function () {
    buscarPedidoPorId();

    async function buscarPedidoPorId() {
        const urlParams = new URLSearchParams(window.location.search);
        const pedidoId = urlParams.get('pedidoId');
        const url = `http://localhost:8015/pedido/${pedidoId}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                alert("Erro ao buscar detalhes do pedido");
                return;
            }

            const pedido = await response.json();
            console.log(pedido);
            pegardetalhes(pedido);
        } catch (error) {
            console.log(error);
        }
    }

    function pegardetalhes(pedido) {
        // Dados do usuário
        document.getElementById('nome').textContent = pedido.idUser.usuaNmUsuario;
        document.getElementById('email').textContent = pedido.idUser.usuaDsEmail;
        
        // Endereço de entrega
        const endereco = pedido.fkEndereco;
        document.getElementById('endereco-entrega').textContent = 
            `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}`;
        
        // Dados adicionais
        document.getElementById('cpf').textContent = pedido.idUser.usuaDsCPF;
        document.getElementById('total').textContent = pedido.valorTotal.toFixed(2);
        
  
       document.getElementById('frete-total').textContent =  pedido.valorFrete.toFixed(2);

        // Exibir informações do produto
        const conteudoResumo = document.getElementById('conteudo-resumo');
        conteudoResumo.innerHTML = '';

        // Neste caso, parece que há apenas um produto no pedido
        const produtoElement = document.createElement('p');
        produtoElement.textContent = `Nome: ${pedido.nomeProduto}, Preço: R$ ${pedido.valorUnitario.toFixed(2)}`;
        conteudoResumo.appendChild(produtoElement);

        // Forma de pagamento
        const formaPagamentoElement = document.getElementById('forma-pagamento');
        const formaPagamento = pedido.formaDePagamento;        
        formaPagamentoElement.textContent = formaPagamento ? formaPagamento : "Forma de pagamento não selecionada.";
    }


    
});

function saveStatus() {
    const numeroPedido = document.getElementById('idProduto').value;  // Obtém o numeroPedido do campo oculto
    const selectedStatus = document.querySelector('input[name="statusPedido"]:checked').value;  // Status selecionado

    const product = products.find(p => p.numeroPedido == numeroPedido);  // Busca o produto pelo numeroPedido
    if (product) {
        // Atualiza o status do produto
        product.statusPedido = selectedStatus;
        
        // Aqui, você pode fazer uma chamada para a API para atualizar o status no backend, se necessário
        // Por exemplo, pode ser algo como:
        // fetch(`http://localhost:8015/produto/${numeroPedido}/alterarStatus`, { method: 'PUT', body: JSON.stringify({ statusPedido: selectedStatus }) })

        // Fecha o modal e atualiza a tabela
        closeEditModal();
        displayProducts();
        alert('Status atualizado com sucesso!');
    } else {
        alert('Erro ao atualizar status.');
    }
}