# Correção de layout: balão x cena matemática nos desafios com cardumes

Objetivo: eliminar qualquer interseção geométrica entre a cena matemática (cardumes e peixes) e os elementos de interface (Mara, balão, botões, alternativas), sem redesenhar a interface, sem trocar assets e sem reduzir tipografia.

## Faixas do canvas (1200 × 675)

```text
Y 0   – 130   enunciado
Y 135 – 430   CENA MATEMÁTICA (área protegida)
Y 435 – 665   Mara + balão + alternativas + controles
```

## O que muda

1. **Variável de composição** em `GameScreen.tsx`: `hasTens` (challenge com `tens > 0`, e também a síntese 35 − 23, que usa a mesma cena). Telas sem dezenas mantêm exatamente o layout atual.

2. **Safe zone da cena**: quando `hasTens`, o contêiner da `FishScene` passa a ser um bloco com `top: 135px`, `height: 295px`, centralizado, com `overflow: visible` (para a trajetória de saída continuar visível) e conteúdo alinhado ao topo. A cena deixa de crescer para dentro da faixa inferior.

3. **`FishScene`**: nova prop `compact` (ligada quando há dezenas) que reduz o espaçamento vertical entre a linha de cardumes e a linha de unidades (`gap-6` → `gap-3`), reduz o gap horizontal entre cardumes e limita a largura das unidades para caberem em uma única linha. Nada muda no modo sem dezenas.

4. **Dimensão dos cardumes**: `GROUP_WIDTH` passa a depender da quantidade — 190px para até 3 cardumes, 170px para 4 cardumes (desafio 12). Peixes individuais mantêm 74px; com 6 unidades em linha única isso cabe folgadamente.

5. **Mara**: continua no canto inferior esquerdo; altura 240px nos challenges com dezenas (260px nos demais), garantindo topo abaixo de Y≈435.

6. **Balão contextual**: quando `hasTens`, o balão passa a ficar na faixa inferior ao lado da Mara (`bottom ≈ 30px`, `left ≈ 200px`), com largura 460px em vez de 560px, terminando antes da coluna central das alternativas. Fonte, line-height e contraste permanecem iguais (Lexend, 28px, 1.4).

7. **Alternativas**: nas telas com dezenas, o bloco de alternativas é deslocado para a direita da faixa inferior (mantendo o mesmo componente e tamanho dos botões), de forma que balão e alternativas não se sobreponham nem invadam a área matemática.

8. **Controles** (dica / seguir / ver novamente): permanecem no canto inferior direito, já abaixo de Y=435.

## Validação

Script Playwright no canvas base (1200×675, sem escala) medindo `getBoundingClientRect()` de: cada cardume, cada peixe, o balão, a Mara, o bloco de alternativas e cada botão de controle. Critério: interseção zero entre o conjunto matemático e o conjunto de interface, em todas as fases (observe, removing, question, solved), para os desafios 5 a 12 — com atenção especial ao 11 (35 − 23) e ao 12 (46 − 24) — além da tela de síntese. Também verifico ausência de scroll e que nenhum elemento sai da viewport lógica.

## Não muda

Mecânica, progressão, respostas, animação de retirada, tentativas, feedbacks, dicas, áudio pt-BR e fallback, assets, identidade visual, navegação e o escalonamento 16:9.
