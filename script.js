document.addEventListener("DOMContentLoaded", () => {
    // Funções de autenticação
    setupAuthHandlers();

    // Página de administração: exibição e manipulação de itens
    if (window.location.pathname.includes("administracao.html")) {
        setupAdminPage();
    }

    // Página de relatório: exibição de dados
    if (window.location.pathname.includes("relatorio.html")) {
        setupReportPage();
    }

    // Página inicial: exibição de produtos fixos e cadastrados
    if (window.location.pathname.includes("index.html")) {
        displayItems(false);
        setupReviewForm();
    }
});

/**
 * Funções de autenticação e navegação
 */
function setupAuthHandlers() {
    const loginForm = document.getElementById("loginForm");
    const authLink = document.getElementById("authLink");
    const adminLink = document.getElementById("adminLink");
    const logoutLink = document.getElementById("logoutLink");

    // Login
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleLogin();
        });

        document.getElementById("registerBtn").addEventListener("click", handleRegistration);
    }

    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    // Ajustar links e exibição com base no login
    if (authLink) {
        authLink.style.display = isLoggedIn ? "none" : "inline";
    }

    if (adminLink) {
        adminLink.style.display = isLoggedIn ? "inline" : "none";
    }

    if (logoutLink) {
        logoutLink.style.display = isLoggedIn ? "inline" : "none";
        logoutLink.addEventListener("click", () => {
            localStorage.removeItem("loggedIn");
            window.location.href = "index.html";
        });
    }
}

function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html"; // Redireciona para a página inicial após o login
    } else {
        alert("Usuário ou senha incorretos.");
    }
}

function handleRegistration() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Cadastro realizado com sucesso!");
    } else {
        alert("Preencha todos os campos.");
    }
}

/**
 * Página de administração
 */
function setupAdminPage() {
    const adminForm = document.getElementById("adminForm");
    if (adminForm) {
        adminForm.style.display = "block";
        adminForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleItemSubmission(adminForm);
        });

        displayItems(true);
    }
}

function handleItemSubmission(form) {
    const name = document.getElementById("itemName").value;
    const value = document.getElementById("itemValue").value;
    const description = document.getElementById("itemDescription").value;
    const imageFile = document.getElementById("itemImage").files[0];

    if (name && value && description && imageFile) {
        const items = JSON.parse(localStorage.getItem("items")) || [];
        
        // Verificar se o item já existe (não permitir duplicação)
        const existingItem = items.find(item => item.name.toLowerCase() === name.toLowerCase());
        if (existingItem) {
            alert("Este item já foi cadastrado!");
            return;
        }

        const reader = new FileReader();
        reader.onload = function () {
            const image = reader.result;
            items.push({ name, value, description, image });
            localStorage.setItem("items", JSON.stringify(items));
            form.reset();
            displayItems(true); // Atualiza a lista de itens na administração
            alert("Item cadastrado com sucesso!");
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert("Por favor, preencha todos os campos obrigatórios e selecione uma imagem.");
    }
}

/**
 * Página de relatório
 */
function setupReportPage() {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (!isLoggedIn) {
        alert("Você precisa estar logado para acessar o relatório.");
        window.location.href = "login.html";
        return;
    }

    displayReportData();
}

function displayReportData() {
    const avaliacoesTable = document.getElementById("avaliacoesTable").getElementsByTagName("tbody")[0];
    const produtosTable = document.getElementById("produtosTable").getElementsByTagName("tbody")[0];
    const usuariosTable = document.getElementById("usuariosTable").getElementsByTagName("tbody")[0];

    const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];
    const produtos = JSON.parse(localStorage.getItem("items")) || [];
    const usuarios = JSON.parse(localStorage.getItem("users")) || [];

    // Preencher tabelas
    populateTable(avaliacoesTable, avaliacoes, ["name", "rating", "comment"]);
    populateTable(produtosTable, produtos, ["name", "value", "description"]);
    populateTable(usuariosTable, usuarios, ["username", "email"]);
}

