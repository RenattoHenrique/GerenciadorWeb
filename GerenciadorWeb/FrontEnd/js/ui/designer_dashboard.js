// FAZ APENAS EFEITO DE TRANSIÇÃO VISUAL NO MENU DO DASHBOARD
const sidebar = document.getElementById('sidebar');
const openButton = document.getElementById('open_btn');
const sideItems = document.querySelectorAll('.side-item');

openButton.addEventListener('click', () => {
    sidebar.classList.toggle('open-sidebar');
});

document.addEventListener('click', (event) => {
    const isClickInside = sidebar.contains(event.target) || openButton.contains(event.target);
    if (!isClickInside) {
        sidebar.classList.remove('open-sidebar');
    }
});

sideItems.forEach((item, index) => {
    item.addEventListener('click', function () {
        sideItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        const secoes = document.querySelectorAll('main section');
        secoes.forEach(secao => secao.classList.add("hidden"));

        const idsSecoes = [
            "secao-minhas-tarefas",
            "secao-categorias",
            "secao-prazo",
            "secao-configuracoes"
        ];
        const id = idsSecoes[index];
        mostrarSecao(id);
        
        if (id === "secao-categorias") carregarCategorias();
        if (id === "secao-prazo") mostrarSecaoPrazo();
        
    });
});

const darkToggle = document.getElementById('dark_mode_toggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

let tarefaEmEdicao = null;

document.addEventListener("DOMContentLoaded", () => {
    const nome = localStorage.getItem("usuario_nome");
    const email = localStorage.getItem("usuario_email");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("user_nome").textContent = nome;
    document.querySelector("#user_email span").textContent = email;
    
    const container = document.getElementById("user_email");
    const spanEmail = container.querySelector("span");
    
    requestAnimationFrame(() => {
        const overflow = spanEmail.scrollWidth - container.clientWidth;
    
        if (overflow > 0) {
            const velocidade = Math.min(Math.max(overflow * 40, 4000), 15000);
            spanEmail.style.setProperty('--duracao-scroll', `${velocidade}ms`);
            spanEmail.classList.add("scroll-email");
        } else {
            spanEmail.classList.remove("scroll-email");
            spanEmail.style.removeProperty('--duracao-scroll');
        }
    });
    
    carregarTarefas();

    document.getElementById("logout_btn").addEventListener("click", () => {
        document.body.classList.add("fade-out");
    
        setTimeout(() => {
            localStorage.clear();
            window.location.href = "index.html";
        }, 400);
    });    

    document.getElementById("form_tarefa").addEventListener("submit", async function (e) {
        e.preventDefault();
        await cadastrarTarefa();
    });
    
    document.querySelectorAll(".side-item")[2].addEventListener("click", mostrarSecaoPrazo);

    document.getElementById("config_nome").value = localStorage.getItem("usuario_nome");
    
    document.getElementById("form_configuracoes").addEventListener("submit", async function (e) {
        e.preventDefault();
        await atualizarDadosUsuario();
    
    });
});

function mostrarSecao(idSecao) {
    const secoes = document.querySelectorAll("main section");

    secoes.forEach(secao => {
    if (secao.id === idSecao) {
        secao.classList.remove("hidden");
        secao.style.opacity = 0;
        secao.style.transform = "translateY(10px)";
        requestAnimationFrame(() => {
        secao.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        secao.style.opacity = 1;
        secao.style.transform = "translateY(0)";
        });
    } else {
        secao.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        secao.style.opacity = 0;
        secao.style.transform = "translateY(10px)";
        setTimeout(() => {
        secao.classList.add("hidden");
        }, 300);
    }
    });
}
