# ClimaGame

Quiz multiplayer de Ciências para o **8º ano**, com conteúdo do 3º bimestre do Currículo Paulista. A aplicação combina uma entrada com listas de estudantes das turmas 8º Ano A/B, trilhas de conteúdo, perguntas de múltipla escolha, pontuação e ranking em tempo real por sala.

## Conteúdo pedagógico

As perguntas cobrem as aulas 1–24 do 3º bimestre: astronomia; movimentos da Terra; estações do ano; Lua, fases e eclipses; diferença entre tempo e clima; previsão do tempo e instrumentos meteorológicos; circulação atmosférica e oceânica; climas regionais; El Niño e La Niña; mudanças climáticas; aquecimento global e equilíbrio ambiental.

## Rodar localmente

```bash
pnpm install
pnpm dev
# em outro terminal
pnpm server
```

Abra o endereço informado pelo Vite. Para jogar em mais de um dispositivo, hospede também `server/index.js` em um serviço Node com WebSocket e defina `VITE_WS_URL` com o endereço `wss://...`. Sem o servidor, o jogo continua funcionando em modo local e deixa essa indicação no cabeçalho.

## Fluxo multiplayer

Cada jogador escolhe seu nome na lista, série/turma, número de chamada, e-mail institucional e código da sala. Ao conectar, o servidor mantém uma sala em memória, distribui o ranking a todos os clientes e atualiza a pontuação após cada resposta. O ranking é por código de sala e é reiniciado quando o servidor é reiniciado.

## Privacidade

Os dados de estudantes foram incluídos porque fazem parte dos anexos fornecidos para a atividade. Em produção, recomenda-se mover a lista para uma fonte protegida ou configurar autenticação da escola, evitando expor dados pessoais no bundle público.
