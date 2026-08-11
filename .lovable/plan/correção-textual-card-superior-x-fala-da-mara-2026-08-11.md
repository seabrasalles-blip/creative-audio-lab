# Correção textual — card superior x fala da Mara

Hoje, na fase de contagem inicial, o mesmo texto (`initialCount.question`) alimenta o card superior e o balão da Mara, produzindo repetição literal. A correção separa as duas fontes de texto. Nada de layout, componentes, assets, áudio ou mecânica muda.

## Regra aplicada

- Card superior: a pergunta/comando (o QUE descobrir).
- Mara: mediação e estratégia (COMO pensar).
- O botão de áudio continua lendo a fala da Mara — passa a ler a mediação, não a pergunta.

## Textos da contagem inicial

| Desafio | Card superior | Mara |
|---|---|---|
| 1 (5 − 1) | Quantos peixes há no recife? | Conte com calma e escolha o número. |
| 2 (6 − 2) | Quantos peixes há no recife? | Olhe para todos os peixes antes de escolher. |
| 3 (8 − 3) | Quantos peixes há no começo? | Conte um por um e escolha o número. |
| 4 (12 − 2) | Quantos peixes há ao todo? | Comece pelo grupo de 10 e conte também os peixes separados. |
| 5 (16 − 4) | Quantos peixes há ao todo? | Use o grupo de 10 para ajudar na contagem. |

Erro na contagem: Mara dá estratégia — "Conte novamente, começando pelo primeiro peixe." (contagem direta) e "Comece pelo grupo de 10 e depois conte os separados." (grupos de 10). Acerto: mantém a confirmação atual ("Isso! Há 8 peixes. Agora veja o que acontece.").

Após o acerto, o card deixa de exibir a pergunta já respondida e passa a "Veja o que acontece." durante a retirada — apenas troca de texto, sem alteração de posição ou tamanho.

## Desafios 6–8 (sem contagem inicial)

Sem reintrodução da pergunta de contagem. Só ajuste das falas de observação para não coincidirem com o card ("Observe os grupos de 10 e os peixes que estão separados."), com variação funcional por habilidade:
- 6 (21 − 10): "Veja quantos grupos de 10 estão no recife."
- 7 (24 − 12): "Compare os grupos de 10 com os peixes separados."
- 8 (35 − 23): "Conte primeiro os grupos de 10, depois os separados."

## Auditoria das demais fases

Varredura comparando o texto do card com a fala da Mara em todas as fases (observe, pergunta, erro, acerto, representação) dos 8 desafios ativos. Onde houver igualdade ou quase-igualdade, muda-se a fala da Mara (nunca o enunciado correto), sempre com função mediadora.

## Detalhes técnicos

- `src/types/game.ts`: `InitialCount` ganha `mediation: Speech` (fala da Mara na microfase).
- `src/data/challenges.ts`: novo campo `initialCountMaraSpeech` nos seeds c1, c2, c3, c5, c7; textos de erro (`initialCountRetry`) revisados; `observe` de c9, c10, c11 diferenciado do card.
- `src/components/game/GameScreen.tsx`: no seletor de fala, `phase === "initial-count"` sem resposta retorna `initialCount.mediation` em vez de `initialCount.question`; o card continua com `initialCount.question.text` e passa a mostrar "Veja o que acontece." quando `countDone`.
- Verificação com Playwright nos desafios 3 e 4 (card, balão e alternativas 7/8/9 e 10/12/20) e varredura textual normalizada card vs balão em todo o fluxo.
