//comentando pra main
document.addEventListener('DOMContentLoaded', () => {
    listarEndereco();

    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('blur', async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            await buscarEnderecoFaturamento(cep);
        } else {
            alert("CEP deve ter 8 dígitos.");
        }
    });
});

async function listarEndereco() {
    let user = sessionStorage.getItem("usuarioLogado");
    user = JSON.parse(user);

    const url = `http://localhost:8015/Endereco/ListarEndereco/${user.idUsuario}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Não foi possível listar os endereços.");
        }

        const enderecos = await response.json();
        const addressContainer = document.getElementById('added-addresses-container');
        addressContainer.innerHTML = '';

        enderecos.forEach(endereco => {
            const addressItem = document.createElement('div');
            addressItem.className = 'address-item';
            addressItem.id = `address-item-${endereco.id}`;
            addressItem.innerHTML = `
                <div>
                    <p>${endereco.logradouro}, ${endereco.numero}, ${endereco.complemento}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.uf}, ${endereco.cep}</p>
                    <button class="button" onclick="definirEnderecoPrincipal(${endereco.id})">Definir como Principal</button>
                    <span class="default-label">${endereco.enderecoPrincipal ? 'Endereço Padrão' : ''}</span>
                    <span class="billing-label">${endereco.grupo === 'faturamento' ? 'Endereço de Faturamento' : ''}</span>
                </div>
            `;
            addressContainer.appendChild(addressItem);
        });
    } catch (error) {
        console.error(error);
        alert("Erro ao listar endereços: " + error.message);
    }
}

async function definirEnderecoPrincipal(idEndereco) {
    const addressItems = document.querySelectorAll('.address-item');
    addressItems.forEach(item => {
        const defaultLabel = item.querySelector('.default-label');
        const button = item.querySelector('button');
        if (defaultLabel) {
            defaultLabel.textContent = '';
        }
        if (button) {
            button.style.display = 'block';
        }
    });

    const addressItem = document.getElementById(`address-item-${idEndereco}`);
    const defaultLabel = addressItem.querySelector('.default-label');
    const button = addressItem.querySelector('button');
    if (defaultLabel) {
        defaultLabel.textContent = 'Endereço De Entrega';
    }
    if (button) {
        button.style.display = 'none';
    }

    await editarEndereco(idEndereco);
    alert("Endereço de entrega definido");

    // Salvar endereço de entrega no sessionStorage
    const enderecoText = addressItem.querySelector('p').textContent;
    const enderecoParts = enderecoText.split(', ');

    
    const enderecoEntrega = {
        logradouro: enderecoParts[0],
        numero: enderecoParts[1],
        complemento: enderecoParts[2],
        bairro: enderecoParts[3],
        cidade: enderecoParts[4],
        uf: enderecoParts[5],
        cep: enderecoParts[6],
        id: idEndereco
    };

    console.log("Endereço de entrega:", enderecoEntrega); // Log para depuração
    sessionStorage.setItem('enderecoEntrega', JSON.stringify(enderecoEntrega));

    // Exibir botão "Avançar para próxima etapa"
    criarBotaoAvancar();
}

function criarBotaoAvancar() {
    let avancarButton = document.getElementById('avancar-pagamento-btn');
    if (!avancarButton) {
        avancarButton = document.createElement('button');
        avancarButton.id = 'avancar-pagamento-btn';
        avancarButton.className = 'button';
        avancarButton.textContent = 'Avançar para próxima etapa';
        avancarButton.onclick = () => {
            window.location.href = 'pagamentos.html';
        };
        document.querySelector('main').appendChild(avancarButton);
    }
    avancarButton.style.display = 'block';
}

async function editarEndereco(idEndereco) {
    const addressItem = document.getElementById(`address-item-${idEndereco}`);
    const inputs = addressItem.querySelectorAll('input');
    const grupoEndereco = addressItem.querySelector('#grupoEndereco').value;

    const endereco = {
        id: idEndereco,
        logradouro: inputs[0].value,
        numero: inputs[1].value,
        complemento: inputs[2].value,
        bairro: inputs[3].value,
        cidade: inputs[4].value,
        uf: inputs[5].value,
        cep: inputs[6].value,
        grupo: grupoEndereco,
        enderecoPrincipal: true
    };

    const url = `http://localhost:8015/Endereco/editarEndereco`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(endereco)
        });

        if (!response.ok) {
            throw new Error("Erro ao editar o endereço.");
        }
        listarEndereco();

        // Alerta quando o endereço for definido como endereço de envio
        if (endereco.grupo === 'envio') {
            alert("Endereço definido como endereço de envio");
        }
    } catch (error) {
        alert(error.message);
    }
}

async function cadastrarNovoEndereco() {
    let user = sessionStorage.getItem("usuarioLogado");
    user = JSON.parse(user);

    const cep = document.getElementById('cep').value;
    const logradouro = document.getElementById('logradouro').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const complemento = document.getElementById('complemento').value;
    const uf = document.getElementById('uf').value;
    const numero = document.getElementById("numero").value;

    const endereco = {
        cep: cep,
        logradouro: logradouro,
        numero: numero,
        complemento: complemento,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        enderecoPrincipal: false,
        grupo: "envio",
    };

    const url = `http://localhost:8015/Endereco/adicionarMaisUm/${user.idUsuario}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(endereco)
        });
        if (!response.ok) {
            alert("Erro ao cadastrar endereços");
            return;
        }
        alert("Endereço adicionado com sucesso");
        document.getElementById('cep').value = "";
        document.getElementById('complemento').value = "";
        document.getElementById('numero').value = "";
        document.getElementById('logradouro').value = "";
        document.getElementById('bairro').value = "";
        document.getElementById('cidade').value = "";
        document.getElementById('uf').value = "";
        listarEndereco();
    } catch (error) {
        console.log("Erro no add:", error);
    }
}

async function buscarEnderecoFaturamento(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) {
            alert("CEP inválido");
            return;
        }
        document.getElementById('logradouro').value = data.logradouro;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('uf').value = data.uf;
    } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        alert("Erro ao buscar endereço. Tente novamente.");
    }
}