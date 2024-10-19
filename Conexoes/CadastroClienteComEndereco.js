document.addEventListener('DOMContentLoaded', (event) => {
    const formCadastrarUser = document.getElementById('cadastro');

    if (formCadastrarUser) {
        formCadastrarUser.addEventListener('submit', handleSubmit);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const usuario = {
            usuaNmUsuario: document.getElementById('nome').value,
            usuaDsEmail: document.getElementById('email').value,
            usuaDsPassword: document.getElementById('senha').value,
            usuaDsCPF: document.getElementById('cpf').value,
            usuaGenero: document.getElementById('genero').value,
            usuaDataNascimento: document.getElementById('dataNascimento').value,
            usuaCdGrupo: "usuario"
        };

        try {
            const user = await cadastrarUsuario(usuario);
            await cadastrarEndereco(user);
            alert("Usuário e endereço cadastrados com sucesso");
            formCadastrarUser.reset();
            window.location.href = 'TelaHome.html';
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message || "Erro ao cadastrar usuário ou endereço");
        }
    }

    async function cadastrarUsuario(usuario) {
        const response = await fetch('http://localhost:8015/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) {
            throw new Error(`Erro ao cadastrar usuário: ${response.status}`);
        }

        return response.json();
    }

    async function cadastrarEndereco(usuario) {
        const endereco = {
            logradouro: document.getElementById("logradouro").value,
            numero: document.getElementById("numero").value,
            complemento: document.getElementById("complemento").value,
            bairro: document.getElementById("bairro").value,
            cidade: document.getElementById("cidade").value,
            cep: document.getElementById("cep").value,
            uf: document.getElementById("uf").value,
            enderecoPrincipal: true,
            fkUser: usuario.idUsuario || usuario.id // Ajuste conforme a resposta do seu backend
        };
        console.log('Dados para cadastro de endereço:', endereco);
        const response = await fetch('http://localhost:8015/Endereco', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(endereco)
        });
        if (!response.ok) {
            console.error('Erro ao cadastrar endereço:', response.status, response.statusText);
            throw new Error(`Erro ao cadastrar endereço: ${response.status}`);
        }
        return response.json();
    }
});