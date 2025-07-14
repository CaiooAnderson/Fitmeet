# Desafio Frontend - Caio Anderson

Este projeto foi desenvolvido como solução para o desafio de frontend, abordando a continuidade do backend com sistema de validação na autenticação com Zod, criação de usuários, atividades, conquistas e preferências, além de integração com serviços como Geolocation (leaflet), abordando a utilização do TailwindCSS, Shadcn, React, Vite, React Hooks, React Router, TypeScript, HTML e CSS.

## Como rodar o projeto

### Utilizando o Docker fornecido pelo professor de back end Igor:

Aviso breve: (Conferir se alguma imagem não esteja reiniciando).

Vá até o caminho da pasta frontend.

```bash
docker-compose up
```

Caso esteja dando problema ao iniciar, utilize:

```bash
docker-compose down
```
e depois
```bash
docker-compose up
```

Caso o problema persista, tente removendo os volumes:

```bash
docker-compose down -v
```
e depois
```bash
docker-compose up
```

## Instale as dependências utilizando:
```bash
npm install --legacy-peer-deps
```

#### Após isto, utilize:

```bash
npm run dev
```

E rode no navegador possivelmente com a rota:

#### http://localhost:5173/

## Validações

### A aplicação deve garantir a validação correta de todos os requisitos mencionados neste documento, assegurando funcionalidade, usabilidade e conformidade com as melhores práticas de desenvolvimento.

## Login

### **O input de e-mail deve verificar se o e-mail informado pelo usuário e, se necessário, exibir as mensagens de erro**
### **O usuário deve ser capaz de esconder ou exibir a senha ao clicar no botão presente no input**
### **A senha deverá ter no mínimo 6 caracteres**
### **O formulário não deve ser enviado se algum dos campos obrigatórios não for preenchido**
### **Ao realizar o login com sucesso, o usuário deve ser redirecionado para a tela principal da aplicação**
### **O link para tela de cadastro deve redirecionar corretamente para a página de cadastro**

#### Resultado: Funcionando corretamente

### Adicionais na página de login (positivas)
#### Responsiva para todas as dimensões


## Cadastro

### **O input de CPF deve verificar se o valor informado é válido e, se necessário, exibir as mensagens de erro**
### **O input de e-mail deve verificar se o e-mail informado pelo usuário e, se necessário, exibir as mensagens de erro**
### **O usuário deve ser capaz de esconder ou exibir a senha ao clicar no botão presente no input**
### **A senha deverá ter no mínimo 6 caracteres**
### **O formulário não deve ser enviado se algum dos campos obrigatórios não for preenchido**
### **Ao realizar o cadastro com sucesso, o usuário deve ser redirecionado para a tela de login para realizar seu primeiro login**
### **O link para tela de login deve redirecionar corretamente para a página de login**

#### Resultado: Funcionando corretamente

### Adicionais na página de Cadastro (positivas)
#### Responsiva para todas as dimensões


## Seleção de preferências

### **Se o usuário ainda não tiver escolhido nenhuma preferência, sempre que o usuário acessar a aplicação, deverá ser exibido um modal com os tipos de atividade disponível na aplicação, para que o usuário possa definir seus interesses**
### **Se o usuário desejar, ele poderá pular essa escolha, fechando o modal e continuando a navegar normalmente**

#### Resultado: Funcionando corretamente

### Adicionais na Seleção de preferências
#### Ao selecionar o tipo de atividade no modal de preferências ele deixará o tipo de atividade com mais visibilidade de que foi selecionado.


## Página principal

### **Nas listas, não devem ser exibidas atividades encerradas ou canceladas.**
### **A lista de recomendações deve ser composta por algumas atividades com categorias pertencentes a lista de preferência do usuário. Caso o usuário não possua preferencias, a lista deve exibir atividades aleatórias**
### **Ao clicar em um dos tipos de atividade, deverá direcionar para a página com as atividades específicas para aquele tipo.**
### **Ao clicar em "ver mais" em alguma das seções de atividade, deverá redirecionar para a página específica daquele tipo de atividade**

