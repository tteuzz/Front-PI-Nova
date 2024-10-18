form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    let cpf = document.getElementById("cpf").value;
    let genero = document.getElementById("genero").value;
    let dataNascimento = document.getElementById("dataNascimento").value;
    let grupo = "usuario"; 

    let cep = document.getElementById("cep").value;
    let logradouro = document.getElementById("logradouro").value;
    let numero = document.getElementById("numero").value;
    let complemento = document.getElementById("complemento").value;
    let bairro = document.getElementById("bairro").value;
    let cidade = document.getElementById("cidade").value;
    let uf = document.getElementById("uf").value;

    const dadosUsuario = {
        usuaNmUsuario: nome,
        usuaDsEmail: email,
        usuaDsPassword: senha,
        usuaDsCPF: cpf,
        usuaCdGrupo: grupo,
        usuaGenero: genero,
        usuaDataNascimento: dataNascimento
    };

    const dadosEndereco = {
        cep: cep,
        logradouro: logradouro,
        numero: numero,
        complemento: complemento,
        bairro: bairro,
        cidade: cidade,
        uf: uf
    };

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
        return fetch('http://localhost:8015/Endereco', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosEndereco)
        });
    })
    .then(response => {
        if (!response.ok) {
            throw response; 
        }
        return response.json();
    })
    .then(data => {
        window.location.href = 'TelaHome.html';
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