function populateTable(table, data, fields) {
    table.innerHTML = "";
    data.forEach(item => {
        const row = table.insertRow();
        fields.forEach(field => {
            const cell = row.insertCell();
            cell.textContent = item[field] || "";
        });
    });
}

/**
 * Exibir itens na página inicial ou administração
 */
function displayItems(isAdmin) {
    const itemsContainer = document.getElementById("itensContainer");
    const items = JSON.parse(localStorage.getItem("items")) || [];

    if (itemsContainer) {
        itemsContainer.innerHTML = ""; // Limpa o conteúdo antes de adicionar novos itens

        // Verifica se há itens para exibir
        if (items.length > 0) {
            items.forEach((item, index) => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = ` 
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p><strong>Valor:</strong> R$ ${item.value}</p>
                    ${isAdmin ? ` 
                        <button onclick="editItem(${index})">Editar</button>
                        <button onclick="deleteItem(${index})">Excluir</button>
                    ` : ''} 
                `;
                itemsContainer.appendChild(card);
            });
        } else {
            const noItemsMessage = document.createElement("p");
            noItemsMessage.textContent = "Nenhum produto disponível.";
            itemsContainer.appendChild(noItemsMessage);
        }
    }
}

/**
 * Editar e excluir itens
 */
window.editItem = function (index) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const item = items[index];

    // Preencher os campos do formulário com os dados do item
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemValue").value = item.value;
    document.getElementById("itemDescription").value = item.description;

    // Trocar o texto do botão para "Atualizar Item"
    const submitButton = document.querySelector("#adminForm button[type='submit']");
    submitButton.textContent = "Atualizar Item";

    // Atualizar o item no localStorage ao clicar no botão de "Atualizar Item"
    document.getElementById("adminForm").onsubmit = function (e) {
        e.preventDefault();

        // Atualizar os dados do item com os valores dos campos
        item.name = document.getElementById("itemName").value;
        item.value = document.getElementById("itemValue").value;
        item.description = document.getElementById("itemDescription").value;

        // Atualizar a imagem do item se uma nova for selecionada
        const imageFile = document.getElementById("itemImage").files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function () {
                item.image = reader.result;
                localStorage.setItem("items", JSON.stringify(items));
                displayItems(true);
                alert("Item atualizado com sucesso!");  // Alerta de sucesso na atualização

                // Resetar o formulário para o estado de cadastro
                resetForm(submitButton);
            };
            reader.readAsDataURL(imageFile);
        } else {
            localStorage.setItem("items", JSON.stringify(items));
            displayItems(true);
            alert("Item atualizado com sucesso!");  // Alerta de sucesso na atualização

            // Resetar o formulário para o estado de cadastro
            resetForm(submitButton);
        }
    };
};

// Função para resetar o formulário e o botão
function resetForm(submitButton) {
    const form = document.getElementById("adminForm");
    form.reset();  // Limpa os campos do formulário
    submitButton.textContent = "Cadastrar Item";  // Restaura o texto original do botão de cadastro
    // Redefine o evento de submit para cadastrar novos itens
    document.getElementById("adminForm").onsubmit = (e) => {
        e.preventDefault();
        handleItemSubmission(form);
    };
}

window.deleteItem = function (index) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    displayItems(true);  // Atualiza a lista de itens após a exclusão
    alert("Item excluído com sucesso!");  // Alerta de exclusão
};

/**
 * Formulário de avaliação
 */
// Função para configurar o formulário de avaliações na página inicial
function setupReviewForm() {
    const form = document.getElementById("avaliacaoForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            handleReviewSubmission();
        });
    }
}

function handleReviewSubmission() {
    const nome = document.getElementById("nome").value;
    const nota = document.getElementById("nota").value;
    const comentario = document.getElementById("comentario").value;

    // Verifica se os campos obrigatórios foram preenchidos
    if (!nome || !nota) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];
    avaliacoes.push({ name: nome, rating: nota, comment: comentario });
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));

    // Limpa o formulário e exibe mensagem de agradecimento
    document.getElementById("avaliacaoForm").reset();
    alert("Obrigado pela sua avaliação!");
}