#### Resultado: Funcionando corretamente


## Atividades por tipo

### **Nas listas, não devem ser exibidas atividades encerradas ou canceladas.**
### **Clicar no botão "ver mais" deve buscar as próximas 8 atividades e acrescentar ao final da lista de atividades.**
### **Se a quantidade inicial de atividades for menor que 16 ou se não houver mais atividades a serem exibidas ao clicar no botão de "ver mais", o botão deve ser removido da página.**

### Adicionais em Atividades por tipo (negativas)
#### A rota utilizada para carregar as atividades foi a activities/all, pois não consegui pela /activities. Creio que isto abaixe um pouco no desempenho do site.


## Nova atividade

### **O usuário deverá ver uma prévia da imagem após selecionada**
### **O usuário só deve poderá escolher um tipo de atividade**
### **A integração com a biblioteca de mapa para localização, deve estar funcional**
### **Por padrão, a atividade não necessitará de aprovação para participação**
### **O formulário não deve ser enviado se algum dos campos obrigatórios não for preenchido**

#### Resultado: Funcionando corretamente


## Editar atividade

### **Apenas o organizador poderá acessar este modal**
### **Os campos devem vir preenchidos corretamente com as informações da atividade**
### **Para cancelar uma atividade, o organizador poderá clicar em "cancelar"**

#### Resultado: Funcionando corretamente


## Detalhes da atividade (visão do participante)

### **Ao clicar em alguma das atividades, deverá ser exibido o modal de detalhes da atividade**
### **Se a lista de participantes for extensa, ela deverá ser limitada por scroll**
### **O usuário deve ser capaz de se inscrever na atividade ao clicar em "Participar"**
### **O botão deve permanecer desabilitado até que a resposta da requisição para o back-end seja recebida.**

#### Resultado: Funcionando corretamente


## Aguardando aprovação

### **Se for necessário aprovação para participação, o botão deverá ser desabilitado, até que o organizador valide a solicitação**

#### Resultado: Funcionando corretamente


## Inscrição negada

### **Se a solicitação de participação for negada, o botão deverá continuar desabilitado, impedindo que o usuário tente se cadastrar novamente**

#### Resultado: Funcionando corretamente


## Desinscrever da atividade

### **Após realizar sua inscrição com sucesso e ter sido aprovado para a participação, o botão deverá ser modificado para "Desinscrever"**
### **Ao clicar neste botão, o usuário deve ser capaz de se desinscrever da atividade**
### **O botão deve permanecer desabilitado até que a resposta da requisição para o back-end seja recebida.**

#### Resultado: Funcionando corretamente


## Detalhes da atividade (visão do organizador)

### **Somente o organizador da atividade deverá ver essa interface do modal**
### **Na lista de participantes, ele poderá aprovar ou reprovar um participante**
### **Clicando no botão "editar", o modal de edição deve substituir o modal de detalhes da atividade**

#### Resultado: Funcionando corretamente


## Encerrar atividade

### **30 minutos antes do início da atividade, o modal deverá exibir somente para o organizador o código de check-in.**
### **30 minutos antes do início da atividade, o organizador não poderá mais aprovar ou reprovar participantes**
### **O organizador deve conseguir encerrar a atividade a qualquer momento clicando no botão "encerrar atividade"**

#### Resultado: Funcionando corretamente


## Check-in

### **30 minutos antes da atividade começar, o usuário já poderá realizar seu checkin. Dessa forma, o modal de detalhes da atividade deverá substituir o botão de "desinscrever" pelo formulário check-in.**
### **O formulário deve permanecer desabilitado até que a resposta da requisição para o back-end seja recebida.**

#### Resultado: Funcionando corretamente


## Check-in realizado

### **Após preenchido o formulário de check-in, ele deverá ser desativado, impedindo que seja enviado múltiplas vezes**

#### Resultado: Funcionando corretamente


