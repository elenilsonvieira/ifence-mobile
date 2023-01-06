# iFence mobile

`iFence mobile` é um aplicativo para dispositivos móveis em [React Native](https://reactnative.dev/) integrado ao
projeto iFence. Com ele é possível criar e editar pulseiras e cercas, além de visualizar notificações e alarmes.

## Dependências

* [React Native](https://reactnative.dev/docs/environment-setup)
* [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

## Configurando e executando

Instale todas as dependências:

$ npm install

Inicie o Metro:

$ npx react-native start

Inicie a aplicação em outro terminal:

$ npx react-native run-android

## Notificações _Push_

O sistema de notificações foi criado usando o serviço do [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging).