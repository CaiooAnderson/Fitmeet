/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastro do usuário
 *     tags: [Autenticação]
 *     description: Endpoint para cadastrar um novo usuário.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - cpf
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Caio Anderson"
 *               email:
 *                 type: string
 *                 example: "caio@gmail.com"
 *               cpf:
 *                 type: string
 *                 example: "12345678910"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário criado com sucesso."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Informe os campos obrigatórios corretamente."
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "O e-mail ou CPF informado já pertence a outro usuário."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: Login de usuário
 *     tags: [Autenticação]
 *     description: Endpoint para realizar login com e-mail e senha.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *              - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "caio@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                type: string
 *                example: "S0Y1S2M3A4P5T6R7A8I9N1E0E"
 *               id:
 *                type: string
 *                example: "y79w83ry69-3e877y2-378-4373yr"
 *               name:
 *                 type: string
 *                 example: "Caio Anderson"
 *               email:
 *                 type: string
 *                 example: "caio@gmail.com"
 *               cpf:
 *                 type: string
 *                 example: "12345678910"
 *               avatar:
 *                 type: string
 *                 example: "/avatar_default.jpg"
 *               xp:
 *                 type: integer
 *                 example: 0
 *               level:
 *                 type: integer
 *                 example: 0
 *               achievements:
 *                 type: array
 *                 items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                        example: "Primeiro Check-in"
 *                      criterion:
 *                        type: string
 *                        example: "Fez o Check-in pela primeira vez em uma atividade"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Informe os campos obrigatórios corretamente."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Senha incorreta."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não encontrado."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /user:
 *   get:
 *     summary: Buscar dados do usuário
 *     tags: [Usuários]
 *     description: Endpoint para buscar os dados do usuário logado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "y79w83ry69-3e877y2-378-4373yr"
 *                 name:
 *                   type: string
 *                   example: "Caio Anderson"
 *                 email:
 *                   type: string
 *                   example: "caio@gmail.com"
 *                 cpf:
 *                   type: string
 *                   example: "12345678910"
 *                 avatar:
 *                   type: string
 *                   example: "/avatar_default.jpg"
 *                 xp:
 *                   type: integer
 *                   example: 0
 *                 level:
 *                   type: integer
 *                   example: 0
 *                 achievements:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Primeiro Check-in"
 *                       criterion:
 *                         type: string
 *                         example: "Fez o Check-in pela primeira vez em uma atividade"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /user/preferences:
 *   get:
 *     summary: Buscar interesses do usuário
 *     tags: [Usuários]
 *     description: Endpoint para buscar os interesses do usuário.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *          application/json:
 *           schema:
 *                 items:
 *                    type: object
 *                    properties:
 *                      typeId:
 *                        type: string
 *                        format: uuid
 *                        example: "3u24uon3r2-342igh-nio67-32u732"
 *                      typeName:
 *                        type: string
 *                        example: "Preferência"
 *                      typeDescription:
 *                        type: string
 *                        example: "descrição sobre o tipo de preferência"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *              Requisição não-autenticada:
 *                value:
 *                  error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /user/preferences/define:
 *   post:
 *     summary: Definir interesses do usuário
 *     tags: [Usuários]
 *     description: Endpoint para definir os interesses do usuário.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeId
 *             properties:
 *               typeId:
 *                 type: string
 *                 format: uuid
 *                 example: "3u24uon3r2-342igh-nio67-32u732"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preferências atualizadas com sucesso."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Um ou mais IDs informados são inválidos."
 *             examples:
 *              Um ou mais IDs informados são inválidos:
 *                value:
 *                  error: "Um ou mais IDs informados são inválidos."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *              Requisição não-autenticada:
 *                value:
 *                  error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /user/avatar:
 *   put:
 *     summary: Editar foto de perfil do usuário
 *     tags: [Usuários]
 *     description: Endpoint para a foto de perfil do usuário logado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 example: "3u24uon3r2-342igh-nio67-32u732"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   example: "foto de perfil do usuário atualizada"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "A imagem deve ser um arquivo PNG ou JPG."
 *             examples:
 *              Arquivo de imagem inválido:
 *                value:
 *                  error: "A imagem deve ser um arquivo PNG ou JPG."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *              Requisição não-autenticada:
 *                value:
 *                  error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /user/update:
 *   put:
 *     summary: Editar dados do usuário
 *     tags: [Usuários]
 *     description: Endpoint para editar dados do usuário logado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Caio Anderson"
 *               email:
 *                 type: string
 *                 example: "caio@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "y79w83ry69-3e877y2-378-4373yr"
 *                 name:
 *                   type: string
 *                   example: "Caio Anderson"
 *                 email:
 *                   type: string
 *                   example: "caio@gmail.com"
 *                 cpf:
 *                   type: string
 *                   example: "12345678910"
 *                 avatar:
 *                   type: string
 *                   example: "/avatar_default.png"
 *                 xp:
 *                   type: integer
 *                   example: 0
 *                 level:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *              Requisição não-autenticada:
 *                value:
 *                  error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "O e-mail ou CPF informado já pertence a outro usuário."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /user/deactivate:
 *   delete:
 *     summary: Desativar conta do usuário
 *     tags: [Usuários]
 *     description: Endpoint para desativar a conta do usuário.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conta desativada com sucesso."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *              Requisição não-autenticada:
 *                value:
 *                  error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/types:
 *   get:
 *     summary: Listar tipos de atividades
 *     tags: [Atividades]
 *     description: Endpoint para listar os tipos de atividades disponíveis.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "ifwajku-389cn-ashd-32ohn"
 *                 name:
 *                   type: string
 *                   example: "Atividade 1"
 *                 description:
 *                   type: string
 *                   example: "Descrição sobre a Atividade 1"
 *                 image:
 *                   type: string
 *                   example: "/atividade-1.png"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *              Requisição não-autenticada:
 *                value:
 *                  error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities:
 *   get:
 *     summary: Listar atividades com paginação, filtro por tipo e ordenação
 *     tags: [Atividades]
 *     description: >
 *       Endpoint para listar de forma paginada as atividades registradas.
 *       Parâmetros opcionais:
 *       type (filtrar por um tipo específico de atividades),
 *       orderBy (campo pelo qual ordenar as atividades) e
 *       order ("asc" = crescente, "desc" = decrescente).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número da página.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Tamanho da página.
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar atividades por tipo.
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           example: createdAt
 *         description: Ordenar as atividades por um campo específico.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           example: desc
 *         description: Ordem pela qual ordenar as atividades.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 0
 *                 pageSize:
 *                   type: integer
 *                   example: 0
 *                 totalActivities:
 *                   type: integer
 *                   example: 0
 *                 totalPages:
 *                   type: integer
 *                   example: 0
 *                 previous:
 *                   type: integer
 *                   example: 0
 *                 next:
 *                   type: integer
 *                   example: 0
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "eh218211-h2uq3e2-2h2h1-d7a7a8"
 *                       title:
 *                         type: string
 *                         example: "Atividade exemplo"
 *                       description:
 *                         type: string
 *                         example: "Descrição sobre a atividade"
 *                       type:
 *                         type: string
 *                         example: "Tipo de atividade"
 *                       image:
 *                         type: string
 *                         example: "/atividade.png"
 *                       confirmationCode:
 *                         type: string
 *                         example: "8jawd782j2k"
 *                       participantCount:
 *                         type: integer
 *                         example: 0
 *                       address:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                             example: 0
 *                           longitude:
 *                             type: number
 *                             example: 0
 *                       scheduledDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       completedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       private:
 *                         type: boolean
 *                         example: true
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string 
 *                             format: uuid 
 *                             example: "hu2euh123-fawy8j-fjwa88-fa7y7" 
 *                           name:
 *                             type: string 
 *                             example: "Igor Souza" 
 *                           avatar:
 *                             type: string 
 *                             example: "/Igor-Souza_user/avatar.png"
 *                       userSubscriptionStatus:
 *                          type: string
 *                          example: "Inscrito"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/all:
 *   get:
 *     summary: Listar todas as atividades com filtro por tipo e ordenação
 *     tags: [Atividades]
 *     description: >
 *       Endpoint para listar todas as atividades registradas.
 *       Parâmetros opcionais:
 *       type (filtrar por um tipo específico de atividades),
 *       orderBy (campo pelo qual ordenar as atividades) e
 *       order ("asc" = crescente, "desc" = decrescente).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar atividades por tipo.
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           example: createdAt
 *         description: Ordenar as atividades por um campo específico.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           example: desc
 *         description: Ordem pela qual ordenar as atividades.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "eh218211-h2uq3e2-2h2h1-d7a7a8"
 *                       title:
 *                         type: string
 *                         example: "Atividade exemplo"
 *                       description:
 *                         type: string
 *                         example: "Descrição sobre a atividade"
 *                       type:
 *                         type: string
 *                         example: "Tipo de atividade"
 *                       image:
 *                         type: string
 *                         example: "/atividade.png"
 *                       confirmationCode:
 *                         type: string
 *                         example: "8jawd782j2k"
 *                       participantCount:
 *                         type: integer
 *                         example: 0
 *                       address:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                             example: 0
 *                           longitude:
 *                             type: number
 *                             example: 0
 *                       scheduledDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       completedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       private:
 *                         type: boolean
 *                         example: true
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string 
 *                             format: uuid 
 *                             example: "hu2euh123-fawy8j-fjwa88-fa7y7" 
 *                           name:
 *                             type: string 
 *                             example: "Igor Souza" 
 *                           avatar:
 *                             type: string 
 *                             example: "/Igor-Souza_user/avatar.png"
 *                       userSubscriptionStatus:
 *                          type: string
 *                          example: "Inscrito"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/user/creator:
 *   get:
 *     summary: Buscar atividades criadas pelo usuário
 *     tags: [Atividades]
 *     description: Endpoint para listar de forma paginada as atividades criadas pelo usuário logado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1 
 *         description: Número da página.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10 
 *         description: Tamanho da página.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 0
 *                 pageSize:
 *                   type: integer
 *                   example: 0
 *                 totalActivities:
 *                   type: integer
 *                   example: 0
 *                 totalPages:
 *                   type: integer
 *                   example: 0
 *                 previous:
 *                   type: integer
 *                   example: 0
 *                 next:
 *                   type: integer
 *                   example: 0
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "234huo-asd7kj-fjvve7-fjj23"
 *                       title:
 *                         type: string
 *                         example: "Atividade 1"
 *                       description:
 *                         type: string
 *                         example: "Descrição sobre a Atividade 1"
 *                       type:
 *                         type: string
 *                         example: "Tipo de atividade"
 *                       image:
 *                         type: string
 *                         example: "/atividade.png"
 *                       confirmationCode:
 *                         type: string
 *                         example: "234ipjdaw877ujawd"
 *                       participantCount:
 *                         type: integer
 *                         example: 0
 *                       address:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                             example: 0
 *                           longitude:
 *                             type: number
 *                             example: 0
 *                       scheduledDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       completedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       private:
 *                         type: boolean
 *                         example: true
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "8fsjef-awhjd7w-fay7wa8j"
 *                           name:
 *                             type: string
 *                             example: "Andryev"
 *                           avatar:
 *                             type: string
 *                             example: "/Andryev_user/avatar.png"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/user/creator/all:
 *   get:
 *     summary: Buscar todas as atividades criadas pelo usuário
 *     tags: [Atividades]
 *     description: Endpoint para listar todas as atividades criadas pelo usuário logado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "fwa7awj-daw77ja-aw7d7jkj1s-fwa711"
 *                   title:
 *                     type: string
 *                     example: "Atividade 1"
 *                   description:
 *                     type: string
 *                     example: "Descrição sobre a Atividade 1"
 *                   type:
 *                     type: string
 *                     example: "Tipo de atividade"
 *                   image:
 *                     type: string
 *                     example: "/atividade-1.png"
 *                   confirmationCode:
 *                     type: string
 *                     example: "string"
 *                   participantCount:
 *                     type: integer
 *                     example: 0
 *                   address:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         example: 0
 *                       longitude:
 *                         type: number
 *                         example: 0
 *                   scheduledDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-20T18:00:01.403Z"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-20T18:00:01.403Z"
 *                   completedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-20T18:00:01.403Z"
 *                   private:
 *                     type: boolean
 *                     example: true
 *                   creator:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "58ajs-daw727qj-daw7711-da2677"
 *                       name:
 *                         type: string
 *                         example: "Tiago Souza"
 *                       avatar:
 *                         type: string
 *                         example: "/Tiago-Souza_user/avatar.png"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/user/participant:
 *   get:
 *     summary: Buscar atividades em que o usuário se inscreveu
 *     tags: [Atividades]
 *     description: Endpoint para listar de forma paginada as atividades em que o usuário logado se inscreveu.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número da página.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Tamanho da página.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 0
 *                 pageSize:
 *                   type: integer
 *                   example: 0
 *                 totalActivities:
 *                   type: integer
 *                   example: 0
 *                 totalPages:
 *                   type: integer
 *                   example: 0
 *                 previous:
 *                   type: integer
 *                   example: 0
 *                 next:
 *                   type: integer
 *                   example: 0
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "23huuhd-27d8ujc-b72hnx-b7771"
 *                       title:
 *                         type: string
 *                         example: "Atividade 2"
 *                       description:
 *                         type: string
 *                         example: "Descrição sobre a Atividade 2"
 *                       type:
 *                         type: string
 *                         example: "Tipo de atividade"
 *                       image:
 *                         type: string
 *                         example: "/atividade-2.png"
 *                       participantCount:
 *                         type: integer
 *                         example: 0
 *                       address:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                             example: 0
 *                           longitude:
 *                             type: number
 *                             example: 0
 *                       scheduledDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       completedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T18:00:01.403Z"
 *                       private:
 *                         type: boolean
 *                         example: true
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "fds8h2-d7s71js-c7c773j-c716y"
 *                           name:
 *                             type: string
 *                             example: "Caio Anderson"
 *                           avatar:
 *                             type: string
 *                             example: "/Caio-Anderson_user/avatar.png"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/user/participant/all:
 *   get:
 *     summary: Buscar todas as atividades em que o usuário se inscreveu
 *     tags: [Atividades]
 *     description: Endpoint para listar todas as atividades em que o usuário logado se inscreveu.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "2udjaw-237dhjs-b7ad8sj"
 *                   title:
 *                     type: string
 *                     example: "Atividade 1"
 *                   description:
 *                     type: string
 *                     example: "Descrição sobre a Atividade 1"
 *                   type:
 *                     type: string
 *                     example: "Tipo de atividade"
 *                   image:
 *                     type: string
 *                     example: "/atividade-1.png"
 *                   participantCount:
 *                     type: integer
 *                     example: 0
 *                   address:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         example: 0
 *                       longitude:
 *                         type: number
 *                         example: 0
 *                   scheduledDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-20T18:00:01.303Z"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-20T18:00:01.303Z"
 *                   completedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-20T18:00:01.303Z"
 *                   private:
 *                     type: boolean
 *                     example: true
 *                   creator:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "8fsjef-awhjd7w-fay7wa8j"
 *                       name:
 *                         type: string
 *                         example: "Andryev"
 *                       avatar:
 *                         type: string
 *                         example: "/Andryev_user/avatar.png"
 *                   userSubscriptionStatus:
 *                     type: string
 *                     example: "Inscrito"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/{id}/participants:
 *   get:
 *     summary: Buscar participantes de uma atividade
 *     tags: [Atividades]
 *     description: Endpoint para buscar os participantes de uma atividade específica.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: id
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "21e78diaj-faw722jh-c8aakm"
 *                   userId:
 *                     type: string
 *                     format: uuid
 *                     example: "j43298df-c8a8j-cs8ac8m-w122"
 *                   name:
 *                     type: string
 *                     example: "Anderson"
 *                   avatar:
 *                     type: string
 *                     example: "/Anderson_user/avatar.png"
 *                   subscriptionStatus:
 *                     type: string
 *                     example: "Participante"
 *                   confirmedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-20T18:00:02.092Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Atividade não encontrada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/new:
 *   post:
 *     summary: Criar uma atividade
 *     tags: [Atividades]
 *     description: Endpoint para criar uma atividade.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - typeId
 *               - address
 *               - image
 *               - scheduledDate
 *               - private
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               typeId:
 *                 type: string
 *                 format: uuid
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               private:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "h3r28m-2187d-cxa71n-asx88"
 *                 title:
 *                   type: string
 *                   example: "Atividade 3"
 *                 description:
 *                   type: string
 *                   example: "Descrição sobre a Atividade 3"
 *                 type:
 *                   type: string
 *                   example: "Tipo de atividade"
 *                 image:
 *                   type: string
 *                   example: "/atividade-3.png"
 *                 address:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       example: 0
 *                     longitude:
 *                       type: number
 *                       example: 0
 *                 scheduledDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-20T18:00:01.403Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-20T18:00:01.403Z"
 *                 completedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-20T18:00:01.403Z"
 *                 private:
 *                   type: boolean
 *                   example: true
 *                 creator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "fds8h2-d7s71js-c7c773j-c716y"
 *                     name:
 *                       type: string
 *                       example: "Caio Anderson"
 *                     avatar:
 *                       type: string
 *                       example: "/Caio-Anderson_user/avatar.png"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "A imagem deve ser um arquivo PNG ou JPG."
 *             examples:
 *               Arquivo de imagem inválido:
 *                 value:
 *                   error: "A imagem deve ser um arquivo PNG ou JPG."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/{id}/subscribe:
 *   post:
 *     summary: Inscrever-se em uma atividade
 *     tags: [Atividades]
 *     description: Endpoint para inscrever-se em uma atividade.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade em que o usuário deseja se inscrever
 *         schema:
 *           type: string
 *           format: uuid
 *           example: id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "432jdsa-cas73hn-cas82nn"
 *                 subscriptionStatus:
 *                   type: string
 *                   example: "Pendente"
 *                 confirmedAt:
 *                   type: date-time
 *                   example: "2025-03-20T18:00:01.403Z"
 *                 activityId:
 *                   type: string
 *                   example: "/activities/314h13u-csa721n-cas7awsnm"
 *                 userId:
 *                   type: string
 *                   example: "da8q2jdsa-cas7828n-csccas2"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *             examples:
 *               Conta desativada:
 *                 value:
 *                   error: "Esta conta foi desativada e não pode ser utilizada."
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Atividade não encontrada."
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Você já se registrou nesta atividade."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/{id}/update:
 *   put:
 *     summary: Editar uma atividade existente
 *     tags: [Atividades]
 *     description: Endpoint para editar uma atividade existente.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: id
 *         description: ID da atividade a ser editada
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               typeId:
 *                 type: string
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               private:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "h3r28m-2187d-cxa71n-32s11"
 *                 title:
 *                   type: string
 *                   example: "Atividade 4"
 *                 description:
 *                   type: string
 *                   example: "Descrição sobre a Atividade 4"
 *                 type:
 *                   type: string
 *                   example: "Tipo de atividade"
 *                 image:
 *                   type: string
 *                   example: "/atividade-4.png"
 *                 address:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       example: 0 
 *                     longitude:
 *                       type: number
 *                       example: 0 
 *                 scheduledDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-20T18:00:01.403Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-20T18:00:01.403Z"
 *                 completedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-20T18:00:01.403Z"
 *                 private:
 *                   type: boolean
 *                   example: true
 *                 creator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "fds8h2-d7s71js-c7c773j-c716y"
 *                     name:
 *                       type: string
 *                       example: "Caio Anderson"
 *                     avatar:
 *                       type: string
 *                       example: "/Caio-Anderson_user/avatar.png"
 *       400:
 *         description: Bad Request - imagem inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "A imagem deve ser um arquivo PNG ou JPG."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *              Requisição não-autenticada:
 *                value:
 *                  error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *             examples:
 *              Conta desativada:
 *                value:
 *                  error: "Esta conta foi desativada e não pode ser utilizada."
 *       404:
 *         description: Not Found - Atividade não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Atividade não encontrada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/{id}/conclude:
 *   put:
 *     summary: Concluir uma atividade
 *     tags: [Atividades]
 *     description: Endpoint para concluir uma atividade.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: id
 *         description: ID da atividade a ser concluída
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Atividade concluída com sucesso."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *              Requisição não-autenticada:
 *                value:
 *                  error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *             examples:
 *              Conta desativada:
 *                value:
 *                  error: "Esta conta foi desativada e não pode ser utilizada."
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Atividade não encontrada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/{id}/approve:
 *   put:
 *     summary: Aprovar ou negar inscrição de participante em atividade privada
 *     tags: [Atividades]
 *     description: Endpoint para aprovar ou negar inscrição de participante em atividade privada.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: id
 *         description: ID da atividade
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantId
 *               - approved
 *             properties:
 *               participantId:
 *                 type: string
 *                 format: uuid
 *                 example: "432jdsa-cas73hn-cas82nn"
 *               approved:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitação de participação aprovada com sucesso."
 *             examples:
 *              Solicitação aprovada:
 *                value:
 *                  message: Solicitação de participação aprovada com sucesso.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Informe os campos obrigatórios corretamente."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *              Requisição não-autenticada:
 *                value:
 *                  error: "Autenticação necessária."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *             examples:
 *              Conta desativada:
 *                value:
 *                  error: "Esta conta foi desativada e não pode ser utilizada."
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Participante não encontrado."
 *             examples:
 *              Participante não encontrado:
 *                value:
 *                  error: "Participante não encontrado."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/{id}/check-in:
 *   put:
 *     summary: Fazer check-in em uma atividade usando código de confirmação
 *     tags: [Atividades]
 *     description: Endpoint para fazer check-in em uma atividade utilizando o código de confirmação.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: id
 *         description: ID da atividade em que o usuário deseja fazer check-in
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - confirmationCode
 *             properties:
 *               confirmationCode:
 *                 type: string
 *                 example: "ABCDE"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Participação confirmada com sucesso."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Informe os campos obrigatórios corretamente."
 *             examples:
 *               Campos obrigatórios não informados:
 *                 value:
 *                   error: "Informe os campos obrigatórios corretamente."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 * 
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *             examples:
 *               Conta desativada:
 *                 value:
 *                   error: "Esta conta foi desativada e não pode ser utilizada."
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Atividade não encontrada."
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Você já confirmou sua participação nesta atividade."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/{id}/unsubscribe:
 *   delete:
 *     summary: Cancelar a inscrição do usuário em uma atividade
 *     tags: [Atividades]
 *     description: Endpoint para cancelar a inscrição do usuário logado em uma atividade.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: id
 *         description: ID da atividade da qual o usuário deseja cancelar sua inscrição
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Participação cancelada com sucesso."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Você não se inscreveu nesta atividade."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 * 
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *             examples:
 *               Conta desativada:
 *                 value:
 *                   error: "Esta conta foi desativada e não pode ser utilizada."
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Atividade não encontrada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /activities/{id}/delete:
 *   delete:
 *     summary: Excluir uma atividade existente
 *     tags: [Atividades]
 *     description: Endpoint para excluir uma atividade existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: id
 *         description: ID da atividade a ser excluída
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Atividade excluída com sucesso."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autenticação necessária."
 *             examples:
 *               Requisição não-autenticada:
 *                 value:
 *                   error: "Autenticação necessária."
 * 
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Esta conta foi desativada e não pode ser utilizada."
 *             examples:
 *               Conta desativada:
 *                 value:
 *                   error: "Esta conta foi desativada e não pode ser utilizada."
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Atividade não encontrada."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro inesperado."
 */