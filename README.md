# IFence-mobile
O IFence é um aplicativo de monitoramento de crianças em ambientes abertos.

# Tecnologias Utilizadas
- React Native
- Expo
- AsyncStorage 
- React Native Maps

# Configuração da API (backend)
O app lê a URL base da API a partir de `app.json` em `expo.extra.IFENCE_API_URL`.

- Emulador Android (AVD): use `http://10.0.2.2:8080/api`
- Simulador iOS (Mac): use `http://localhost:8080/api`
- Dispositivo físico (Expo Go): use `http://SEU_IP_LOCAL:8080/api` (ex.: `http://192.168.0.10:8080/api`)

Após alterar `app.json`, reinicie o servidor do Expo para aplicar a configuração.

## Mapas (Google e fallback por tiles)

Este app usa `react-native-maps`. Você tem duas opções:

1) Google Maps (recomendado se tiver chave)

- Android: adicione no `app.json`:
  ```json
  {
    "expo": {
      "android": { "config": { "googleMaps": { "apiKey": "SUA_CHAVE" } } }
    }
  }
  ```
- iOS: adicione no `app.json`:
  ```json
  { "expo": { "ios": { "config": { "googleMapsApiKey": "SUA_CHAVE" } } } }
  ```

2) Tiles customizados (quando não houver Google Maps)

- Configure um provedor permitido (ex.: MapTiler). Crie uma chave e adicione em `app.json`:
  ```json
  {
    "expo": {
      "extra": {
        "MAPTILER_KEY": "SUA_CHAVE_MAPTILER",
        "MAP_TILES_URL": "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=SUA_CHAVE_MAPTILER",
        "MAP_TILES_ATTRIBUTION": "© Map data © OpenStreetMap contributors, Tiles by MapTiler"
      }
    }
  }
  ```

Importante: não aponte para `tile.openstreetmap.org` diretamente em produção, pois pode violar a política de uso e causar bloqueio.

# Pré-Requisitos
- Node.js
- Expo CLI (se estiver usando Expo)
- Git
- Um emulador Android/iOS ou dispositivo físico(Opcional, o aplicativo Expo Go disponibliza um emulador)

# Instalação e Execução
Clone o repositório
```
git clone https://github.com/elenilsonvieira/ifence-mobile.git
```

Acesse o diretório do projeto
```
cd ifence-mobile
```

Execute o aplicativo
```
npx expo start # Caso esteja usando Expo
# ou
npx react-native run-android # Para Android
npx react-native run-ios # Para iOS
```

Observação:
- Certifique-se de que o backend esteja em execução (padrão: porta 8080). Com perfil de desenvolvimento H2, a aplicação expõe a documentação em `/swagger-ui/index.html`.

# Funcionalidades 
- Criação de pulseiras.
- Criação de cercas.
- Visualização de pulseiras e cercas.
- Monitoramento em tempo real de uma pulseira associada a uma respectiva cerca. 

# Telas do App
<p align="center">
  <img src="/ifence-mobile/assets/images/TelaInicial.jpg" width="200" />
  <img src="/ifence-mobile/assets/images/addPulseira.jpg" width="200" />
  <img src="ifence-mobile/assets/images/addCerca.jpg" width="200" />
  <img src="ifence-mobile/assets/images/Tela de alarme.jpg" width="200" />
  <img src="ifence-mobile/assets/images/mapa.jpg" width="200" />
  <img src="ifence-mobile/assets/images/cadastro.jpg" width="200" />
  <img src="ifence-mobile/assets/images/login.jpg" width="200" />
   <img src="ifence-mobile/assets/images/telaInicial-Ofc-Ifence.png" width="200" />
</p>

# Considerações
Como em todo projeto, há coisas para melhorar. No app do IFence, há funcionalidades que precisam ser melhoradas e ajustadas. Abaixo, estão os pontos que precisam ser melhorados:

- Desenvolver uma API  e, consequentemente, realizar a persistência de dados em um SGBD, por exemplo: Postres, SQLite, MongoDB, etc. Como não tivemos tempo para desenvolver uma API, optamos por salvar os dados no AsyncStorage.
A pasta `storage` é responsável pela a persitência dos dados:
```
\cercaStorage.ts - responsável pela persistência dos dados referentes à cerca
\userStorage.ts - responsável pela persistência dos dados referentes ao usuário
```

- Alguns componentes precisam ser refatorados. Por exemplo, no componente `AdicionarPulseiraScreen.tsx`, toda lógica de CRUD está no componente, isso precisa ser estruturado em outros componentes. E também a própria persistência está no respectivo componente. 

- Nós utilizamos a biblioteca `react-native-toast-message` para exibir as notificações quando uma criança sai da área de uma respectiva cerca. A próxima equipe poderá optar em utilizar o `react-native-toast-message` ou `expo-notifications`[Expo notifications](https://docs.expo.dev/versions/latest/sdk/notifications/).

- Aprimorar a funcionalidade de atribuir mais de uma pulseira a uma respectiva cerca. Atualmente, o app permite apenas a atribuição de uma pulseira.

Contribuidores: [Lucas Acelino](https://github.com/lucasacelino), [Jonas de Lima](https://github.com/Jonaslima07) e [João Henrique](https://github.com/HenrIcosta16).





