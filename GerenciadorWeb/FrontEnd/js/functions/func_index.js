// FUNÇÕES DE LOGIN E CADASTRO
async function ExecutarLogin() {
    const url = "http://localhost:5000/login";

    const email = loginForm.querySelector('input[placeholder="Endereço de e-mail"]').value;
    const senha = loginForm.querySelector('input[placeholder="Senha"]').value;

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            localStorage.setItem("token", dados.token);
            localStorage.setItem("usuario_nome", dados.usuario.nome);
            localStorage.setItem("usuario_email", dados.usuario.email);
            // window.location.href = "dashboard.html";
            document.body.classList.add("fade-out");
    
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 400);
            
        } else {
            alert(dados.message || 'Erro ao logar.');
        }

    } catch (erro) {
        alert('Erro na conexão com o servidor.');
        console.error(erro);
    }
}

// FAZ CADASTRO NO SISTEMA
async function ExecutarCadastro() {
    const url = "http://localhost:5000/cadastro";

    const nome = registerForm.querySelector('input[placeholder="Nome de usuário"]').value;
    const email = registerForm.querySelector('input[placeholder="Email"]').value;
    const senha = registerForm.querySelector('input[placeholder="Senha max(20)"]').value;

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();
        console.log("Resposta da API:", resposta.status, dados);

        if (resposta.status === 201) {
            alert('Conta criada com sucesso! Faça login.');

            document.body.classList.add('fade-out');

            setTimeout(() => {
                container.classList.remove('active');
                document.body.classList.remove('fade-out');
            }, 500);
        } else if (resposta.status === 400) {
            alert(dados.error || dados.message || 'Erro de validação.');
        } else {
            alert(dados.error || 'Erro inesperado ao cadastrar.');
        }

    } catch (erro) {
        console.error('Erro ao conectar com o servidor:', erro);
        alert('Erro na conexão com o servidor.');
    }
}