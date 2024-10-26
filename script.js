document.addEventListener("DOMContentLoaded", () => {
    // Funções de login e cadastro
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem("loggedIn", "true");
                window.location.href = "administracao.html";
            } else {
                alert("Usuário ou senha incorretos.");
            }
        });

        const registerBtn = document.getElementById("registerBtn");
        registerBtn.addEventListener("click", () => {
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
        });
    }

    // Função para verificar o login e ajustar os links de navegação
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const authLink = document.getElementById("authLink");
    const logoutLink = document.getElementById("logoutLink");
    if (isLoggedIn && authLink) {
        authLink.textContent = "Administração";
        authLink.href = "administracao.html";
        if (logoutLink) logoutLink.style.display = "inline";
    } else if (logoutLink) {
        logoutLink.style.display = "none";
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", () => {
            localStorage.removeItem("loggedIn");
            window.location.href = "index.html";
        });
    }

    // Função para exibir itens na página (usado em index.html e administracao.html)
    function displayItems() {
        const itemsContainer = document.getElementById("itensContainer");
        const items = JSON.parse(localStorage.getItem("items")) || [];

        itemsContainer.innerHTML = "";
        items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p><strong>Valor:</strong> R$ ${item.value}</p>
            `;
            itemsContainer.appendChild(card);
        });
    }

    // Exibir os itens na home se estiver na página index.html ou administracao.html
    if (document.getElementById("itensContainer")) {
        displayItems();
    }

    // Função para adicionar um novo item na página de administração
    const adminForm = document.getElementById("adminForm");
    if (adminForm) {
        adminForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Coleta dos dados do formulário
            const name = document.getElementById("itemName").value;
            const value = document.getElementById("itemValue").value;
            const description = document.getElementById("itemDescription").value;
            const imageFile = document.getElementById("itemImage").files[0];

            // Verificação de imagem e criação de URL
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function () {
                    const image = reader.result;

                    // Adiciona o item ao LocalStorage
                    const items = JSON.parse(localStorage.getItem("items")) || [];
                    items.push({ name, value, description, image });
                    localStorage.setItem("items", JSON.stringify(items));

                    // Limpa o formulário e exibe os itens atualizados
                    adminForm.reset();
                    displayItems();
                    alert("Item cadastrado com sucesso!");
                };
                reader.readAsDataURL(imageFile);
            } else {
                alert("Por favor, selecione uma imagem para o item.");
            }
        });
    }
});
