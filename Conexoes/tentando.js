//comentando pra main
document.addEventListener('DOMContentLoaded', (event) => {
    const formCadastrarUser = document.getElementById('cadastro');

    if (formCadastrarUser) {
        formCadastrarUser.addEventListener('submit', handleSubmit);
    }

    // Listener para o CEP do endereço de faturamento
    const cepFaturamentoInput = document.getElementById("cep-faturamento");
    cepFaturamentoInput.addEventListener('blur', () => {
        const cep = cepFaturamentoInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            buscarEnderecoFaturamento(cep, 'faturamento');
        } else {
            alert("CEP deve ter 8 dígitos.");
        }
    });

    // Listener para adicionar um novo endereço
    document.getElementById('addEndereco').addEventListener('click', function() {
        const novoEndereco = document.createElement('div');
        novoEndereco.className = 'endereco novo-endereco'; 

        novoEndereco.innerHTML = `
            <label for="cep">CEP</label>
            <input type="text" placeholder="Digite o CEP" class="cep" required>

            <label for="logradouro">Logradouro</label>
            <input type="text" class="logradouro" disabled>

            <label for="numero">Número</label>
            <input type="text" class="numero" required>

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

        // Adicionando listener para o campo de CEP
        const cepInput = novoEndereco.querySelector('.cep');
        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length === 8) {
                buscarEnderecoFaturamento(cep, novoEndereco);
            } else {
                alert("CEP deve ter 8 dígitos.");
            }
        });
    });

    async function buscarEnderecoFaturamento(cep, enderecoDiv) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                alert("CEP inválido");
                return;
            }
            // Preenchendo os campos de endereço
            if (enderecoDiv === 'faturamento') {
                document.getElementById('logradouro-faturamento').value = data.logradouro;
                document.getElementById('bairro-faturamento').value = data.bairro;
                document.getElementById('cidade-faturamento').value = data.localidade;
                document.getElementById('uf-faturamento').value = data.uf;
            } else {
                enderecoDiv.querySelector('.logradouro').value = data.logradouro;
                enderecoDiv.querySelector('.bairro').value = data.bairro;
                enderecoDiv.querySelector('.cidade').value = data.localidade;
                enderecoDiv.querySelector('.uf').value = data.uf;
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            alert("Erro ao buscar endereço. Tente novamente.");
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        let nome = document.getElementById("nome").value;
        let email = document.getElementById("email").value;
        let senha = document.getElementById("senha").value;
        let cpf = document.getElementById("cpf").value;
        let genero = document.getElementById("genero").value;
        let dataNascimento = document.getElementById("dataNascimento").value;
        let grupo = "usuario";

        // Captura os endereços
        const enderecos = [];

        // Adiciona o endereço de faturamento
        enderecos.push({
            cep: document.getElementById("cep-faturamento").value,
            logradouro: document.getElementById("logradouro-faturamento").value,
            numero: document.getElementById("numero-faturamento").value,
            complemento: document.getElementById("complemento-faturamento").value,
            bairro: document.getElementById("bairro-faturamento").value,
            cidade: document.getElementById("cidade-faturamento").value,
            uf: document.getElementById("uf-faturamento").value,
            principal: document.querySelector(`input[name="enderecoPrincipal"]:checked`) ? true : false,
            grupo: "faturamento"
        });

        // Captura endereços adicionais
        const enderecosAdicionais = Array.from(document.querySelectorAll('.novo-endereco')).map((endereco) => {
            return {
                cep: endereco.querySelector('.cep').value,
                logradouro: endereco.querySelector('.logradouro').value,
                numero: endereco.querySelector('.numero').value,
                complemento: endereco.querySelector('.complemento').value,
                bairro: endereco.querySelector('.bairro').value,
                cidade: endereco.querySelector('.cidade').value,
                uf: endereco.querySelector('.uf').value,
                principal: endereco.querySelector(`input[name="enderecoPrincipal"]:checked`) ? true : false,
                grupo: "envio"
            };
        });

        enderecos.push(...enderecosAdicionais);

        // Verifica se há mais de um endereço marcado como principal
        const principalCount = enderecos.filter(endereco => endereco.principal).length;
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
            const id = data.idUsuario;
            return addBanco(id, enderecos);
        })
        .then(() => {
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
    }

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
});
