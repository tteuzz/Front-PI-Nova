document.addEventListener('DOMContentLoaded', (event) => {
    const icone = document.querySelector('.icone');
    const cardLoginCadastro = document.getElementById('card-login-cadastro');
    const userLogado = sessionStorage.getItem("UserLogado")

    fetchProducts();
    icone.addEventListener('click', (event) => {
        event.stopPropagation(); 
        if (cardLoginCadastro.style.display === 'none' || cardLoginCadastro.style.display === '') {

            if(userLogado){
                cardLoginCadastro.innerHTML = `
                <button onclick="verPerfil()">Ver Perfil</button>
                <button onclick="logout()">Logout</button>
            `;
            } else{
                cardLoginCadastro.innerHTML = `
                <button onclick="verPerfil()">Ver Perfil</button>
                <button onclick="logout()">Logout</button>
            `;
            }
            cardLoginCadastro.style.display = 'block';
        } else {
            cardLoginCadastro.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (!icone.contains(event.target) && !cardLoginCadastro.contains(event.target)) {
            cardLoginCadastro.style.display = 'none';
        }
    });

    const myCarouselElement = document.querySelector('#carouselExampleIndicators');
    
    const carousel = new bootstrap.Carousel(myCarouselElement, {
        interval: 2000,
        touch: false
    });
});

function login() {
    window.location.href = 'Telainicial.html';
}

function cadastro() {
    window.location.href = 'TelaCadastroUsuario.html';
}

function fetchProducts() {
}

document.addEventListener('DOMContentLoaded', function() {
    const profileIcon = document.querySelector('.icone');
    const profileCard = document.getElementById('card-login-cadastro');

    profileIcon.addEventListener('click', function() {
        profileCard.classList.toggle('hidden');
    });

    const userData = {
        name: "Matheus Luiz",
        email: "matheus.luiz@teste.com",
        password: "********",
        cpf: "123.456.789-00",
        gender: "Masculino",
        dob: "01/01/1990",
        group: "Cliente"
    };

    document.getElementById('user-name').textContent = userData.name;
    document.getElementById('user-email').textContent = userData.email;
    document.getElementById('user-password').textContent = userData.password;
    document.getElementById('user-cpf').textContent = userData.cpf;
    document.getElementById('user-gender').textContent = userData.gender;
    document.getElementById('user-dob').textContent = userData.dob;

     // Adicionar novo endereço
     const addAddressBtn = document.getElementById('add-address-btn');
     const newAddressContainer = document.getElementById('new-address-container');
     const saveAddressBtn = document.getElementById('save-address-btn');
     const newAddressInput = document.getElementById('new-address-input');
 
     addAddressBtn.addEventListener('click', function() {
         newAddressContainer.classList.toggle('hidden');
     });
 
     saveAddressBtn.addEventListener('click', function() {
         const newAddress = newAddressInput.value;
         if (newAddress) {
             alert(`Novo endereço salvo: ${newAddress}`);
             newAddressInput.value = '';
             newAddressContainer.classList.add('hidden');
         } else {
             alert('Por favor, digite um endereço.');
         }
     });
});