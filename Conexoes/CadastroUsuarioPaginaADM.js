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
                    usuaDsPassword: senha ,
                    usuaCdGrupo: tipoUsuario
                };

                fetch(`http://localhost:8015/user/${user.idUsuario}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    localStorage.removeItem('userEdit'); 
                    window.location.href = 'ListaUsuario.html';;
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
            .then(response => {
                return response.json();
            })
            .then(data => {
                window.location.href = 'ListaUsuario.html';
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        });
    }

    if(formCadastrarUser) {
        formCadastrarUser.addEventListener('submit', function(event) {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const cpf = document.getElementById('cpf').value;

            const dados = {
                usuaNmUsuario: nome,
                usuaDsEmail: email,
                usuaDsCPF: cpf,
                usuaDsPassword: senha,
                usuaCdGrupo: 'Usuário'
            };

            fetch('http://localhost:8015/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                window.location.href = 'ListaUsuario.html';
            })
            .catch(error => {
                alert('Erro:', error);
            });
        });
    }
});