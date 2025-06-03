cooffee/
├── assets/                  # Imagens, CSS e JS estáticos (correto)
├── backend/                 # Estrutura do backend
│   ├── src/                 
│   │   ├── config/          # Arquivos de configuração (ex: conexão com o banco de dados)
│   │   ├── controllers/     # Lógica das requisições (login, cadastro, pedidos etc.)
│   │   ├── routes/          # Arquivos com as rotas da aplicação
│   │   └── app.js           # Arquivo principal que configura e exporta o app Express
│   ├── .env                 # Variáveis de ambiente (host, senha, nome do banco etc.)
│   ├── server.js            # Inicializa o servidor (importa o app.js)
│   ├── package.json         # Declara as dependências e scripts do projeto
│   └── package-lock.json    # Arquivo de lock para dependências (gerado automaticamente)
├── dump/                    # Backup/exportação do banco de dados (ex: .sql)
├── js/                      # Scripts JS para o frontend (ex: chamadas fetch, manipulação DOM)
├── cadastro.html            # Página de cadastro de usuários
├── cardapio.html            # Página com os produtos disponíveis
├── checkout.html            # Página de finalização de pedido
├── dashboard.html           # Página principal do usuário logado
├── global.css               # Estilos globais da aplicação
├── index.html               # Página inicial do site
└── login.html               # Página de login
