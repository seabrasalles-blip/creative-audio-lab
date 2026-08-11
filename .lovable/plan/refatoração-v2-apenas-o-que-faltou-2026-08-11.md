# Refatoração V2 — apenas o que faltou

Intervenção cirúrgica: dados, fluxo e uma nova microfase. Layout, assets, áudio e componentes visuais existentes permanecem como estão.

## 1. Fluxo com 8 desafios

Novo percurso ativo (dados antigos permanecem no arquivo, fora do fluxo):

```text
1) 5 − 1 = 4      2) 6 − 2 = 4     3) 8 − 3 = 5
4) 12 − 2 = 10    5) 16 − 4 = 12
6) 21 − 10 = 11   7) 24 − 12 = 12  8) 35 − 23 = 12
```

Momentos narrativos usando as transições já existentes: 1–3 (retirada simples), transição → 4–5 (grupos de 10), transição → 6–8 (sai grupo de 10 + peixes separados). O indicador passa a derivar o total do fluxo ativo (`Desafio X de 8`), sem número fixo no código.

## 2. Terminologia "grupo de 10 peixes"

Revisão de todos os textos (enunciados, dicas, falas, feedbacks, síntese, metacognição): nenhuma afirmação de que "cardume = 10". O asset de 10 peixes passa a ser chamado de "grupo de 10 peixes". Primeira apresentação (transição do momento 2): "Agora há mais peixes! Para facilitar a contagem, alguns se organizaram em grupos de 10." + "Este grupo tem 10 peixes." — sem repetir depois. "Cardume" continua permitido só como elemento narrativo do mar.

## 3. Observação ativa (nova microfase `initial-count`)

Nos desafios 1–5, antes da retirada a criança responde quantos peixes há; nos 6–8 esse apoio é retirado (Mara apenas orienta a observar e a criança inicia a retirada).

Fluxo: observe → initial-count → removing → question → solved → represent → seguir.

- Acerto: feedback curto ("Isso! Há 5 peixes. Agora veja o que acontece."), alternativas somem antes da animação.
- Erro: sem penalidade e sem contar como erro da subtração — "Conte novamente os peixes." / nos grupos de 10: "Comece pelo grupo de 10 e depois conte os peixes separados." Nova tentativa liberada.
- Depois disso, Mara não repete a quantidade inicial: "1 peixe saiu. Quantos ficaram?" (singular/plural pelo helper existente).
- Sem tela nova, sem pontuação extra, sem botões concorrentes (Seguir, dica, operação) durante a microfase.

Opções configuradas nos dados: D1 [4,5,6]→5, D2 [5,6,7]→6, D3 [7,8,9]→8, D4 [10,12,20]→12, D5 [10,16,6]→16.

## 4. Representação simbólica adaptada

Mesmo componente, apenas nova progressão de andaimagem: D1–D2 demonstração completa; D3 uma lacuna (resultado); D4 uma lacuna (quanto saiu); D5 duas lacunas [4, 12]; D6 duas lacunas [21, 11]; D7 e D8 três lacunas (24 − 12 = 12 / 35 − 23 = 12). A cena final continua visível durante a fase.

Caso 24 − 12 = 12: as opções passam a ter identidade própria (id + valor) em vez de serem identificadas só pelo número, para que os dois "12" possam ser usados em lacunas diferentes sem perder opção nem seleção automática errada.

## 5. Metacognição — 2 situações

Mesmo layout e componente; muda só o conteúdo:

1. Situação concreta visível (8 peixes, 3 saem, 5 ficam) — "Qual operação mostra o que aconteceu?" → 8 − 3 = 5 (distratores 8 + 3 = 11 e 5 − 3 = 2).
2. "Em 14 − 3 = 11, o que o número 3 mostra?" → "Quantos saíram."

A pergunta antiga sobre cardume e as demais são removidas do fluxo.

## 6. Síntese final

"Primeiro observamos quantos peixes havia. Depois vimos quantos saíram. Por fim descobrimos quantos ficaram." com 8 − 3 = 5 como exemplo, sem terminologia antiga.

## Detalhes técnicos

- `src/data/challenges.ts`: seeds para os 8 desafios (5−1, 6−2, 8−3, 12−2, 16−4, 21−10, 24−12, 35−23), campos `initialCountCheck`, `initialCountQuestion`, `initialCountOptions`, feedbacks curtos de contagem; repSeeds na nova progressão; seeds antigos preservados fora do fluxo.
- `src/types/game.ts`: campos de contagem inicial em `Challenge`, fase `"initial-count"` em `Phase`, opção de representação com `{ id, value }`.
- `src/data/flow.ts`: novo percurso, textos das transições/síntese, apenas 2 perguntas de metacognição.
- `src/components/game/GameScreen.tsx`: extensão mínima — estado da microfase reaproveitando a safe zone e o componente de alternativas já usados na fase `question`; nada mais reorganizado. Total do indicador derivado do fluxo.
- `src/components/game/OperationBuilder.tsx`: somente a chave/identificação das opções (id em vez de valor) para suportar valores repetidos; tamanhos, fontes e posições intactos.
- `src/lib/pt.ts`: descrição de dezenas passa a "grupo(s) de 10".
- Validação com Playwright nos desafios 1, 4, 6, 7 e 8, mais varredura por strings antigas ("cardume vale 10", "de 12").
