document.getElementById('btnLogin').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert("⚠️ Por favor, preencha email e senha.");
        return;
    }

    const btn = document.getElementById('btnLogin');
    btn.innerText = "Verificando...";
    btn.disabled = true;

    // A SUA URL DO GOOGLE SCRIPT
    const URL_DO_GOOGLE_SCRIPT = 'https://script.google.com/macros/s/AKfycbxxXEoL9vjFSG3L56pyQ9hO6RXp8-aUVXmUbD9rm3GKQPrW194vK2JjWwGGbyHmeIMB/exec';

    // Montamos a URL enviando o email e a senha como parâmetros (Query Strings)
    const URL_COM_PARAMETROS = `${URL_DO_GOOGLE_SCRIPT}?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`;

    try {
        // O fetch padrão faz uma requisição do tipo GET (que chama a função doGet lá no Apps Script)
        const resposta = await fetch(URL_COM_PARAMETROS);
        const dados = await resposta.json();

        if (dados.sucesso) {
            // ⭐ A MÁGICA ACONTECE AQUI: Salva o "carimbo" no navegador
            localStorage.setItem('usuarioLogado', 'true');
            
            // Redireciona o usuário para a página inicial para ver o conteúdo VIP
            window.location.href = "/index.html"; 
        } else {
            // Se errou a senha ou o email não existe na planilha
            alert("❌ " + dados.mensagem);
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("❌ Erro de conexão. Verifique sua internet ou tente novamente mais tarde.");
    } finally {
        // Volta o texto do botão para o padrão do nosso novo HTML
        btn.innerText = "Entrar no Portal";
        btn.disabled = false;
    }
});