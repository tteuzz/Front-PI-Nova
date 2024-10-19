let users = []
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});
function fetchUsers() {
    fetch('http://localhost:8015/user/listUsers/ordenada')
        .then(response => response.json())
        .then(data => {
            users = data
            displayUsers();
        })
        .catch(error => {
            console.error("erro ao buscar users: ", error)
            alert('erro ao buscar users');
        });
}
function displayUsers() {
    const tableBody = document.getElementById('product-table-body')
    tableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML =
            `<td>${user.idUsuario || 'N/A'}</td>
        <td>${user.usuaNmUsuario || 'N/A'}</td>
        <td>${user.usuaDsEmail || 'N/A'}</td>
        <td>${user.usuaDsCPF || 'N/A'}</td>
        <td>${user.usuaCdGrupo || 'N/A'}</td>
        <td>${user.usuaDhInativo ? 'INATIVO' : 'ATIVO'}</td>
         <td>
                <button onclick="alterarStatus('${user.idUsuario}')">alterar Status</button>
                <button onclick="editarUsuario('${user.idUsuario}')">Editar</button>
        </td>`
            ;
        tableBody.appendChild(row);
    })
}
function editarUsuario(id) {
    fetch(`http://localhost:8015/user/${id}`)
        .then(response => response.json())
        .then(user => {
            localStorage.setItem('userEdit', JSON.stringify(user));
            window.location.href = 'TelaEditarUsuario.html';
        })
        .catch(error => {
            console.error('Erro ao buscar usuário:', error);
            alert('Erro ao buscar os dados do usuário.');
        });
}
function alterarStatus(id) {
    fetch(`http://localhost:8015/user/inabilitar/${id}`, {
        method: 'PUT',
    })
        .then(response => response.json())
        .then(data => {
            displayUsers();
            window.location.reload()
        })
        .catch(error => {
            console.error('Erro ao alterar status:', error);
            alert('Erro ao alterar o status do usuário.');
        })
}