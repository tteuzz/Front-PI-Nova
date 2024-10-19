    document.addEventListener('DOMContentLoaded', () => {
        let user = sessionStorage.getItem("usuarioLogado")
        user = JSON.parse(user)       
        document.getElementById("user-name").value = user.usuaNmUsuario;
        document.getElementById("user-email").value = user.usuaDsEmail;
        document.getElementById("user-cpf").value = user.usuaDsCPF;
        document.getElementById("user-password").value = user.usuaDsPassword;
        document.getElementById("user-gender").value = user.usuaGenero;
        document.getElementById("user-dob").value = user.usuaDataNascimento;

});

async function editarUsuario() {
    let user = sessionStorage.getItem("usuarioLogado")
    user = JSON.parse(user)
    const name  = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;
    const cpf = document.getElementById("user-cpf").value;
    const senha = document.getElementById("user-password").value;
    const genero = document.getElementById("user-gender").value;
    const data  = document.getElementById("user-dob").value;
    const grupousuario = "usuario";
    const url = `http://localhost:8015/user/${user.idUsuario}`;

    const usuario = {
        usuaNmUsuario: name,
        usuaDsEmail: email,
        usuaDsPassword: senha,
        usuaDsCPF: cpf,
        usuaCdGrupo: grupousuario,
        usuaGenero: genero,
        usuaDataNascimento: data
    }

    try{
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            alert("usuario nao foi atualizado");
        }
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json(); 
            sessionStorage.setItem("usuarioLogado",JSON.stringify(data))
            window.location.reload();
        } else {
            data = await response.text();
            sessionStorage.setItem("usuarioLogado",JSON.stringify(data))
            window.location.reload();
        }
    }catch(error){
        alert("error")
    }   
}
document.getElementById('add-address-btn').addEventListener('click', addAddress);

function addAddress() {
    const cep = document.getElementById('cep').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const uf = document.getElementById('uf').value;

    const address = `${logradouro}, ${numero} ${complemento}, ${bairro}, ${cidade} - ${uf}, ${cep}`;

    const addressContainer = document.getElementById('added-addresses-container');
    const addressItem = document.createElement('div');
    addressItem.className = 'address-item';
    addressItem.innerHTML = `
        <p>${address}</p>
        <button class="button" onclick="setDefaultAddress(this)">Definir como padrão</button>
    `;

    addressContainer.appendChild(addressItem);

    document.getElementById('cep').value = '';
    document.getElementById('logradouro').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('complemento').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('uf').value = '';
}

function setDefaultAddress(button) {
    const addressContainer = document.getElementById('added-addresses-container');
    const addressItems = addressContainer.getElementsByClassName('address-item');

    if (addressItems.length < 2) {
        alert('Você precisa ter pelo menos dois endereços cadastrados para definir um como padrão.');
        return;
    }

    for (let item of addressItems) {
        const defaultLabel = item.querySelector('.default-label');
        if (defaultLabel) {
            defaultLabel.remove();
        }
        const button = item.querySelector('button');
        if (button) {
            button.style.display = 'inline-block';
        }
    }

    const addressItem = button.parentElement;
    button.style.display = 'none';
    const defaultLabel = document.createElement('span');
    defaultLabel.className = 'default-label';
    defaultLabel.textContent = 'Endereço Padrão';
    addressItem.appendChild(defaultLabel);

    addressContainer.insertBefore(addressItem, addressContainer.firstChild);
}