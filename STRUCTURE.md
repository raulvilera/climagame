# Estrutura

- `src/main.jsx`: estado da aplicação, lobby, gameplay, conexão WebSocket e ranking.
- `src/data.js`: roster das turmas e perguntas alinhadas ao 3º bimestre.
- `src/styles.css`: identidade visual responsiva.
- `server/index.js`: servidor HTTP/WebSocket com salas em memória.
- `index.html`: entrada Vite.

A UI é React/Vite. O multiplayer é desacoplado: o cliente tenta conectar ao WebSocket no mesmo hostname, mas a partida segue em modo local caso não exista servidor disponível.
