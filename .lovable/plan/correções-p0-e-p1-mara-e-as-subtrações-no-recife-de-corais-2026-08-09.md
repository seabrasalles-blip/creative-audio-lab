# Correções P0 e P1 — Mara e as Subtrações no Recife de Corais

Correção controlada do que já existe. Sem redesign, sem novos assets, sem mudar canvas 1200 × 675, paleta, tipografia ou a progressão pedagógica.

## P0 — Feedback de acerto sem avanço automático

Hoje, em `GameScreen.tsx`, o acerto chama `setPhase("solved")` e um `setTimeout(..., 450)` empurra a criança para `represent`.

- Remover esse timer (`representTimer`) por completo.
- Em `solved`, manter cena resolvida, alternativa correta destacada e o feedback da Mara na tela por tempo indeterminado.
- Exibir um botão **"Mostrar com números"** na zona de navegação já existente (canto superior direito quando há cardumes; canto inferior direito nos demais), com a mesma linguagem visual dos botões atuais e entrada suave.
- Só o clique muda para `represent`. O botão fica desabilitado após o primeiro clique (guarda contra duplo clique / transição dupla).
- Na entrada da representação, a fala da Mara passa a ser a ponte: "Agora vamos mostrar com números o que aconteceu."
- Áudio continua exclusivamente sob demanda.

## P0/P1 — Concordância de singular e plural

Novo módulo `src/lib/pt.ts` com helpers reutilizáveis:

- `peixes(n)` → "1 peixe" / "6 peixes"
- `cardumes(n)` → "1 cardume" / "3 cardumes"
- `havia(n)`, `sairam(n)`, `ficaram(n)` → "Havia 1 peixe" (nunca "Haviam"), "Saiu 1 peixe" / "Saíram 2 peixes", "Ficou 1 peixe" / "Ficaram 2 peixes"
- `grupoDescr(tens, ones)` para as frases mistas de cardumes + peixes

Todos os enunciados, dicas, feedbacks, textos de representação, transições e síntese passam a ser gerados por esses helpers em `src/data/challenges.ts` e `src/data/flow.ts` — nada de correção manual desafio a desafio. Corrige também casos hoje errados como "Ficaram 1 cardume e 2 peixes".

## P1 — Papel pedagógico das falas da Mara (12 desafios revisados)

Regra editorial: o enunciado diz o que fazer, a cena traz os números, a Mara orienta.

- Na observação, a Mara **nunca** diz a quantidade que a criança deve contar. Passa a variar entre falas curtas de estratégia: "Conte com calma.", "Olhe com atenção para o recife.", "Quantos peixes você consegue contar?", e nas telas com cardumes: "Comece pelos cardumes."
- Antes/durante a retirada: "Agora veja o que acontece."
- Na pergunta: "Conte os peixes que ficaram." — sem repetir o enunciado.
- Dicas passam a oferecer estratégia (apontar enquanto conta; contar cardume como 10; olhar primeiro os cardumes), nunca repetir o problema nem entregar o resultado.
- Erros: curtos, acolhedores, sem revelar a resposta, com nova tentativa livre.
- Acerto: aí sim retoma as quantidades com concordância correta — "Isso mesmo! Havia 5, saiu 1 e ficaram 4."
- Quando o enunciado já é autossuficiente e uma fala não acrescentaria função pedagógica, o balão não é preenchido só para ter texto.

## P1 — Linguagem matemática mais precisa

- Remover "Na subtração, contamos apenas o que permaneceu." → "Neste desafio, queremos descobrir quantos ficaram. Observe os peixes que permaneceram no recife."
- Remover "O sinal de menos mostra que uma quantidade foi retirada." → "Nesta situação, o sinal de menos representa a quantidade que saiu."

## P1 — Posição das alternativas não pode entregar a resposta

- `OperationBuilder`: as `choices` passam a ser embaralhadas **uma vez por desafio** (embaralhamento memorizado por `challenge.id`, feito no `GameScreen`), estável durante tentativas e erros. Sem reembaralhar a cada render.
- Metacognição: mesma estratégia — ordem das alternativas embaralhada uma vez ao entrar na questão, estável depois do erro. A resposta correta deixa de ficar sempre na primeira posição.
- As alternativas numéricas dos desafios (`AnswerOptions`) já variam de posição e permanecem como estão.

## P1 — Timers e controle de estado

- Criar `clearInteractionTimers()` centralizando o cancelamento de todos os timers (retirada, transição de fase, demo das transições).
- Chamar antes de `goNext()`, `goBack()`, `restart()`, `resetStepState()` e em qualquer troca forçada de etapa, além do cleanup do componente.
- Com a remoção do timer de 450 ms, restam apenas os timers da animação de retirada, todos sob essa limpeza. Nenhum timer de tela anterior altera a tela seguinte.

## P1 — Orientação vertical

Camada amigável (mesma identidade visual: fundo deep-sea, caixa creme, contorno navy, Lexend) exibida quando a viewport está em retrato e estreita demais para a atividade: "Para brincar melhor, vire a tela para o lado." Ao voltar à horizontal, a atividade reaparece com o progresso intacto — a camada apenas cobre, não desmonta o jogo. Sem scroll.

## P1 — Indicador "Desafio X de 12"

O indicador fica em `left: 32, top: 28` e a caixa do enunciado é centralizada com 660–820 px de largura; em telas com enunciado largo a margem fica apertada. Ajuste mínimo: garantir folga horizontal constante entre indicador e caixa do enunciado (reduzindo a largura máxima do enunciado quando necessário), mantendo a hierarquia enunciado → cena → Mara → interação. Sem redesenhar a tela.

## Validação

Roteiro automatizado (Playwright, 1200 × 675) percorrendo capa → 12 desafios → síntese → metacognição → final, verificando:

- "Saiu 1" / "Saíram X", "Ficou 1 peixe" / "Ficaram X peixes", "Havia" sempre singular;
- nenhuma fala de observação contendo a quantidade a ser contada;
- ausência de avanço automático após o acerto e funcionamento do botão "Mostrar com números";
- estabilidade da ordem das opções após erro;
- resposta correta das questões finais fora da primeira posição em pelo menos parte das questões;
- ausência de scroll e de interseção geométrica nas telas já validadas anteriormente.
