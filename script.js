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
        items.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p><strong>Valor:</strong> R$ ${item.value}</p>
                ${isLoggedIn ? `
                    <button onclick="editItem(${index})">Editar</button>
                    <button onclick="deleteItem(${index})">Excluir</button>
                ` : ''}
            `;
            itemsContainer.appendChild(card);
        });
    }

    // Função para adicionar um novo item na página de administração
    const adminForm = document.getElementById("adminForm");
    if (adminForm) {
        adminForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("itemName").value;
            const value = document.getElementById("itemValue").value;
            const description = document.getElementById("itemDescription").value;
            const imageFile = document.getElementById("itemImage").files[0];

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function () {
                    const image = reader.result;
                    const items = JSON.parse(localStorage.getItem("items")) || [];
                    items.push({ name, value, description, image });
                    localStorage.setItem("items", JSON.stringify(items));
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

    // Função para editar um item
    window.editItem = (index) => {
        const items = JSON.parse(localStorage.getItem("items")) || [];
        const item = items[index];

        document.getElementById("itemName").value = item.name;
        document.getElementById("itemValue").value = item.value;
        document.getElementById("itemDescription").value = item.description;
        
        const submitButton = document.querySelector("#adminForm button[type='submit']");
        submitButton.textContent = "Atualizar Item";
        submitButton.onclick = (e) => {
            e.preventDefault();
            item.name = document.getElementById("itemName").value;
            item.value = document.getElementById("itemValue").value;
            item.description = document.getElementById("itemDescription").value;

            if (document.getElementById("itemImage").files[0]) {
                const reader = new FileReader();
                reader.onload = function () {
                    item.image = reader.result;
                    localStorage.setItem("items", JSON.stringify(items));
                    displayItems();
                    adminForm.reset();
                    submitButton.textContent = "Cadastrar Item";
                    submitButton.onclick = null;
                };
                reader.readAsDataURL(document.getElementById("itemImage").files[0]);
            } else {
                localStorage.setItem("items", JSON.stringify(items));
                displayItems();
                adminForm.reset();
                submitButton.textContent = "Cadastrar Item";
                submitButton.onclick = null;
            }
        };
    };

    // Função para excluir um item
    window.deleteItem = (index) => {
        const items = JSON.parse(localStorage.getItem("items")) || [];
        items.splice(index, 1);
        localStorage.setItem("items", JSON.stringify(items));
        displayItems();
        alert("Item excluído com sucesso!");
    };

    if (document.getElementById("itensContainer")) {
        displayItems();
    }
});
