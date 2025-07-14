# Desafio Backend - Caio Anderson

Este projeto foi desenvolvido como solução para o desafio de backend, abordando a criação de uma API RESTful completa com autenticação, gestão de usuários, atividades, conquistas e preferências, além de integração com serviços como AWS S3 (via LocalStack) e PostgreSQL.

## Como rodar o projeto

### Com Docker

Para rodar o projeto via Docker Compose:

Vá até o caminho da pasta backend.
```bash
docker-compose up --build
```

Caso já tenha utilizado uma vez, utilize:
```bash
docker-compose up
```

### Variáveis de ambiente (.env)
#### Ao rodar com Docker, a .env pode estar assim:

DATABASE_URL="postgresql://admin:123@postgres-db:5432/full-stack-db?schema=public"
S3_ENDPOINT=http://localstack:4566
SECRET_KEY=cd9e49a22f658074357d540347d9c2a49265ec41f389d846812430e4666bf880

#### Caso não rode com o Docker, para o npm run dev (modo local) a .env deve estar assim:

DATABASE_URL="postgresql://admin:123@localhost:3008/full-stack-db?schema=public"
S3_ENDPOINT=http://localhost:4566
SECRET_KEY=cd9e49a22f658074357d540347d9c2a49265ec41f389d846812430e4666bf880

## Cobertura e requisitos do desafio
### Funcionalidades implementadas
### O projeto contempla todos os requisitos definidos no desafio, incluindo:

Autenticação com JWT

Criptografia de senha

Upload de imagens com S3 (via LocalStack)

Documentação com Swagger

Regras e validações de negócio

Soft delete de usuário

Sistema de nível, XP e conquistas

Definição de interesses

Check-in com código de confirmação

Cadastro e participação em atividades


## Autenticação

- **O usuário deve fornecer nome, e-mail, CPF e senha para se cadastrar.** 
Sim. Outras informações não serão validadas para o registro.

Está funcionando corretamente.

- **O e-mail e o CPF do usuário devem ser únicos na tabela de usuários no banco de dados.**  
A verificação é feita no momento do cadastro, impedindo duplicações.

Está funcionando corretamente.

- **A senha do usuário deve ser criptografada antes de ser salva no banco.**  
A senha é criptografada antes de ser passada para o banco de dados.

Está funcionando corretamente.

- **O usuário deve informar e-mail e senha corretos para fazer login.**  
A validação será feita e caso o usuário passe e-mail ou senha incorretos dará a sua devida resposta. Caso ele passe campos que não são exigidos, as informações serão apenas ignoradas. Mantendo assim apenas o pedido pelo e-mail e a senha.

Está funcionando corretamente.

- **Os endpoints protegidos por autenticação devem exigir o token obtido ao fazer login e bloquear requisições não autenticadas.**  
O sistema exige o token válido nas rotas protegidas. O token é retornado na rota `/auth/sign-in`, junto com os dados do usuário, conforme pedido.

Está funcionando corretamente.


## Gestão de Usuários

- **O usuário pode editar seus dados (nome, e-mail, senha e foto de perfil).**  
A edição de dados está liberada pela rota `/user/update`, exceto para o CPF (impossível de editar), e-mails já utilizados (poderá alterar apenas se o e-mail informado não existir no banco), achievements, nível e XP.

Está funcionando corretamente.

- **Enquanto o usuário não fizer o upload de uma foto de perfil, deve ser atribuída uma foto de perfil padrão a ele.**  
O sistema atribui automaticamente uma imagem padrão até que o usuário envie uma personalizada pela rota `/user/avatar`.

Está funcionando corretamente.

- **O usuário pode definir e alterar seus interesses.**  
Pela rota `/user/preferences/define` é possível atualizar os tipos de atividade de interesse. Podendo incluir nenhum, um ou vários tipos de atividade como preferência.

Está funcionando corretamente.

- **O usuário pode desativar sua conta (soft delete), tornando-a inutilizável.**  
Através da rota `/user/deactivate`, o usuário pode desativar sua conta, impossibilitando seu uso posterior em outras rotas.

