# Desafio Mobile - Caio Anderson

## Dispositivo móvel utilizado: Pixel 4 - Android 15.0

Este projeto foi desenvolvido como solução para o desafio do mobile, abordando a continuidade do backend e o frontend com sistema de validação na autenticação com Zod, criação de usuários, atividades, conquistas e preferências, além de integração com serviços como Geolocation (Google Maps), abordando a utilização do React Native, TypeScript, React Native Hooks, React Native Router, XML e CSS.

## Como rodar o projeto

### **Faça a modificação nos seguintes arquivos:**

### build.gradle
#### Fiz modificações nesta parte do build.gradle
```
def YOUR_CMAKE_NINJA_PATH = "C:/Users/caioa/AppData/Local/Android/Sdk/cmake/3.31.6/bin/ninja.exe"

android {
    ndkVersion rootProject.ext.ndkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdk rootProject.ext.compileSdkVersion

    namespace "com.reactmobile"
    defaultConfig {
        applicationId "com.reactmobile"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"

        externalNativeBuild {
            cmake {
                arguments "-DCMAKE_MAKE_PROGRAM=${YOUR_CMAKE_NINJA_PATH}", "-DCMAKE_OBJECT_PATH_MAX=1024"
            }
        }
    }

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### AndroidManifest.XML:
#### Adicione os users:
```
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

#### Adicione a chave API do google maps correta:
```
<meta-data android:name="com.google.android.geo.API_KEY" android:value="AIzaSyB4shVUqYJ_8wjX0lm6oxRLQOtv6025Fz4"/>
```

#### settings.gradle (caso esteja diferente):
```
pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
rootProject.name = 'reactmobile'
include ':app'
includeBuild('../node_modules/@react-native/gradle-plugin')
```

#### .eslintrc.js (como funcionou para mim os module.exports):
```
module.exports = {
  root: true,
  extends: '@react-native',
  requireConfigFile: false,
};
```

#### react-native.config.js (caso esteja diferente):
```
react-native.config.js:
module.exports = {
  project: {
    ios: {},
    android: {}
  },
  assets: ['./assets/fonts'],
};
```

### Utilizando o Docker fornecido pelo professor de back end Igor:

Aviso breve: (Conferir se alguma imagem não esteja reiniciando).

