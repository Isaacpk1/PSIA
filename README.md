# PSIA — Pipeline de Notícias de IA

Workflow automatizado em **n8n** que coleta, processa e distribui as principais notícias sobre Inteligência Artificial do dia, usando Google News, GPT, Google Sheets, Telegram e Gmail.

---

## O que ele faz

Todo dia às **05h00**, o workflow:

1. Busca as 5 notícias mais recentes sobre IA no Google News (em português, Brasil)
2. Formata e envia os dados para um modelo de linguagem (GPT), que gera conteúdo editorial estruturado em HTML e JSON
3. Salva o resultado numa planilha do Google Sheets
4. Envia um resumo para o canal do **Telegram** `@PSIA_noticias_ia`
5. Envia um **e-mail personalizado** para cada assinante cadastrado que optou por receber notificações

---

## Fluxo passo a passo

```
Schedule Trigger (05h)
    └── RSS Read (Google News)
            └── Code in JavaScript (formata as 5 notícias)
                    └── Message a model (GPT gera HTML + JSON)
                            └── Append or update row in sheet (salva no Sheets)
                                    ├── Send a text message (envia no Telegram)
                                    └── Get row(s) in sheet (busca assinantes)
                                                └── Filter (Notif. Email = "Sim")
                                                            └── Send a message (envia e-mail via Gmail)
```

---

## Estrutura do Google Sheets

O workflow usa **uma planilha com duas abas**:

### Página1 — Assinantes
Lista de pessoas que recebem o e-mail diário.

| Coluna | Descrição |
|---|---|
| `Nome` | Nome do assinante (usado na saudação do e-mail) |
| `Email` | Endereço de e-mail para envio |
| `Notif. Email` | `Sim` para receber / qualquer outro valor para não receber |

### Página2 — Conteúdo Gerado
Armazena o conteúdo editorial gerado pela IA a cada execução.

| Coluna | Descrição |
|---|---|
| `Data` | Data da execução (formato `dd/MM/yyyy`, horário de Brasília) |
| `Main_HTML` | HTML da notícia principal (`<h2>` + `<p>`) |
| `Urgentes_HTML` | HTML com manchetes curtas em `<span>` |
| `Mais_Lidas_HTML` | HTML com 5 itens `<li>` para a seção "Mais Lidas" |
| `Grid_Noticias_JSON` | Array JSON com todas as notícias processadas |

---

## Estrutura do JSON gerado pela IA

Cada objeto dentro de `Grid_Noticias` contém:

```json
{
  "imagem": "URL da imagem ou placeholder",
  "url": "Link original da notícia",
  "titulo": "Título da notícia",
  "resumo": "Resumo de até 3 linhas",
  "categoria": "TECNOLOGIA",
  "tempo": "Há 2h"
}
```

---

## Pré-requisitos

Para usar este workflow, você precisa configurar as seguintes credenciais no n8n:

| Serviço | Tipo de Credencial | Utilização |
|---|---|---|
| **OpenAI** | API Key | Processar e gerar o conteúdo editorial |
| **Google Sheets** | OAuth2 | Salvar conteúdo e buscar assinantes |
| **Gmail** | OAuth2 | Enviar o e-mail diário aos assinantes |
| **Telegram** | Bot Token | Enviar mensagem para o canal |

---

## Como usar

1. Importe o arquivo `.json` do workflow no seu n8n
2. Configure todas as credenciais listadas acima
3. Na planilha do Google Sheets, crie as duas abas (`Página1` e `Página2`) com as colunas descritas
4. Atualize o ID da planilha nos nós **"Append or update row in sheet"** e **"Get row(s) in sheet"** com o ID da sua própria planilha
5. No nó **Telegram**, atualize o `chatId` com o username ou ID do seu canal
6. Ative o workflow — ele passará a rodar automaticamente às 05h00

---

## Exemplo de e-mail enviado

O e-mail é personalizado com o nome do assinante e lista todas as notícias do dia com:
- Categoria e tempo de publicação
- Título com link para a matéria completa
- Resumo da notícia
- Botão "Ler matéria completa"

---

## Tecnologias utilizadas

- [n8n](https://n8n.io/) — Orquestração do workflow
- [Google News RSS](https://news.google.com/rss) — Fonte das notícias
- [OpenAI GPT](https://openai.com/) — Geração de conteúdo editorial
- [Google Sheets](https://sheets.google.com/) — Armazenamento e lista de assinantes
- [Telegram Bot API](https://core.telegram.org/bots/api) — Canal de notícias
- [Gmail API](https://developers.google.com/gmail) — Envio de e-mails