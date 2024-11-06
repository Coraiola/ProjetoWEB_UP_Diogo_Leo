document.addEventListener("DOMContentLoaded", () => {
    // Funções de login e cadastro
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (!username || !password) {
                alert("Preencha todos os campos.");
                return;
            }

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

    if (isLoggedIn) {
        if (authLink) authLink.href = "administracao.html";
        if (logoutLink) logoutLink.style.display = "inline";
    } else {
        if (logoutLink) logoutLink.style.display = "none";
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", () => {
            localStorage.removeItem("loggedIn");
            window.location.href = "index.html";
        });
    }

    // Produtos fixos
    const fixedProducts = [
        { name: "Produto 1", value: "R$ 100,00", description: "Descrição do Produto 1" },
        { name: "Produto 2", value: "R$ 150,00", description: "Descrição do Produto 2" },
        { name: "Produto 3", value: "R$ 200,00", description: "Descrição do Produto 3" }
    ];

    // Função para exibir produtos fixos
    function displayFixedProducts(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = "";
            fixedProducts.forEach(product => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <h3>${product.name}</h3>
                    <p><strong>Valor:</strong> ${product.value}</p>
                    <p>${product.description}</p>
                `;
                container.appendChild(card);
            });
        }
    }

    // Função para exibir relatório de produtos, usuários e avaliações
    function displayReport() {
        const productTableBody = document.getElementById("reportProductsTableBody");
        const userTableBody = document.getElementById("reportUsersTableBody");
        const ratingTableBody = document.getElementById("reportRatingsTableBody");
        
        if (productTableBody) {
            productTableBody.innerHTML = "";
            fixedProducts.forEach(product => {
                const row = productTableBody.insertRow();
                row.insertCell(0).textContent = product.name;
                row.insertCell(1).textContent = product.value;
                row.insertCell(2).textContent = product.description;
            });
        }

        if (userTableBody) {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            userTableBody.innerHTML = "";
            users.forEach(user => {
                const row = userTableBody.insertRow();
                row.insertCell(0).textContent = user.username;
            });
        }

        if (ratingTableBody) {
            const ratings = JSON.parse(localStorage.getItem("ratings")) || [];
            ratingTableBody.innerHTML = "";
            ratings.forEach(rating => {
                const row = ratingTableBody.insertRow();
                row.insertCell(0).textContent = rating.name;
                row.insertCell(1).textContent = rating.stars;
                row.insertCell(2).textContent = rating.comment || "-";
            });
        }
    }

    // Função para enviar avaliação
    const ratingForm = document.getElementById("ratingForm");
    if (ratingForm) {
        ratingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("ratingName").value;
            const stars = document.getElementById("ratingStars").value;
            const comment = document.getElementById("ratingComment").value;

            if (!name || !stars) {
                alert("Preencha o nome e a avaliação.");
                return;
            }

            const ratings = JSON.parse(localStorage.getItem("ratings")) || [];
            ratings.push({ name, stars, comment });
            localStorage.setItem("ratings", JSON.stringify(ratings));
            alert("Avaliação enviada com sucesso!");
            ratingForm.reset();
        });
    }

    // Exibir produtos fixos na página inicial e relatório na página de relatório
    if (window.location.pathname.includes("index.html")) {
        displayFixedProducts("itensContainer");
    } else if (window.location.pathname.includes("relatorio.html")) {
        if (isLoggedIn) {
            displayReport();
        } else {
            alert("Você precisa estar logado para ver o relatório.");
            window.location.href = "login.html";
        }
    }
});
