// FUNÇÕES DO DASHBOARD
async function atualizarDadosUsuario() {
    const token = localStorage.getItem("token");
    const nome = document.getElementById("config_nome").value;
    const senha = document.getElementById("config_senha").value;

    if (!nome) {
        alert("O nome é obrigatório.");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:5000/usuario/atualizar", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ nome, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Dados atualizados com sucesso!");
            localStorage.setItem("usuario_nome", nome);
            document.getElementById("user_nome").textContent = nome;
            document.getElementById("config_senha").value = "";
        } else {
            alert(dados.error || "Erro ao atualizar dados.");
        }

    } catch (erro) {
        console.error("Erro ao atualizar usuário:", erro);
        alert("Erro na conexão com o servidor.");
    }
}

async function carregarTarefas() {
    const token = localStorage.getItem("token");
    const url = "http://localhost:5000/tarefas";

    try {
        const resposta = await fetch(url, {
            method: "GET",
            headers: { "Authorization": token }
        });

        const dados = await resposta.json();
        const lista = document.getElementById("lista-tarefas-container");
        lista.innerHTML = "";

        if (resposta.status === 200 && dados.tarefas.length > 0) {
            dados.tarefas.forEach(tarefa => {
                const li = document.createElement("li");
                li.classList.add("tarefa-item");
                if (tarefa.status === "concluida") li.classList.add("concluida");

                li.innerHTML = `
                    <div class="conteudo-tarefa">
                        <strong>${tarefa.titulo}</strong><br>
                        ${tarefa.descricao}<br>
                        Categoria: ${tarefa.categoria}<br>
                        Status: ${tarefa.status} - Prazo: ${formatarData(tarefa.prazo)}
                    </div>
                    <div>
                        <button onclick="excluirTarefa(${tarefa.id})">
                            <box-icon type='solid' name='trash' color="white"></box-icon>
                        </button>
                        <button onclick="editarTarefa(${JSON.stringify(tarefa).replace(/"/g, '&quot;')})">
                            <box-icon type='solid' name='edit-alt' color="white"></box-icon>
                        </button>
                        ${
                            tarefa.status !== "concluida"
                                ? `<button onclick="marcarConcluida(${tarefa.id})">
                                    <box-icon name='list-check' color="white"></box-icon></button>`
                                : ""
                        }
                    </div>
                `;

                lista.appendChild(li);
            });
        } else if (resposta.status === 204) {
            lista.innerHTML = "<li>Nenhuma tarefa cadastrada.</li>";
        } else {
            lista.innerHTML = "<li>Nenhuma tarefa cadastrada.</li>";
        }

    } catch (erro) {
        console.error("Erro ao carregar tarefas:", erro);
        alert("Erro na conexão com o servidor.");
    }
}

async function cadastrarTarefa() {
    const token = localStorage.getItem("token");
    const tarefa = {
        titulo: document.getElementById("titulo").value,
        descricao: document.getElementById("descricao").value,
        categoria: document.getElementById("categoria").value,
        prazo: document.getElementById("prazo").value,
        status: document.getElementById("status").value
    };

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(tarefa.prazo);

    if (tarefa.prazo && dataSelecionada < hoje) {
        alert("A data da tarefa não pode ser anterior à data de hoje.");
        return;
    }

    const url = tarefaEmEdicao
        ? `http://localhost:5000/tarefas/update/${tarefaEmEdicao}`
        : "http://localhost:5000/tarefas/create";

    const metodo = tarefaEmEdicao ? "PUT" : "POST";

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(tarefa)
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            document.getElementById("form_tarefa").reset();
            tarefaEmEdicao = null;
            carregarTarefas();
        } else {
            alert(dados.error || "Erro ao salvar tarefa.");
        }

    } catch (erro) {
        console.error("Erro ao salvar tarefa:", erro);
        alert("Erro na conexão com o servidor.");
    }
}

function editarTarefa(tarefa) {
    document.getElementById("titulo").value = tarefa.titulo;
    document.getElementById("descricao").value = tarefa.descricao;
    document.getElementById("categoria").value = tarefa.categoria;
    document.getElementById("prazo").value = tarefa.prazo || "";
    document.getElementById("status").value = tarefa.status;
    tarefaEmEdicao = tarefa.id;
}

async function excluirTarefa(id) {
    if (!confirm("Deseja realmente excluir esta tarefa?")) return;

    const token = localStorage.getItem("token");
    const url = `http://localhost:5000/tarefas/delete/${id}`;

    try {
        const resposta = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        if (resposta.ok) {
            carregarTarefas();
        } else {
            const dados = await resposta.json();
            alert(dados.error || "Erro ao excluir tarefa.");
        }

    } catch (erro) {
        console.error("Erro ao excluir tarefa:", erro);
        alert("Erro na conexão com o servidor.");
    }
}