## Atividade encerrada

### **Após encerrada a atividade, tanto para o organizador, quanto para o participante, deverá ser exibido um aviso de "atividade encerrada", onde antes era o formulário de check-in**

#### Resultado: Funcionando corretamente


## Atividade cancelada

### **Caso o organizador cancele a atividade, deve ser exibido o aviso "atividade cancelada"**

#### Resultado: Funcionando corretamente, porém coloquei para que o aviso seja mostrado em um toaster, pois ao deletar a atividade ela não existirá mais e não será mostrada em nenhum local.


## Perfil do usuário

### **Clicando em "editar perfil" o usuário deve ser redirecionado para a tela de edição do perfil**
### **Em "minhas atividades", deverão ser exibidas as atividades criadas por ele**
### **Em "histórico de atividades", deverão ser exibidas as atividades nas quais ele se inscreveu**
### **Clicar no botão "ver mais" deve buscar as próximas 8 atividades e acrescentar ao final da lista de atividades**
### **Se a quantidade inicial de atividades for menor que 12 ou se não houver mais atividades a serem exibidas ao clicar no botão de "ver mais", o botão deve ser removido da página.**

#### Resultado: Funcionando corretamente


## Edição de perfil

### **O campo de nome, CPF e e-mail devem ser automaticamente preenchidos com as informações atuais do usuário**
### **O campo de senha deve estar vazio**
### **O campo de CPF deve estar sempre desabilitado, não sendo possível editá-lo**
### **O botão de editar deve permanecer desabilitado até que a resposta da requisição para o back-end seja recebida.**
### **Após editado com sucesso, o usuário deve ser redirecionado para a tela de perfil**
### **Clicando em "cancelar", todas as alterações realizadas são descartadas**

#### Resultado: Funcionando corretamente


## Confirmação de desativação de conta

### **Na tela de edição, ao clicar em "desativar minha conta", deverá ser exibido o popup de confirmação, apenas desativando a conta caso o usuário confirme a ação**

#### Resultado: Funcionando corretamente


## Adicionais em geral ao projeto:

#### Utilizado componente do shadcn DropdownMenu ao clicar no Avatar contendo as rotas Menu Principal (página principal), Perfil (perfil) e Sair (sair da conta).
#### Customizado componente do Carousel para criar o controle em pontos para o Carousel de Conquistas na página do perfil.
#### Responsividade total na página de Login e Cadastro, podendo utilizar em telas de 320px até 2560px de largura.
#### Atividades síncronas utilizando useEffect nos botões de Participar, Aguardando aprovação, Inscrição negada, Desinscrever, Check-in, Editar, Encerrar atividade, Lista de participantes e Código de confirmação da atividade no modal do Criador.
#### Quando os usuários são inscritos ou desinscritos em uma atividade o participantCount é alterado automaticamente nos modais.
#### Foi utilizado como armazenamento SessionStorage para que em cada aba possa logar um usuário diferente.
#### Utilizado Toasts (pop-ups) para indicar Sucesso e Erros em locais como: Criar Conta, Fazer Login, Escolher preferências, Criar atividade, Deletar Atividade, Editar atividade, Aprovar participante, Rejeitar participante, Participar de atividade, Desinscrever de atividade, Check-in feito, Informações do usuário atualizadas.
#### Textos adicionados para avisar que não há atividades/conquistas nos locais: Sessão Recomendados, Sessão atividades por tipo, Perfil do usuário: Conquistas, Minhas atividades e Histórico de atividades.
#### Ícone e título adicionados à página. (Ícone segurando um halter) (título FIT MEET)
#### Botão "Ver mais" adicionado na sessão Minhas atividades da página Perfil, para que o usuário exiba outras atividades além das 4 últimas que ele criou.
#### Na sessão de Recomendado para você coloquei com que as atividades que o usuário cria não apareçam nos Recomendados, para que apenas apareçam atividades em que o usuário poderá participar e que sejam de acordo com o resultado nas preferências.
