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
            pegardetalhes(pedido);
        } catch (error) {
            console.log(error);
        }
    }

    function pegardetalhes(pedido) {
        document.getElementById('nome').textContent = pedido.nomeCliente;
        document.getElementById('email').textContent = pedido.emailCliente;
        document.getElementById('endereco-entrega').textContent = pedido.enderecoEntrega;
        document.getElementById('cpf').textContent = pedido.cpfCliente;
        document.getElementById('total').textContent = pedido.valorTotal.toFixed(2);
        document.getElementById('frete-total').textContent = pedido.valorFrete.toFixed(2);

        const conteudoResumo = document.getElementById('conteudo-resumo');
        conteudoResumo.innerHTML = '';

        pedido.produtos.forEach(produto => {
            const produtoElement = document.createElement('p');
            produtoElement.textContent = `Nome: ${produto.nome}, Preço: R$ ${produto.preco.toFixed(2)}, Quantidade: ${produto.quantidade}`;
            conteudoResumo.appendChild(produtoElement);
        });

        const formaPagamentoElement = document.getElementById('forma-pagamento');
        const formaPagamento = sessionStorage.getItem('formaPagamento');
        if (formaPagamento) {
            formaPagamentoElement.textContent = formaPagamento;
        } else {
            formaPagamentoElement.textContent = "Forma de pagamento não selecionada.";
        }
    }
});