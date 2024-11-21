document.addEventListener('DOMContentLoaded', function() {
    const enderecos = [
        'Rua A, 123',
        'Rua B, 456',
        'Rua C, 789'
    ];

    const comboEnderecos = document.getElementById('combo-enderecos');

    enderecos.forEach(function(endereco) {
        const option = document.createElement('option');
        option.textContent = endereco;
        comboEnderecos.appendChild(option);
    });
});

function adicionarEndereco() {
    // Lógica para adicionar um novo endereço
    alert('Adicionar Endereço');
}

function avancar() {
    // Lógica para avançar
    alert('Avançar');
}

function voltar() {
    // Lógica para voltar
    alert('Voltar');
}