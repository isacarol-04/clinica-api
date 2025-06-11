# API de Agendamento de Consultas Médicas

Esta API permite gerenciar usuários (administradores, médicos e pacientes) e agendar consultas de forma prática e segura. Foi desenvolvida utilizando Node.js com TypeScript, Express, banco de dados PostgreSQL, ORM TypeORM e JWT para validação e autenticação.

## Funcionalidades Principais

* **Autenticação JWT**: Login seguro e renovação de tokens de acesso usando refresh tokens.
* **Gerenciamento de Usuários**: CRUD completo para usuários (Admins, Médicos e Pacientes), com restrições de acesso específicas para cada tipo de usuário.
* **Agendamento de Consultas**: CRUD de consultas médicas, respeitando regras de acesso e garantindo integridade dos dados.
* **Autorização por Papéis**: Controle de acesso para proteger dados sensíveis.
* **Validação de Dados**: Uso de Joi para garantir consistência dos dados recebidos.
* **Tratamento Centralizado de Erros**: Middleware global para respostas de erro padronizadas.

## Rotas Principais

* **Autenticação** ``` /api/v1/auth ```

    * ```POST /login ```
        Autentica usuário via email e senha. Retorna access token e refresh token JWT.
    * ```POST /refresh ```
        Renova o access token utilizando o refresh token válido.

* **Usuários** ``` /api/v1/users ```

    * **🔒 Acesso restrito: apenas Admins e Médicos**
    * ```GET / ```
        Lista todos os usuários cadastrados.
    * ```GET /:id ```
        Retorna os detalhes de um usuário específico. Médicos não podem acessar informações de Admins.
    * ```POST / ```
        Cria um novo usuário. Médicos podem criar apenas pacientes.
    * ```PUT /:id ```
        Atualiza os dados de um usuário. Usuários não podem alterar sua própria role, e Médicos não podem mudar a role de Pacientes.
    * ```DELETE /:id ```
        Exclui um usuário que não tenha agendamentos. Médicos não podem excluir Admins.

* **Agendamentos** ```/api/v1/appointments```

    * ```GET / ```
        Lista os agendamentos. Admins veem todos, Médicos veem apenas os seus, e Pacientes veem apenas os seus.
    * ```GET /:id ```
        Mostra detalhes de um agendamento específico. Admins veem todos, Médicos e Pacientes veem apenas os seus.
    * **🔒 Acesso restrito: apenas Admins e Médicos**
    * ```POST / ```
        Cria novo agendamento. 
    * ```PUT /:id ```
        Atualiza um agendamento existente. Admins podem atualizar todos, Médicos podem atualizar apenas os seus.
    * ```DELETE /:id ```
        Remove um agendamento. Admins podem excluir todos, Médicos podem excluir apenas os seus.

## Começando

### Pré-requisitos

* **Node.js** (versão 16 ou superior)
* **npm** ou **yarn** (gerenciador de pacotes)
* **Banco de dados (PostgreSQL)** — opcional se usar Docker
* **Docker e Docker Compose** — opcional para rodar tudo via container

###  Instalação

### Opção 1: Rodando localmente

1. Clone o repositório e entre na pasta:
   ```bash
   git clone https://github.com/isacarol-04/clinica-api.git
   cd clinica-api
   ```
2. Instale as dependências:
    ```bash
    npm install  # or yarn install
    ```
3. Configure as variáveis de ambiente no arquivo .env (copie de .env.example):
    ```bash
    DATABASE_URL=...
    JWT_SECRET=...
    PORT=3000
    ```
4. Garanta que seu banco esteja rodando e acessível.
5. Execute as migrações do banco (se aplicável):
    ```bash
    npm run migration:run
    ```
6. Rode o seed para popular o banco com dados iniciais (user admin):
    ```bash
    npm run seed
    ```
7. Inicie o servidor em modo desenvolvimento:
    ```bash
    npm run dev
    ```

### Opção 2: Rodando com Docker 

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/isacarol-04/clinica-api.git
   cd clinica-api
   ```
2. Instale as dependências:

    ```bash
    npm install  # or yarn install
    ```
3. Configure o arquivo .env com as variáveis necessárias (se precisar).
4. Rode o docker-compose para subir os containers.
    ```bash
    docker-compose up --build
    ```
5. Execute as migrações do banco (se aplicável):
    ```bash
    npm run migration:run
    ```
6. Rode o seed para popular o banco com dados iniciais (user admin):
    ```bash
    npm run seed
    ```
7. Inicie o servidor em modo desenvolvimento:
    ```bash
    npm run dev
    ```

Obs:
Após rodar o seed, utilize o usuário administrador criado para fazer o login inicial e acessar as rotas protegidas.