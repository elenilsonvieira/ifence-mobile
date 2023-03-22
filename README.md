# iFence mobile

`iFence mobile` é um aplicativo para dispositivos móveis em [React Native](https://reactnative.dev/) integrado ao
projeto iFence. Com ele é possível criar e editar pulseiras e cercas, além de visualizar notificações e alarmes.

## Dependências

* [React Native](https://reactnative.dev/docs/environment-setup)
* [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

## Configurando e executando

Instale todas as dependências:

`$ npm install`

Inicie o Metro:

`$ npx react-native start`

Inicie a aplicação em outro terminal:

`$ npx react-native run-android`

## Notificações _Push_

O sistema de notificações foi criado usando o serviço do [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging).

Os passos a seguir são baseados nas documentações encontradas no [Firebase](https://firebase.google.com/docs/android/setup?hl=pt-br#console),
[Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/android/client?hl=pt-br&authuser=0),
no site [React Native Firebase](https://rnfirebase.io/messaging/usage) e no site do 
[TerraLAB](http://www2.decom.ufop.br/terralab/saiba-como-implementar-o-servico-de-notificacoes-no-seu-app-react-native-utilizando-a-firebase/).

### Instalação
Instale o módulo `@react-native-firebase/app`:

Usando npm:
`$ npm install --save @react-native-firebase/app`

Usando yarn:
`$ yarn add @react-native-firebase/app`

### Configuração

1. Crie um projeto no Firebase e registre o aplicativo.
2. Faça o download do arquivo `google-services.json` para o diretório `android/app`.
3. Garanta que o arquivo `android/build.gradle` adicione o plugin dos Serviços do Google.
Nele devem constar as seguintes linhas:
```java
buildscript {

        repositories {
        // Make sure that you have the following two repositories
        google()  // Google's Maven repository
        mavenCentral()  // Maven Central repository
        }

        dependencies {
        ...

        // Add the dependency for the Google services Gradle plugin
        classpath 'com.google.gms:google-services:4.3.15'
        }
}

        allprojects {
        ...

        repositories {
        // Make sure that you have the following two repositories
        google()  // Google's Maven repository
        mavenCentral()  // Maven Central repository
        }
}
```
4. No arquivo `android/app/build.gradle` devem constar as seguintes linhas:
```java
plugins {
    id 'com.android.application'

    // Add the Google services Gradle plugin
    id 'com.google.gms.google-services'
    ...
}
```
No projeto esse trecho foi substituído por uma única linha:
```java
apply plugin: "com.google.gms.google-services"
```
5. O SDK do Firebase é adicionado ao arquivo `android/app/build.gradle` com o seguinte bloco:
```java
dependencies {
  // ...

  // Import the Firebase BoM
  implementation platform('com.google.firebase:firebase-bom:31.2.3')

  // When using the BoM, you don't specify versions in Firebase library dependencies

  // Add the dependency for the Firebase SDK for Google Analytics
  implementation 'com.google.firebase:firebase-analytics'

  // TODO: Add the dependencies for any other Firebase products you want to use
  // See https://firebase.google.com/docs/android/setup#available-libraries
  // For example, add the dependencies for Firebase Authentication and Cloud Firestore
  implementation 'com.google.firebase:firebase-auth'
  implementation 'com.google.firebase:firebase-firestore'
}
```
Perceba que a implementação na base de código está diferente, pois a documentação apontava outro procedimento na época 
em que a notificação foi integrada.
6. Edite o arquivo `AndroidManifest.xml` para que contenha o seguinte bloco:
```xml
<service
    android:name=".java.MyFirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```