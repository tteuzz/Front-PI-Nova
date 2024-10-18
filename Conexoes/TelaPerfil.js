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
            sessionStorage.setItem("usuarioLogado",data)
            window.location.reload();
        } else {
            data = await response.text();
            sessionStorage.setItem("usuarioLogado",data)
            window.location.reload();
        }
    }catch(error){
        alert("error")
    }   
}
