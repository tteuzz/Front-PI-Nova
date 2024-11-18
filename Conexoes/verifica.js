
//comentando pra main
document.addEventListener('DOMContentLoaded', function() {
    const finalizarBtn = document.getElementById('finalizar-pedido');
    const modal = document.getElementById('modal-verificacao');
    const fecharModal = document.getElementById('fechar-modal');
    const simBtn = document.getElementById('sim-conta');
    const naoBtn = document.getElementById('nao-conta');

    finalizarBtn.addEventListener('click', function() {
        const user = localStorage.getItem('user');
        const grupoUsuario = localStorage.getItem('grupoUsuario');
        if (!user && !grupoUsuario) {
            modal.style.display = 'block';
        } else {
            sessionStorage.setItem('produtos', JSON.stringify(products));
            window.location.href = 'Pagamentos.html'; 
        }
    });

    fecharModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    simBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        alert("Ótimo! você será redirecionado para a tela de login.");
        window.location.href = "Telainicial.html";
    });

    naoBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        alert("Você será redirecionado para a tela de cadastro de usuário.");
        window.location.href = "TelaCadastroUsuario.html"; 
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
