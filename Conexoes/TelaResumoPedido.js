document.addEventListener('DOMContentLoaded', function () {

    // Obtém os dados do usuário logado
    let user = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    const conteudoResumo = document.getElementById('conteudo-resumo');
    const totalElement = document.getElementById('total');
    const freteTotalElement = document.getElementById('frete-total');
    const nomeElement = document.getElementById('nome');
    const emailElement = document.getElementById('email');
    const enderecoEntregaElement = document.getElementById('endereco-entrega');
    const cpfElement = document.getElementById('cpf');
    const formaPagamentoElement = document.getElementById('forma-pagamento'); // Adiciona o elemento da forma de pagamento

    let total = 0;  // Variável para armazenar o total dos produtos
    let frete = 0;  // Variável para armazenar o valor do frete

    // Preenche os dados do usuário
    nomeElement.textContent = user.usuaNmUsuario;
    emailElement.textContent = user.usuaDsEmail;

    // Verifica se há endereço de entrega selecionado
    const enderecoEntrega = JSON.parse(sessionStorage.getItem("enderecoPrincipal"));
    if (enderecoEntrega) {
        enderecoEntregaElement.textContent = `${enderecoEntrega.logradouro}, ${enderecoEntrega.numero}, ${enderecoEntrega.bairro}, ${enderecoEntrega.cidade}, ${enderecoEntrega.uf}, ${enderecoEntrega.cep}`;
    } else {
        enderecoEntregaElement.textContent = "Endereço de entrega não selecionado.";
    }

    // Preenche o CPF
    cpfElement.textContent = user.usuaDsCPF;

    // Exibe os produtos no resumo
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.className = 'produto';

        // Calcula o total do produto (preço * quantidade)
        const totalProduto = parseFloat(produto.preco) * produto.quantidade;

        // Exibe as informações do produto
        produtoDiv.innerHTML = `
            <img src="${produto.imagem}" alt="Imagem do produto">
            <div class="detalhes-produto">
                <p>Nome: <span>${produto.nome}</span></p>
                <p>Preço: R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                <p>Quantidade: ${produto.quantidade}</p>
                <p>Total: R$ ${totalProduto.toFixed(2)}</p>
            </div>
        `;
        conteudoResumo.appendChild(produtoDiv);

        // Soma o total dos produtos
        total += totalProduto;
    });

    // Verifica se há um valor de frete selecionado (substitua isso pelo valor real do frete)
    const freteSelecionado = sessionStorage.getItem("freteSelecionado") || 0;  // Exemplo, pegue o valor de onde ele foi armazenado
    frete = parseFloat(freteSelecionado) || 0;  // Caso não tenha valor, assume 0

    // Atualiza o total do frete
    freteTotalElement.textContent = `R$ ${frete.toFixed(2)}`;

    // Calcula o total final (produtos + frete)
    const totalFinal = total + frete;
    totalElement.textContent = `R$ ${totalFinal.toFixed(2)}`;

    // Função para finalizar o pedido
    window.finalizarPedido = async function () {
        // Chama a função para finalizar o pedido e aguarda a resposta
        let pedidoResponse = await finalizarPedido();

        if (pedidoResponse.ok) {
            let resposta = await pedidoResponse.json();
            alert("Pedido finalizado com sucesso!");
            console.log(resposta);
            const pedido = resposta[0];
            console.log(pedido)
            alert("esse é o seu numero de pedido "+pedido.numeroPedido)
            window.location.href = "MeusPedidos.html";
        } else {
            alert("Erro ao finalizar pedido!");
        }

    };

    async function finalizarPedido() {
        const freteSelecionado = sessionStorage.getItem("freteSelecionado") || 0;  // Exemplo, pegue o valor de onde ele foi armazenado
        frete = parseFloat(freteSelecionado) || 0; 
     
        const produtos = JSON.parse(sessionStorage.getItem('produtos'));  

    
        const produtosEnviados = produtos.map(produto => ({
            nomeProduto: produto.nome,
            precoProduto: produto.preco,
            qtdEstoqueProduto: produto.quantidade
        }));

        // Envia o pedido para o backend
        const enderecoEntrega = JSON.parse(sessionStorage.getItem("enderecoPrincipal"));
        const endereco = enderecoEntrega.id;


        let pedidoResponse = await fetch(`http://localhost:8015/pedido/${user.idUsuario}?frete=${frete}&endereco=${endereco}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtosEnviados)  // Envia o array de produtos com os campos corretos
        });

        return pedidoResponse;

    }




    const formaPagamento = sessionStorage.getItem('formaPagamento'); // Recupera a forma de pagamento do sessionStorage
    if (formaPagamento) {
        formaPagamentoElement.textContent = formaPagamento; // Exibe a forma de pagamento
    } else {
        formaPagamentoElement.textContent = "Forma de pagamento não selecionada."; // Caso não tenha forma de pagamento
    }
  
    window.voltar = function () {
        window.history.back();
    };
});
