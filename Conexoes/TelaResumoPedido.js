

document.addEventListener('DOMContentLoaded', function() {
    const conteudoResumo = document.getElementById('conteudo-resumo');
    const totalElement = document.getElementById('total');
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let total = 0;

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.className = 'produto';
        produtoDiv.innerHTML = `
            <img src="${produto.imagem}" alt="Imagem do produto">
            <div class="detalhes-produto">
                <p>Nome: <span>${produto.nome}</span></p>
                <p>Preço: R$${produto.preco.toFixed(2)}</p>
                <p>Quantidade: ${produto.quantidade}</p>
                <p>Total: R$${produto.total.toFixed(2)}</p>
            </div>
        `;
        conteudoResumo.appendChild(produtoDiv);
        total += produto.total;
    });

    totalElement.textContent = total.toFixed(2);
});