Está funcionando corretamente.

- **O usuário pode ganhar experiência e subir de nível após acumular uma certa quantidade de experiência.**  
A lógica de XP e níveis foi implementada e vinculada a interações específicas no sistema.

Está funcionando corretamente.

- **O usuário pode receber conquistas/medalhas ao realizar certas ações, como participar de uma atividade pela primeira vez, criar uma atividade pela primeira vez e outros.**  
As conquistas são registradas automaticamente com base nas ações do usuário e estão definidas na `seed` executada ao iniciar o projeto.

Está funcionando corretamente.


## Atividades

- **O usuário pode criar atividades, informando título, descrição, tipo de atividade, imagem, data, local e visibilidade (pública ou privada).**  
Pela rota `/activities/new` o usuário pode criar atividades, onde poderá inserir as respectivas informações sobre a atividade (nome, descrição, tipo de atividade, imagem, data agendada, endereço com latitude e longitude e privacidade).

Está funcionando corretamente.

- **O usuário pode visualizar e se inscrever em atividades.**  
O usuário pode visualizar as atividades pelas rotas `/activities` ou `/activities/all` e se inscreve pela rota `/activities/{id}/subscribe`.

Está funcionando corretamente.

- **O usuário pode cancelar sua inscrição em uma atividade em que se inscreveu anteriormente.**  
Sim, porém somente poderá cancelar a inscrição caso ainda não tenha confirmado a participação via rota `/activities/{id}/check-in`.

Está funcionando corretamente.

- **O usuário deve ser capaz de filtrar as atividades pelo seu tipo, mostrando apenas as atividades cujo tipo seja correspondente ao tipo selecionado.**  
Sim. Há o parâmetro `typeId` nas rotas `/activities` e `/activities/all` para que o usuário insira o ID do tipo de atividade desejado. Caso ele não passe esse parâmetro, as atividades serão filtradas com base nas preferências definidas pelo próprio usuário.

Está funcionando corretamente.

- **Se não houver filtros selecionados, a listagem das atividades deve mostrar prioritariamente aquelas cujo tipo corresponda aos interesses do usuário.**  
O sistema utiliza os tipos preferidos pelo o usuário para filtrar as atividades listadas.

Está funcionando corretamente.

- **Em atividades privadas, a inscrição deve ser aprovada pelo criador.**  
A aprovação do usuário inscrito é feito na rota `/activities/{id}/approve` apenas pelo criador da atividade. Caso a atividade seja pública, a aprovação do usuário é automática após se inscrever. Se for privada, o criador da atividade precisa aprovar a inscrição para que o usuário seja inscrito na atividade.

Está funcionando corretamente.

- **As atividades podem ser editadas e excluídas (soft delete) pelo criador.**  
As atividades serão editadas pela rota `/activities/{id}/update` e excluídas pela rota `/activities/{id}/delete`, porém esta função apenas será feita pelo criador. Caso o participante ou um usuário que não esteja participando da atividade tente editar ou excluir a atividade retornará uma resposta de erro.

Está funcionando corretamente.

- **Os participantes podem fazer check-in via código de confirmação. Ao fazer o check-in, ambos o participante e o criador recebem certa quantidade de experiência.**  
O check-in via código de confirmação é feito na rota `/activities/{id}/check-in`, colocando como parâmetro o id da atividade e enviando como resposta o código de confirmação que é obtido nas informações sobre a atividade. A lógica de experiência é aplicada tanto para quem cria quanto para quem participa da atividade confirmando presença.

Está funcionando corretamente.

- **O criador pode concluir a atividade, não permitindo novas solicitações ou confirmações (check-in) de participação.**  
A função de conclusão da atividade é feita apenas pelo criador na rota `/activities/{id}/conclude`. Após a conclusão, a atividade se torna inacessível para novas interações, como check-in ou subscribe.

Está funcionando corretamente.


### Validações

a. **Todos os campos obrigatórios devem ser validados nas requisições (E1)**

Está funcionando corretamente.

b. **Não devem ser aceitas imagens cujo formato não seja PNG ou JPG (E2)**

