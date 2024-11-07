document.addEventListener("DOMContentLoaded", () => {
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

    // Função para exibir produtos fixos na tabela de administração
    function displayAdminProducts() {
        const productsList = document.getElementById("productsList");
        const products = JSON.parse(localStorage.getItem("products")) || [
            { id: 1, name: "Produto 1", value: "R$ 100,00", description: "Descrição do Produto 1" },
            { id: 2, name: "Produto 2", value: "R$ 150,00", description: "Descrição do Produto 2" },
            { id: 3, name: "Produto 3", value: "R$ 200,00", description: "Descrição do Produto 3" }
        ];

        productsList.innerHTML = ""; // Limpa a tabela antes de exibir novamente
        products.forEach(product => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td><input type="text" id="productName${product.id}" value="${product.name}"></td>
                <td><input type="text" id="productValue${product.id}" value="${product.value}"></td>
                <td><input type="text" id="productDescription${product.id}" value="${product.description}"></td>
                <td>
                    <button onclick="updateProduct(${product.id})">Salvar</button>
                    <button onclick="deleteProduct(${product.id})">Excluir</button>
                </td>
            `;

            productsList.appendChild(row);
        });
    }

    // Função para atualizar um produto
    window.updateProduct = (id) => {
        const name = document.getElementById(`productName${id}`).value;
        const value = document.getElementById(`productValue${id}`).value;
        const description = document.getElementById(`productDescription${id}`).value;

        if (!name || !value || !description) {
            alert("Preencha todos os campos.");
            return;
        }

        const products = JSON.parse(localStorage.getItem("products")) || [];
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            products[productIndex] = { id, name, value, description };
            localStorage.setItem("products", JSON.stringify(products));
            alert("Produto atualizado com sucesso!");
        }
    };

    // Função para excluir um produto
    window.deleteProduct = (id) => {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const updatedProducts = products.filter(product => product.id !== id);

        localStorage.setItem("products", JSON.stringify(updatedProducts));
        alert("Produto excluído com sucesso!");
        displayAdminProducts(); // Atualiza a lista de produtos
    };

    // Exibe os produtos ao carregar a página de administração
    if (window.location.pathname.includes("administracao.html")) {
        displayAdminProducts();
    }

    // Gerenciamento do formulário de avaliação com nota
    const ratingForm = document.getElementById("avaliacaoForm");
    if (ratingForm) {
        const notaButtons = document.querySelectorAll("#nota button");
        const ratingInput = document.getElementById("rating");

        notaButtons.forEach(button => {
            button.addEventListener("click", () => {
                const rating = button.getAttribute("data-value");
                ratingInput.value = rating;

                notaButtons.forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
            });
        });

        ratingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("nome").value;
            const stars = ratingInput.value;
            const comment = document.getElementById("comentario").value;

            if (!name || !stars) {
                alert("Preencha o nome e a avaliação.");
                return;
            }

            const ratings = JSON.parse(localStorage.getItem("ratings")) || [];
            ratings.push({ name, stars, comment });
            localStorage.setItem("ratings", JSON.stringify(ratings));
            alert("Avaliação enviada com sucesso!");
            ratingForm.reset();
            notaButtons.forEach(btn => btn.classList.remove("selected"));
        });
    }

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
