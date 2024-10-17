    document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId'); 

    if (userId) {
        fetch(`http://localhost:8015/user/${userId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('user-name').value = data.usuaNmUsuario;
                document.getElementById('user-email').textContent = data.usuaDsEmail;
                document.getElementById('user-password').value = data.usuaDsPassword;
                document.getElementById('user-cpf').textContent = data.usuaDsCPF;
                document.getElementById('user-gender').value = data.usuaDsGenero || '';
                document.getElementById('user-dob').value = data.usuaDtNascimento || '';
            })
            .catch(error => {
                console.error('Erro ao buscar os dados do usuário:', error);
            });
    } else {
        console.log('ID do usuário não encontrado no localStorage.');
    }

    
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');

    editBtn.addEventListener('click', () => {
        document.getElementById('user-name').disabled = false;
        document.getElementById('user-password').disabled = false;
        document.getElementById('user-gender').disabled = false;
        document.getElementById('user-dob').disabled = false;
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline';
    });

    saveBtn.addEventListener('click', () => {
        const updatedUser = {
            usuaNmUsuario: document.getElementById('user-name').value,
            usuaDsPassword: document.getElementById('user-password').value,
            usuaDsGenero: document.getElementById('user-gender').value,
            usuaDtNascimento: document.getElementById('user-dob').value
        };

        fetch(`http://localhost:8015/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => {
            if (response.ok) {
                alert('Dados atualizados com sucesso!');
                document.getElementById('user-name').disabled = true;
                document.getElementById('user-password').disabled = true;
                document.getElementById('user-gender').disabled = true;
                document.getElementById('user-dob').disabled = true;
                editBtn.style.display = 'inline';
                saveBtn.style.display = 'none';
            } else {
                alert('Erro ao atualizar os dados.');
            }
        })
        .catch(error => {
            console.error('Erro ao salvar os dados do usuário:', error);
        });
    });
});