Está funcionando corretamente.

c. **Não deve ser possível cadastrar um usuário com e-mail ou CPF já existentes (E3)**

Está funcionando corretamente.

d. **O e-mail e a senha do usuário devem ser validados ao fazer login (E4, E5)**

Está funcionando corretamente.

e. **O usuário não pode editar seu CPF**

Está funcionando corretamente.

f. **Não deve ser possível realizar quaisquer ações protegidas com uma conta desativada (E6)**

Está funcionando corretamente.

g. **O usuário não pode se inscrever mais de uma vez na mesma atividade (E7)**

Está funcionando corretamente.

h. **Ao buscar as atividades disponíveis para inscrição, não devem ser retornadas atividades que foram concluídas ou excluídas**

Está funcionando corretamente.

i. **Apenas o criador da atividade pode visualizar o código de confirmação de participação da mesma**

Está funcionando corretamente.

j. **O criador de uma atividade não pode se inscrever nela como participante (E8)**

Está funcionando corretamente.

k. **O participante só pode fazer o check-in em uma atividade se for um participante aprovado da mesma (E9)**

Está funcionando corretamente.

l. **O check-in só pode ser realizado com o código correto (E10)**

Está funcionando corretamente.

m. **Não deve ser possível fazer o check-in múltiplas vezes em uma atividade (E11)**

Está funcionando corretamente.

n. **Não deve ser possível se inscrever ou fazer o check-in em uma atividade que já tenha sido concluída (E12, E13)**

Está funcionando corretamente.

o. **Apenas o criador da atividade deve ser capaz de editá-la, concluí-la, excluí-la e aprovar a participação de participantes (E14, E15, E16, E17)**

Está funcionando corretamente.

p. **O participante não pode se desinscrever da atividade após confirmar sua presença (E18)**

Está funcionando corretamente.


### Testes unitários

a. **As camadas de services e controllers deve possuir cobertura de testes unitários.**

Está funcionando corretamente, porém o arquivo activityController.test.ts teve diversas falhas ao testar com o Jest e como o prazo de entrega estava próximo não tive como corrigí-las.

### Segurança

a. **Senhas devem ser criptografadas.**

Está funcionando corretamente.

b. **Autenticação implementada com tokens JWT.**

Está funcionando corretamente.

c. **Controle de acesso a endpoints protegidos.**

Está funcionando corretamente.

### API e Documentação

a. **Todos os endpoints devem ser documentados utilizando o Swagger.**

Está funcionando corretamente.

### Infraestrutura

a. **Armazenamento de imagens através do LocalStack.**

Está funcionando corretamente.

b. **Utilizar Docker para gerar uma imagem executável da aplicação.**

Está funcionando corretamente.

### Outros

a. **O projeto deve conter um README com instruções para execução da aplicação.**

Feito!


### Diferenciais exigidos:
− **Testes unitários e cobertura**
Feito, exceto em um arquivo.

− **Docker**
Sendo utilizado e funcionando perfeitamente.

− **Sistema de validação de campos nos objetos enviados nas requisições**
Feito

− **Documentações completas.**
Feitas as documentações por completo.

− **Respostas de requisições com status HTTP adequado (200, 400, 500, etc).**
Feitas como foi solicitado.


## Análise sobre o projeto:

Ao analisar as aulas e o projeto que foi solicitado posso dizer que foi um projeto bem estruturado, trabalhado e informado. As ideias foram bem esclarecidas, o Igor deu uma ótima atenção à turma respondendo issues, tirando dúvidas nas aulas ao vivo e sendo bastante ativo.

Também posso afirmar que aprendi muito com este projeto e as aulas ao vivo, pois nunca havia utilizado Docker, Zod, Prisma e LocalStack em um projeto. Apenas visto em projetos e aulas no Youtube, porém sem praticar. Garanti neste módulo bastante experiência e conhecimento utilizando estas ferramentas para o projeto. Estudando bastante sobre as ferramentas e tirando diversas dúvidas consegui entender como funcionam as ferramentas e no que elas beneficiam no desenvolvimento de um projeto!
