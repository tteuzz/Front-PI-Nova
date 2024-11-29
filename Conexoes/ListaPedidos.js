let products = [];  // A lista de produtos (ou pedidos)
const itemsPorPagina = 10;
let paginaAtual = 1;



function Deslogar(){
    window.location.href = 'Telainicial.html';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// Função para buscar os produtos do backend
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8015/pedido/listarPelaData');
        const data = await response.json();
        products = data;  // Armazena os produtos recebidos
        displayProducts();
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        alert('Erro ao buscar pedidos.');
    }
}

// Função para exibir os produtos na tabela
function displayProducts() {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const orderStatus = product.statusPedido || 'N/A';
        const address = product.fkEndereco
            ? `${product.fkEndereco.logradouro}, ${product.fkEndereco.numero}, ${product.fkEndereco.bairro}, ${product.fkEndereco.cidade}, ${product.fkEndereco.uf}`
            : 'N/A';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.numeroPedido || 'N/A'}</td>
            <td>${product.nomeProduto || 'N/A'}</td>
            <td>${orderStatus}</td>
            <td>${address}</td>
            <td>
                <button onclick="openEditModal(${product.numeroPedido})">Editar Status</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Atualiza a navegação de páginas
    document.getElementById('page-info').textContent = `Página ${paginaAtual} de ${Math.ceil(products.length / itemsPorPagina)}`;
}

// Função para abrir o modal de edição
function openEditModal(numeroPedido) {
    const product = products.find(p => p.numeroPedido === numeroPedido);

    if (product) {
        document.getElementById('idProduto').value = product.numeroPedido;  // Armazena o numeroPedido no campo oculto
        document.getElementById('modal-numero').textContent = product.numeroPedido;
        document.getElementById('modal-nome').textContent = product.nomeProduto;

        // Define o status atual no modal
        const statusRadios = document.getElementsByName('statusPedido');
        statusRadios.forEach(radio => {
            radio.checked = (radio.value === product.statusPedido);
        });

        document.getElementById('editModal').style.display = 'block';
    } else {
        console.error('Produto não encontrado.');
    }
}

// Função para fechar o modal de edição
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Função para salvar a alteração do status
function saveStatus() {
    const numeroPedido = document.getElementById('idProduto').value;

    if (!numeroPedido) {
        alert('Erro: número do pedido não encontrado!');
        return;
    }

    const selectedStatus = document.querySelector('input[name="statusPedido"]:checked');



    const newStatus = selectedStatus.value;


    const product = products.find(p => p.numeroPedido == numeroPedido);
  
    alterarStatus(newStatus,product)
    closeEditModal();
    displayProducts();
  
}


async function alterarStatus(newStatus,product){
    try {
        console.log(newStatus)
        const url = `http://localhost:8015/pedido/altStatus/${product.idPedido}`;

       
        const response = await fetch(url, {
            method: 'PUT',  
            headers: {
                'Content-Type': 'application/json', 
            },
            body: newStatus
        });

    
        const data = await response.json();

       
        console.log('Pedido alterado com sucesso:', data);
        alert('Status do pedido alterado com sucesso!');
        
     
        window.location.reload()
        
    } catch (error) {
        console.error('Erro ao alterar o status do pedido:', error);
        alert('Falha ao alterar o status do pedido!');
    }
}
