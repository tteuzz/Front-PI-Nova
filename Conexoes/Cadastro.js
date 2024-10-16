document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('cadastroForm');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); 

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            const dados = {
                usuaDsEmail: email,
                usuaDsPassword: senha
            };

            try {
                const loginResponse = await fetch('http://localhost:8015/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                });

                const contentType = loginResponse.headers.get("content-type");
                let usuario;
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    usuario = await loginResponse.json(); 
                } else {
                    usuario = await loginResponse.text(); 
                }

                console.log('Dados recebidos:', usuario);

                sessionStorage.setItem('usuario', JSON.stringify(usuario)); 

                if (usuario == "Administrador") {
                    localStorage.setItem("grupoUsuario", "administrador");
                    window.location.href = 'TelaBackoffice.html';
                } else if (usuario == "Estoquista") {
                    localStorage.setItem("grupoUsuario", "estoquista");
                    window.location.href = 'TelaBackofficeEstoquista.html';
                } else {
                    localStorage.setItem("grupoUsuario", "usuario");
                    window.location.href = 'TelaHome.html';   
                }

                await pushDeInfoDoBanco(email);

            } catch (error) {
                console.error('Erro:', error); 
                alert('Ocorreu um erro ao fazer login.');
            }
        });
    } else {
        console.error('Formulário não encontrado!');
    }
});

async function pushDeInfoDoBanco(email) {
    try {
        const response = await fetch(`http://localhost:8015/user/buscarUser/${email}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar usuário');
        }

     
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json(); 
        } else {
            data = await response.text(); 
        }

        sessionStorage.setItem("usuarioLogado", JSON.stringify(data)); 

        alert("Informações do usuário obtidas com sucesso");
    } catch (error) {
        console.error("Erro ao buscar informações do banco:", error);
        alert("Ocorreu um erro ao resgatar os dados do login");
    }
}
