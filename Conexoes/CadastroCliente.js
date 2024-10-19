const form = document.getElementById('cadastro');
let enderecosParaOback = [];

// Listener para adicionar um novo endereço
document.getElementById('addEndereco').addEventListener('click', function() {
    const novoEndereco = document.createElement('div');
    novoEndereco.className = 'endereco novo-endereco'; 

    novoEndereco.innerHTML = `
        <label for="cep">CEP</label>
        <input type="text" placeholder="Digite o CEP" class="cep">
        
        <label for="logradouro">Logradouro</label>
        <input type="text" class="logradouro" disabled>

        <label for="numero">Número</label>
        <input type="text" class="numero">

        <label for="complemento">Complemento</label>
        <input type="text" class="complemento">

        <label for="bairro">Bairro</label>
        <input type="text" class="bairro" disabled>

        <label for="cidade">Cidade</label>
        <input type="text" class="cidade" disabled>

        <label for="uf">UF</label>
        <input type="text" class="uf" disabled>

        <label>
            <input type="radio" name="enderecoPrincipal" value="0"> Principal
        </label>
    `;

    document.getElementById('enderecos-container').appendChild(novoEndereco);
});

// Listener para o envio do formulário
form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    let cpf = document.getElementById("cpf").value;
    let genero = document.getElementById("genero").value;
    let dataNascimento = document.getElementById("dataNascimento").value;
    let grupo = "usuario"; 

    // Captura os endereços
    enderecosParaOback = Array.from(document.querySelectorAll('.novo-endereco')).map((endereco) => {
        return {
            cep: endereco.querySelector('.cep').value,
            logradouro: endereco.querySelector('.logradouro').value,
            numero: endereco.querySelector('.numero').value,
            complemento: endereco.querySelector('.complemento').value,
            bairro: endereco.querySelector('.bairro').value,
            cidade: endereco.querySelector('.cidade').value,
            uf: endereco.querySelector('.uf').value,
            principal: endereco.querySelector(`input[name="enderecoPrincipal"]`).checked
        };
    });

    console.log("Endereços capturados:", enderecosParaOback); // Debugging

    // Verifica se há mais de um endereço marcado como principal
    const principalCount = enderecosParaOback.filter(endereco => endereco.principal).length;
    if (principalCount > 1) {
        alert("Apenas um endereço pode ser marcado como principal.");
        return;
    }

    const dadosUsuario = {
        usuaNmUsuario: nome,
        usuaDsEmail: email,
        usuaDsPassword: senha,
        usuaDsCPF: cpf,
        usuaCdGrupo: grupo,
        usuaGenero: genero,
        usuaDataNascimento: dataNascimento
    };

    // Chamada para criar o usuário
    fetch('http://localhost:8015/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosUsuario)
    })
    .then(response => {
        if (!response.ok) {
            throw response;
        }
        return response.json();
    })
    .then(data => {
        const id = data.idUsuario; // Aqui você pega o ID
        console.log("ID do usuário:", id);
        console.log("Endereços para enviar:", enderecosParaOback);
        return addBanco(id, enderecosParaOback); // Chama a função para adicionar os endereços
    })
    .then(() => {
        // Redireciona após salvar os endereços
        window.location.href = 'Telainicial.html'; 
    })
    .catch(error => {
        if (error && error.status === 409) {
            error.json().then(errData => {
                alert(errData.message); 
            });
        } else {
            console.log("Erro de cadastro:", error); 
        }
    });
});

// Função para adicionar endereços ao banco
async function addBanco(id, enderecosParaOback) {
    const url = `http://localhost:8015/Endereco/${id}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enderecosParaOback)
        });
        if (!response.ok) {
            alert("Erro ao cadastrar endereços");
        }
    } catch (error) {
        console.log("Erro no add:", error);
    }
}