async function marcarConcluida(id) {
    const token = localStorage.getItem("token");
    const urlGet = `http://localhost:5000/tarefas/details/${id}`;
    const urlUpdate = `http://localhost:5000/tarefas/update/${id}`;

    try {
        const respostaGet = await fetch(urlGet);
        const dados = await respostaGet.json();
        const tarefa = dados.tarefa;

        tarefa.status = "concluida";

        const resposta = await fetch(urlUpdate, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(tarefa)
        });

        if (resposta.ok) {
            carregarTarefas();
        } else {
            alert("Erro ao concluir tarefa.");
        }

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao conectar com o servidor.");
    }
}

function formatarData(dataStr) {
    if (!dataStr) return "Sem prazo";
    const dataUtc = new Date(dataStr);
    const offsetMs = 3 * 60 * 60 * 1000;
    const dataBr = new Date(dataUtc.getTime() - offsetMs);
    return dataBr.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

async function carregarCategorias() {
    const categorias = ["Pessoal", "Trabalho", "Estudo", "Casa", "Urgente"];
    const lista = document.getElementById("lista-categorias");
    lista.innerHTML = "";

    categorias.forEach(categoria => {
        const li = document.createElement("li");
        li.textContent = categoria;
        li.classList.add("categoria-item");
        li.style.cursor = "pointer";
        li.addEventListener("click", () => filtrarTarefasPorCategoria(categoria));
        lista.appendChild(li);
    });
}

async function filtrarTarefasPorCategoria(categoriaSelecionada) {
    const token = localStorage.getItem("token");
    const url = "http://localhost:5000/tarefas";

    try {
        const resposta = await fetch(url, {
            method: "GET",
            headers: { "Authorization": token }
        });

        const dados = await resposta.json();
        const lista = document.getElementById("tarefas-filtradas-container");
        lista.innerHTML = "";

        if (resposta.status === 200) {
            const tarefasFiltradas = dados.tarefas.filter(t => t.categoria === categoriaSelecionada);

            if (tarefasFiltradas.length === 0) {
                lista.innerHTML = "<li>Nenhuma tarefa nessa categoria.</li>";
                return;
            }

            tarefasFiltradas.forEach(tarefa => {
                const li = document.createElement("li");
                li.classList.add("tarefa-item");
                if (tarefa.status === "concluida") li.classList.add("concluida");

                li.innerHTML = `
                    <div class="conteudo-tarefa">
                        <strong>${tarefa.titulo}</strong>
                        <p>${tarefa.descricao}</p>
                        <p>Status: ${tarefa.status} - Prazo: ${formatarData(tarefa.prazo)}</p>
                    </div>
                `;
                lista.appendChild(li);
            });

        } else {
            lista.innerHTML = "<li>Erro ao buscar tarefas.</li>";
        }

    } catch (erro) {
        console.error("Erro ao filtrar por categoria:", erro);
        alert("Erro ao conectar com o servidor.");
    }
}

function mostrarSecaoPrazo() {
    const todasSecoes = document.querySelectorAll("main section");
    todasSecoes.forEach(secao => secao.classList.add("hidden"));

    document.getElementById("secao-prazo").classList.remove("hidden");
    carregarTarefasPorPrazo();
}

async function carregarTarefasPorPrazo() {
    const token = localStorage.getItem("token");
    const url = "http://localhost:5000/tarefas";

    try {
    const resposta = await fetch(url, {
        method: "GET",
        headers: { "Authorization": token }
    });

    const dados = await resposta.json();
    const container = document.getElementById("lista-prazos-container");
    container.innerHTML = "";

    if (resposta.status === 200 && dados.tarefas.length > 0) {
        const tarefasPorData = {};

        dados.tarefas.forEach(tarefa => {
        const prazo = tarefa.prazo ? formatarData(tarefa.prazo) : "Sem prazo";
        if (!tarefasPorData[prazo]) tarefasPorData[prazo] = [];
        tarefasPorData[prazo].push(tarefa);
        });

        const datasOrdenadas = Object.keys(tarefasPorData).sort((a, b) => {
        if (a === "Sem prazo") return 1;
        if (b === "Sem prazo") return -1;
        return new Date(a) - new Date(b);
        });

        datasOrdenadas.forEach(data => {
        const bloco = document.createElement("li");
        bloco.innerHTML = `<h3>${data}</h3>`;
        
        tarefasPorData[data].forEach(tarefa => {
            const item = document.createElement("div");
            item.classList.add("tarefa-item");
            if (tarefa.status === "concluida") item.classList.add("concluida");

            item.innerHTML = `
            <strong>${tarefa.titulo}</strong><br>
            ${tarefa.descricao || "Sem descrição"}<br>
            Categoria: ${tarefa.categoria} - Status: ${tarefa.status}
            `;

            bloco.appendChild(item);
        });

        container.appendChild(bloco);
        });

    } else {
        container.innerHTML = "<li>Nenhuma tarefa encontrada.</li>";
    }
    } catch (erro) {
    console.error("Erro ao carregar tarefas por prazo:", erro);
    alert("Erro na conexão com o servidor.");
    }
}