Vá até o caminho da pasta mobile/reactmobile.

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
npm start
```

#### E em outro terminal e no mesmo caminho (mobile/reactmobile)

```bash
npm run android
```

### Caso hajam erros

#### **Soluções:**

#### Feche o projeto e pause o npm start no terminal.
#### Limpe o conteúdo da build em app/android.
#### Reinstale as dependências.
#### Limpe o cache do aplicativo


## Login
### Texto de navegação para a tela de cadastro devidamente funcional.
### **Input de e-mail com verificação de e-mail válido.**
### **Todos os inputs devem ser devidamente validados.**
### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**

#### Resultado: Funcionando corretamente


## Cadastro

### **Texto de navegação para a tela de login devidamente funcional.**
### **A seta de voltar deve estar configurado para que retorne a View anterior da Stack de navegação.**
### **Input de e-mail com verificação de e-mail válido.**
### **Input de CPF com verificação de valor válido.**
### **Input de senha deve permitir apenas valores com pelo menos 6 caracteres.**
### **Todos os inputs devem ser devidamente validados.**
### **Ao realizar o cadastro com sucesso, o usuário deve ser notificado e redirecionado para tela de login.**
### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**

#### Resultado: Funcionando corretamente


## Home

### **A lista de recomendações deve ser composta por algumas atividades com categorias pertencentes a lista de preferência do usuário.**
### **Caso o usuário não possua preferencias, a lista deve exibir atividades aleatórias.**
### **O botão de adicionar nova atividade deve ser devidamente implementado.**
### **No header, deve ser possível exibir a tela de perfil ao clicar na imagem do usuário.**
### **A lista de categorias deve ser implementada conforme o design seguindo as categorias cadastradas no banco, e deve encaminhar para a tela de Atividades da categoria selecionada.**
### **Ao clicar em Ver Mais no componente de recomendações, o usuário deve ser redirecionado para a tela de atividades com a categoria selecionada sendo uma de suas preferências, ou um tipo de atividade qualquer.**
### **Quando o usuário não tiver nenhuma preferência cadastrada, deve-se ser exibido a tela de seleção de preferencias ao acessar a home, conforme o design seguindo as categorias cadastradas no banco.**
### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**

#### Resultado: Funcionando corretamente


## Atividade por Categoria

### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**
### **Na lista de categorias, a categoria selecionada deve ter o efeito de foco conforme o design.**

#### Resultado: Funcionando corretamente


## Perfil

### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**

#### Resultado: Funcionando corretamente


## Editar Perfil

### Todos os componentes presentes nessa tela devem estar devidamente funcionais.
### Input de e-mail com verificação de e-mail válido.
### **O input CPF não deve permitir edição.**
### **Input de senha deve permitir apenas valores com pelo menos 6 caracteres.**
### **Todos os inputs devem ser devidamente validados.**
### **A lista de preferencias deve estar com as categorias selecionadas, caso o usuário possua preferencias.**
### **Ao clicar no botão de editar preferencias o usuário deve ser encaminhado para a tela de edição de preferencias, conforme o design seguindo as categorias já cadastradas no banco.**

#### Resultado: Funcionando corretamente


## Cadastrar Atividade

### **Todos os inputs devem ser devidamente validados.**
### **A integração com o Maps deve estar funcional.**
### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**

#### Resultado: Funcionando corretamente


## Editar Atividade

### **Todos os inputs devem ser devidamente validados.**
### **A integração com o Maps deve estar funcional.**
### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**

#### Resultado: Funcionando corretamente


## Descrição da Atividade 
### Visão de Organizador – Enquanto ainda não chegou o dia da atividade

#### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**
#### **Antes da atividade, deve-se ser possível aprovar ou recusar participantes conforme o design**

### Visão de Organizador – No dia da atividade

#### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**
#### **Caso a data da atividade já tenha passado não deve ser possível alterar a lista de participantes.**
#### **No dia da atividade deve ser exibido o código de confirmação de presença.**

### Visão de Organizador – Finalizar Atividade

#### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**
#### **Não deve ser possível alterar a lista de participantes.**
#### **Deve ser possível finalizar a atividade corretamente, após a data da atividade.**

### Visão de Organizador – Atividade Finalizada

#### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**
#### **Não deve ser possível alterar a lista de participantes.**


### Visão de Participante – Enquanto ainda não chegou o dia da atividade

#### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**
#### **Antes da data da atividade, os usuários devem ter a opção de solicitar participação, ingressar na atividade e sair dela a qualquer momento**
#### **Caso a inscrição tenha sido negada, o botão deve estar desabilitado.**

### Visão de Participante – No dia da atividade

#### **Todos os componentes presentes nessa tela devem estar devidamente funcionais.**
#### **No dia da atividade deve ser possível confirmar presença na atividade.**

### Visão de Participante – Atividade Finalizada

#### **Todos os componentes presentes nessa tela devem estar devidamente funcionais**

#### Resultado: Funcionando corretamente

<br>

## **Adicionais**

### Pastas e arquivos componentizados.
### O teclado do celular não sobrepõe inputs.
### Seleção de preferências no modal de Preferences com o ícone Check (sendo mais visível que o usuário escolheu aquele tipo de atividade).
### Splash Screen feita com a logo do projeto FITMEET, sendo utilizada para quando o usuário entrar no aplicativo.
### Modais de Atividade (ParticipantView e CreatorView) funcionando de forma síncrona em Botões Participar, Sair, Inscrição Negada e Confirmar presença (Modal do Participante), Botões de Rejeitar, Aprovar, Editar Atividade e Finalizar Atividade (Modal do Criador).
### Modal de Editar Perfil funcionando de forma síncrona ao editar informações do usuário. Ao clicar no botão "Salvar" as preferências são atualizadas abaixo do título Preferências e suas informações como imagem, nome, e-mail e senha.
### Toasts utilizados para enviar informações a usuários quando realizarem funções no aplicativo, como: Criar Atividade, Registrar, Editar Perfil, Finalizar Atividade, Cancelar Atividade, Editar Atividade e outros.
