async function criarUsuario(){
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    let cpf = document.getElementById("cpf").value;
    let genero = document.getElementById("genero").value;
    let dataNascimento = document.getElementById("dataNascimento").value;
    let grupo = "usuario"; 

    const url = `http://localhost:8015/user/`;
    
    const usuario = {
        usuaNmUsuario: nome,
        usuaDsEmail: email,
        usuaDsPassword: senha,
        usuaDsCPF: cpf,
        usuaCdGrupo: grupo,
        usuaGenero: genero,
        usuaDataNascimento: dataNascimento
    }

    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            alert("usuario nao foi cadastrado");
        }
        const user  = await response.json()
        console.log(user)
    }catch(error){
        alert("error")
    }
    
}

async function cadastroEndereco(usuario) {
    console.log(usuario)
    let cep = document.getElementById("cep").value;
    let logradouro = document.getElementById("logradouro").value;
    let numero = document.getElementById("numero").value;
    let complemento = document.getElementById("complemento").value;
    let bairro = document.getElementById("bairro").value;
    let cidade = document.getElementById("cidade").value;
    let uf = document.getElementById("uf").value;


    const endereco = {
        logradouro: logradouro,
        numero: numero,
        complemento: complemento,
        bairro: bairro,
        cidade: cidade,
        cep: cep,
        uf: uf,
        enderecoPrincipal: true,
        fkUser: usuario.idUsuario
    }

}