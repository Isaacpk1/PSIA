document.addEventListener("DOMContentLoaded", async () => {
    
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
    const areaExclusiva = document.getElementById('areaExclusiva');
    const headerActions = document.getElementById('headerActions');

    if (estaLogado) {
        // Mostra a área de relatórios VIP
        if (areaExclusiva) areaExclusiva.style.display = 'block';
        
        // Troca os botões do cabeçalho
        if (headerActions) {
            headerActions.innerHTML = `
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--mid); margin-right: 0.5rem;">Olá, Assinante!</span>
                <button id="btnSair" class="btn-outline">Sair da Conta</button>
            `;
            
            // Adiciona a função de Logout (Sair)
            document.getElementById('btnSair').addEventListener('click', () => {
                localStorage.removeItem('usuarioLogado'); // Tira o "carimbo"
                window.location.reload(); // Atualiza a página para esconder as coisas VIP
            });
        }
    }

    // 2. MAPEAMENTO DE ELEMENTOS (Com verificação defensiva)
    const divNoticia = document.getElementById('conteudoNoticia');
    const divUrgentes = document.getElementById('breakingNews');
    const divMaisLidas = document.getElementById('maisLidas');
    const divGrid = document.getElementById('gridNoticias'); 

    // URL do Google Apps Script
    const URL_DO_GOOGLE_SCRIPT = 'https://script.google.com/macros/s/AKfycbxxXEoL9vjFSG3L56pyQ9hO6RXp8-aUVXmUbD9rm3GKQPrW194vK2JjWwGGbyHmeIMB/exec'; 
    const urlComParametro = `${URL_DO_GOOGLE_SCRIPT}?acao=getNoticias`;

    // 3. ESTADO DE CARREGAMENTO (Feedback visual elegante)
    if (divNoticia) {
        divNoticia.innerHTML = `
            <div style="text-align: center; margin: 4rem 0;">
                <h2 style="font-family: 'Playfair Display', serif; color: var(--mid);">
                    ⏳ Sincronizando com o Agente PSIA...
                </h2>
                <p style="color: var(--muted); font-size: 0.9rem; margin-top: 0.5rem;">Buscando as últimas atualizações do ecossistema de IA</p>
            </div>
        `;
    }

    try {
        // 4. REQUISIÇÃO À API
        const resposta = await fetch(urlComParametro);
        
        // Verifica se o servidor respondeu com erro (ex: 500 ou 404)
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        // 5. VALIDAÇÃO DE SUCESSO DA RESPOSTA
        if (dados && dados.sucesso) {
            
            // --- INJEÇÃO: Notícia Principal ---
            if (divNoticia) {
                divNoticia.innerHTML = dados.htmlPrincipal || '<p style="text-align:center; color:var(--muted);">Nenhuma notícia principal no momento.</p>';
            }
            
            // --- INJEÇÃO: Fita de Urgentes (Duplicada para animação CSS infinita) ---
            if (divUrgentes && dados.htmlUrgentes) {
                divUrgentes.innerHTML = dados.htmlUrgentes + dados.htmlUrgentes;
            }
            
            // --- INJEÇÃO: Mais Lidas (O CSS blindado fará a formatação) ---
            if (divMaisLidas && dados.htmlMaisLidas) {
                divMaisLidas.innerHTML = dados.htmlMaisLidas;
            }

            // --- INJEÇÃO: Grid de Notícias (Motor G1 Style) ---
            if (divGrid) {
                divGrid.innerHTML = ''; // Limpa o carregamento anterior
                
                // Verifica se a IA realmente mandou uma lista (array) válida
                if (Array.isArray(dados.dadosGrid) && dados.dadosGrid.length > 0) {
                    
                    dados.dadosGrid.forEach(noticia => {
                        // Valores Fallback (Segurança caso a IA envie dados vazios)
                        const imgUrl = noticia.imagem || 'https://placehold.co/600x400/1a1a1a/ffffff?text=IA+News';
                        const linkUrl = noticia.url || '#';
                        const titulo = noticia.titulo || 'Notícia sem título';
                        const resumo = noticia.resumo || 'Resumo indisponível no momento.';
                        const categoria = noticia.categoria || 'MERCADO';
                        const tempo = noticia.tempo || 'Atualizado recentemente';

                        // Montagem do Card (Com segurança rel="noopener noreferrer")
                        divGrid.innerHTML += `
                            <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="card-noticia" style="text-decoration: none; color: inherit; display: block;">
                                <img class="img-noticia" 
                                     src="${imgUrl}" 
                                     alt="${titulo}" 
                                     onerror="this.onerror=null; this.src='https://placehold.co/600x400/1a1a1a/ffffff?text=Imagem+Indisponivel';">
                                <div class="card-info">
                                    <span class="label-categoria">${categoria}</span>
                                    <h3>${titulo}</h3>
                                    <p>${resumo}</p>
                                    <small>${tempo}</small>
                                </div>
                            </a>
                        `;
                    });

                } else {
                    // Fallback se a IA mandou array vazio
                    divGrid.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: var(--bg); border-radius: 8px;">
                            <p style="color: var(--muted);">Não há notícias adicionais para exibir no grid hoje.</p>
                        </div>
                    `;
                }
            }

        } else {
            // 6. TRATAMENTO DE RETORNO VAZIO DA PLANILHA (Sem notícias do dia)
            if (divNoticia) {
                divNoticia.innerHTML = `
                    <div style="text-align: center; padding: 3rem 0;">
                        <h2 style="font-family: 'Playfair Display', serif; color: var(--ink);">Sem publicações hoje 📰</h2>
                        <p style="margin-top: 1rem; color: var(--muted);">${dados?.mensagem || 'O Agente PSIA não registrou novas notícias para o dia de hoje. Volte mais tarde!'}</p>
                    </div>
                `;
            }
        }

    } catch (erro) {
        // 7. TRATAMENTO DE ERROS CRÍTICOS (CORS, Queda de rede, JSON inválido)
        console.error("Erro crítico ao carregar notícias:", erro);
        if (divNoticia) {
            divNoticia.innerHTML = `
                <div style="text-align: center; padding: 3rem 0; background: #fff5f5; border: 1px solid #ffebeb; border-radius: 8px;">
                    <h2 style="font-family: 'Playfair Display', serif; color: #dc2626;">Falha de Conexão 🔌</h2>
                    <p style="margin-top: 1rem; color: #4b5563;">Não foi possível estabelecer conexão com o servidor de notícias.</p>
                    <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Tentar Novamente
                    </button>
                </div>
            `;
        }
    }
});