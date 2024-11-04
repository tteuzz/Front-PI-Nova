//comentando pra main

let cepInput = document.getElementById('cep-faturamento');
let logradouroInput = document.getElementById('logradouro-faturamento');
let bairroInput = document.getElementById('bairro-faturamento');
let cidadeInput = document.getElementById('cidade-faturamento');
let ufInput = document.getElementById('uf-faturamento');

function buscarEnderecoFaturamento(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP inválido");
                return;
            }
            cepInput.value = data.cep.replace('-', '');
            logradouroInput.value = data.logradouro;
            bairroInput.value = data.bairro;
            cidadeInput.value = data.localidade;
            ufInput.value = data.uf;
        });
}

cepInput.addEventListener('input', () => {
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarEnderecoFaturamento(cep);
    }
});

let cepInput2 = document.getElementById('cep-entrega');
let logradouroInput2 = document.getElementById('logradouro-entrega');
let bairroInput2 = document.getElementById('bairro-entrega');
let cidadeInput2 = document.getElementById('cidade-entrega');
let ufInput2 = document.getElementById('uf-entrega');

function buscarEnderecoEntrega(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP inválido");
                return;
            }
            cepInput2.value = data.cep.replace('-', '');
            logradouroInput2.value = data.logradouro;
            bairroInput2.value = data.bairro;
            cidadeInput2.value = data.localidade;
            ufInput2.value = data.uf;
        });
}

cepInput2.addEventListener('input', () => {
    const cep = cepInput2.value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarEnderecoEntrega(cep);
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('cadastro');

    document.getElementById('addEndereco').addEventListener('click', function() {
        const novoEndereco = document.createElement('div');
        novoEndereco.className = 'endereco novo-endereco';

        novoEndereco.innerHTML = `
            <label for="cep">CEP</label>
            <input type="text" id="cep-entrega2" maxlength="8" pattern="\\d{8}" placeholder="Digite o CEP">
        
            <label for="logradouro">Logradouro</label>
            <input type="text" id="logradouro-entrega2" placeholder="Logradouro">
        
            <label for="numero">Número</label>
            <input type="text" id="numero-entrega2" placeholder="Número">
        
            <label for="complemento">Complemento</label>
            <input type="text" id="complemento-entrega2" placeholder="Complemento">
        
            <label for="bairro">Bairro</label>
            <input type="text" id="bairro-entrega2" placeholder="Bairro">
        
            <label for="cidade">Cidade</label>
            <input type="text" id="cidade-entrega2" placeholder="Cidade">
        
            <label for="uf">UF</label>
            <input type="text" id="uf-entrega2" placeholder="UF">
        `;
        document.getElementById('enderecos-container').appendChild(novoEndereco);
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('cadastroForm');
    const formAdicionarUserAdm = document.getElementById('cadastroUserAdm');
    const formCadastrarUser = document.getElementById('cadastro');

    if (form) {
        const userToEdit = localStorage.getItem('userEdit');
        
        if (userToEdit) {
            const user = JSON.parse(userToEdit);
            document.getElementById('nome').value = user.usuaNmUsuario;
            document.getElementById('cpf').value = user.usuaDsCPF;
            document.getElementById('senha').value = user.usuaDsPassword;

            form.addEventListener('submit', function(event) {
                event.preventDefault();

                const nome = document.getElementById('nome').value;
                const senha = document.getElementById('senha').value;
                const cpf = document.getElementById('cpf').value;
                const tipoUsuario = document.getElementById('tipoUsuario').value;

                const dados = {
                    usuaNmUsuario: nome,
                    usuaDsCPF: cpf,
                    usuaDsPassword: senha,
                    usuaCdGrupo: tipoUsuario
                };

                fetch(`http://localhost:8015/user/${user.idUsuario}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                })
                .then(response => response.json())
                .then(data => {
                    localStorage.removeItem('userEdit');
                    window.location.href = 'ListaUsuario.html';
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Ocorreu um erro ao atualizar o usuário.');
                });
            });
        }
    }

    if (formAdicionarUserAdm) {
        formAdicionarUserAdm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const cpf = document.getElementById('cpf').value;
            const tipoUsuario = document.getElementById('tipoUsuario').value;

            const dados = {
                usuaNmUsuario: nome,
                usuaDsEmail: email,
                usuaDsCPF: cpf,
                usuaDsPassword: senha,
                usuaCdGrupo: tipoUsuario
            };

            fetch('http://localhost:8015/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = 'ListaUsuario.html';
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        });
    }

    if (formCadastrarUser) {
        formCadastrarUser.addEventListener('submit', function(event) {
            event.preventDefault();

            let nome = document.getElementById("nome").value;
            let email = document.getElementById("email").value;
            let senha = document.getElementById("senha").value;
            let cpf = document.getElementById("cpf").value;
            let genero = document.getElementById("genero").value;
            let dataNascimento = document.getElementById("dataNascimento").value;
            let grupo = "usuario"; 

            let cepFaturamento = document.getElementById('cep-faturamento').value;
            let logradouroFaturamento = document.getElementById('logradouro-faturamento').value;
            let bairroFaturamento = document.getElementById('bairro-faturamento').value;
            let cidadeFaturamento = document.getElementById('cidade-faturamento').value;
            let ufFaturamento = document.getElementById('uf-faturamento').value;

            let cepEntrega = document.getElementById('cep-entrega').value;
            let logradouroEntrega = document.getElementById('logradouro-entrega').value;
            let bairroEntrega = document.getElementById('bairro-entrega').value;
            let cidadeEntrega = document.getElementById('cidade-entrega').value;
            let ufEntrega = document.getElementById('uf-entrega').value;

            const dadosUsuario = {
                usuaNmUsuario: nome,
                usuaDsEmail: email,
                usuaDsPassword: senha,
                usuaDsCPF: cpf,
                usuaCdGrupo: grupo,
                usuaGenero: genero,
                usuaDataNascimento: dataNascimento,
                enderecoFaturamento: {
                    cep: cepFaturamento,
                    logradouro: logradouroFaturamento,
                    bairro: bairroFaturamento,
                    cidade: cidadeFaturamento,
                    uf: ufFaturamento
                },
                enderecoEntrega: {
                    cep: cepEntrega,
                    logradouro: logradouroEntrega,
                    bairro: bairroEntrega,
                    cidade: cidadeEntrega,
                    uf: ufEntrega
                }
            };

            fetch('http://localhost:8015/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosUsuario)
            })
            .then(response => response.json())
            .then(user => {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('enderecoFaturamento', JSON.stringify(dadosUsuario.enderecoFaturamento));
                localStorage.setItem('enderecoEntrega', JSON.stringify(dadosUsuario.enderecoEntrega));
                alert('Dados salvos com sucesso!');
                window.location.href = 'TelaHome.html';
            })
            .catch(error => {
                console.log(error);
                alert('Erro:', error);
            });
        });
    }
});
