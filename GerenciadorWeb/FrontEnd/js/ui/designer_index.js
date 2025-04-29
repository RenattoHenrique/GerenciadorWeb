// FAZ APENAS EFEITO DE TRANSIÇÃO VISUAL NO FORMULÁRIO DE LOGIN/CADASTRO
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const registerForm = document.querySelector('.form-box.register form');
const loginForm = document.querySelector('.form-box.login form');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    await ExecutarCadastro();
});

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    await ExecutarLogin();
});