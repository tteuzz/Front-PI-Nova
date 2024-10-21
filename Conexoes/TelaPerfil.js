document.addEventListener('DOMContentLoaded', () => {
    let user = sessionStorage.getItem("usuarioLogado");
    user = JSON.parse(user);

    document.getElementById("user-name").value = user.usuaNmUsuario;
    document.getElementById("user-email").value = user.usuaDsEmail;
    document.getElementById("user-cpf").value = user.usuaDsCPF;
    document.getElementById("user-password").value = user.usuaDsPassword;
    document.getElementById("user-gender").value = user.usuaGenero;
    document.getElementById("user-dob").value = user.usuaDataNascimento;

    const enderecoFaturamento = JSON.parse(localStorage.getItem('enderecoFaturamento'));
    const enderecoEntrega = JSON.parse(localStorage.getItem('enderecoEntrega'));

    const addressContainer = document.getElementById('added-addresses-container');

    if (enderecoFaturamento) {
        const addressItem = document.createElement('div');
        addressItem.className = 'address-item';
        addressItem.innerHTML = `
            <p>${enderecoFaturamento.logradouro}, ${enderecoFaturamento.bairro}, ${enderecoFaturamento.cidade} - ${enderecoFaturamento.uf}, ${enderecoFaturamento.cep}</p>
            <button class="button" onclick="setDefaultAddress(this)">Definir como padrão</button>
        `;
        addressContainer.appendChild(addressItem);
    }

    if (enderecoEntrega) {
        const addressItem = document.createElement('div');
        addressItem.className = 'address-item';
        addressItem.innerHTML = `
            <p>${enderecoEntrega.logradouro}, ${enderecoEntrega.bairro}, ${enderecoEntrega.cidade} - ${enderecoEntrega.uf}, ${enderecoEntrega.cep}</p>
            <button class="button" onclick="setDefaultAddress(this)">Definir como padrão</button>
        `;
        addressContainer.appendChild(addressItem);
    }
});

function buscarEndereco(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP inválido");
                return;
            }
            document.getElementById('cep').value = data.cep.replace('-', '');
            document.getElementById('logradouro').value = data.logradouro;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('cidade').value = data.localidade;
            document.getElementById('uf').value = data.uf;
        });
}

document.getElementById('cep').addEventListener('input', () => {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarEndereco(cep);
    }
});

function toggleEditMode() {
    const editButton = document.getElementById('edit-user-btn');
    const saveButton = document.getElementById('save-user-btn');
    const inputs = document.querySelectorAll('#user-info input, #user-info select');

    if (editButton.textContent === 'Editar') {
        editButton.textContent = 'Cancelar';
        saveButton.style.display = 'inline-block';
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
        });
    } else {
        editButton.textContent = 'Editar';
        saveButton.style.display = 'none';
        inputs.forEach(input => {
            input.setAttribute('readonly', 'readonly');
            input.setAttribute('disabled', 'disabled');
        });
        window.location.reload(); // Recarrega a página para cancelar as alterações
    }
}

async function editarUsuario() {
    let user = sessionStorage.getItem("usuarioLogado");
    user = JSON.parse(user);
    const name = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;
    const cpf = document.getElementById("user-cpf").value;
    const senha = document.getElementById("user-password").value;
    const genero = document.getElementById("user-gender").value;
    const data = document.getElementById("user-dob").value;
    const grupousuario = "usuario";
    const url = `http://localhost:8015/user/${user.idUsuario}`;

    const usuario = {
        usuaNmUsuario: name,
        usuaDsEmail: email,
        usuaDsPassword: senha,
        usuaDsCPF: cpf,
        usuaCdGrupo: grupousuario,
        usuaGenero: genero,
        usuaDataNascimento: data,
        enderecoFaturamento: JSON.parse(localStorage.getItem('enderecoFaturamento')),
        enderecoEntrega: JSON.parse(localStorage.getItem('enderecoEntrega'))
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            alert("Usuário não foi atualizado");
            return;
        }
        const data = await response.json();
        sessionStorage.setItem("usuarioLogado", JSON.stringify(data));
        localStorage.setItem("usuarioLogado", JSON.stringify(data)); // Salva no localStorage
        alert("Usuário atualizado com sucesso!");
        window.location.reload();
    } catch (error) {
        alert("Erro ao atualizar usuário.");
        console.error(error);
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

    const address = {
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf
    };

    const addressContainer = document.getElementById('added-addresses-container');
    const addressItem = document.createElement('div');
    addressItem.className = 'address-item';
    addressItem.innerHTML = `
        <p>${logradouro}, ${numero} ${complemento}, ${bairro}, ${cidade} - ${uf}, ${cep}</p>
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

    // Salvar no localStorage
    let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
    enderecos.push(address);
    localStorage.setItem('enderecos', JSON.stringify(enderecos));
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