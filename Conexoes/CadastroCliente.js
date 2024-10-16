document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('cadastro');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        let nome = document.getElementById("nome").value;
        let email = document.getElementById("email").value;
        let senha = document.getElementById("senha").value;
        let cpf = document.getElementById("cpf").value;
        let genero = document.getElementById("genero").value;
        let dataNascimento = document.getElementById("dataNascimento").value;
        let grupo = "usuario"; 

        const dados = {
            usuaNmUsuario: nome,
            usuaDsEmail: email,
            usuaDsPassword: senha,
            usuaDsCPF: cpf,
            usuaCdGrupo: grupo,
            usuaGenero: genero,
            usuaDataNascimento: dataNascimento
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
    
            window.location.href = 'TelaHome.html';
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
});
