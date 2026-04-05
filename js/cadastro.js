document.getElementById('btnCadastro').addEventListener('click', async () => {
    // 1. Capturar os valores dos campos principais
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('novoEmail').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const senha = document.getElementById('novaSenha').value;

    // Capturar opções de rádio (Agora apenas Notificação por Email)
    const notifEmail = document.querySelector('input[name="notifEmail"]:checked').value;

    // 2. VALIDAÇÕES DOS CAMPOS
    // Verifica se algum campo está vazio
    if (!nome || !email || !telefone || !senha) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return; // Interrompe a execução aqui
    }

    // Validação de formato de E-mail (usa uma Expressão Regular simples)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert("⚠️ Por favor, insira um endereço de e-mail válido.");
        return;
    }

    // Validação de Telefone (verifica se tem pelo menos 10 ou 11 números)
    // Remove tudo que não for número para testar
    const numerosTelefone = telefone.replace(/\D/g, ''); 
    if (numerosTelefone.length < 10) {
        alert("O telefone deve conter DDD e o número válido (ex: 11987654321).");
        return;
    }

    // Validação de Senha (mínimo de 6 caracteres)
    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    // 3. Monta o objeto que será enviado para a planilha
    const dadosFormulario = {
        nome: nome,
        email: email,
        telefone: telefone,
        senha: senha,
        notifEmail: notifEmail
        // O zap foi removido daqui!
    };

    // SUA URL DO GOOGLE APPS SCRIPT MANTIDA INTACTA
    const URL_DO_GOOGLE_SCRIPT = 'https://script.google.com/macros/s/AKfycbxxXEoL9vjFSG3L56pyQ9hO6RXp8-aUVXmUbD9rm3GKQPrW194vK2JjWwGGbyHmeIMB/exec';

    // 4. ENVIO PARA O GOOGLE SHEETS    
    const btn = document.getElementById('btnCadastro');
    btn.innerText = "Cadastrando...";
    btn.disabled = true;

    try {
        const resposta = await fetch(URL_DO_GOOGLE_SCRIPT, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' 
            },
            body: JSON.stringify(dadosFormulario)
        });

        if (resposta.ok) {
            alert('Cadastro realizado com sucesso!');
            // Limpa os campos após o sucesso
            document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]').forEach(input => input.value = '');
            
            // Reseta o radio button do email para "Não"
            document.getElementById('naoNotifEmail').checked = true;
        } else {
            alert('Ocorreu um erro ao cadastrar. Tente novamente.');
        }
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        alert('Erro de conexão. Verifique sua internet.');
    } finally {
        btn.innerText = "Cadastrar";
        btn.disabled = false;
    }
});