function pagarPix() {
    alert("Pagamento via Pix iniciado.");
    substituirBotaoPorTexto('Pix');
    sessionStorage.setItem('formaPagamento', 'Pix'); // Armazenar forma de pagamento no sessionStorage
    mostrarBotaoFinalizar();
}

function pagarBoleto() {
    alert("Boleto gerado.");
    substituirBotaoPorTexto('Boleto');
    sessionStorage.setItem('formaPagamento', 'Boleto'); // Armazenar forma de pagamento no sessionStorage
    mostrarBotaoFinalizar();
}

document.getElementById('cartaoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert("Pagamento com cartão de crédito iniciado.");
    mostrarParcelas();
    substituirBotaoPorTexto('Cartão de Crédito');
    sessionStorage.setItem('formaPagamento', 'Cartão de Crédito'); // Armazenar forma de pagamento no sessionStorage
    mostrarBotaoFinalizar();
});

function substituirBotaoPorTexto(formaPagamento) {
    const botoes = document.querySelectorAll('section button');
    botoes.forEach(botao => botao.style.display = 'none');

    const textos = document.querySelectorAll('section .forma-selecionada');
    textos.forEach(texto => texto.remove());

    const textoFormaPagamento = document.createElement('p');
    textoFormaPagamento.className = 'forma-selecionada';
    textoFormaPagamento.textContent = `Forma de pagamento selecionada: ${formaPagamento}`;
    document.querySelector('section').appendChild(textoFormaPagamento);

    const botaoAlterar = document.createElement('button');
    botaoAlterar.textContent = 'Alterar forma de pagamento';
    botaoAlterar.style.marginRight = '10px'; 
    botaoAlterar.onclick = function() {
        botoes.forEach(botao => botao.style.display = 'inline-block');
        textoFormaPagamento.remove();
        botaoAlterar.remove();
        const parcelas = document.getElementById('parcelas');
        if (parcelas) {
            parcelas.remove();
            document.querySelector('label[for="parcelas"]').remove();
        }
        const finalizarCompra = document.getElementById('finalizarCompra');
        if (finalizarCompra) {
            finalizarCompra.remove();
        }
    };
    document.querySelector('section').appendChild(botaoAlterar);

    mostrarBotaoFinalizar(botaoAlterar);
}

function mostrarBotaoFinalizar(botaoAlterar) {
    if (!document.getElementById('finalizarCompra')) {
        const botaoFinalizar = document.createElement('button');
        botaoFinalizar.id = 'finalizarCompra';
        botaoFinalizar.textContent = 'Finalizar compra';
        botaoFinalizar.onclick = function() {
            window.location.href = 'TelaResumoPedido.html'; 
        };
        botaoAlterar.insertAdjacentElement('afterend', botaoFinalizar);
    }
}

function mostrarParcelas() {
    if (!document.getElementById('parcelas')) {
        const labelParcelas = document.createElement('label');
        labelParcelas.for = 'parcelas';
        labelParcelas.textContent = 'Quantidade de parcelas:';
        
        const selectParcelas = document.createElement('select');
        selectParcelas.id = 'parcelas';
        selectParcelas.name = 'parcelas';
        
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + 'x';
            selectParcelas.appendChild(option);
        }
        
        const cartaoForm = document.getElementById('cartaoForm');
        cartaoForm.appendChild(labelParcelas);
        cartaoForm.appendChild(selectParcelas);
    }
}
