# Mara e as Subtrações no Recife de Corais

Atividade interativa de Matemática (EF01MA08) para crianças de 6 a 8 anos, em um canvas ilustrado de 1200 × 675 (16:9), com todos os visuais vindos exclusivamente dos assets enviados.

## Assets recebidos (28 arquivos)

- mara: neutral, presenting, presenting1, pointing, thinking, celebrating, feedback
- animals: fish-turquoise, fish-yellow, fish-group-10, seahorse, starfish
- environment: coral, seaweed, shell, rocks, cave
- backgrounds: cover-title, bg-activity, bg-transition-ten, bg-transition-cave, bg-reflection, bg-final
- buttons: btn-start, btn-next, btn-back, btn-restart, btn-hint, btn-audio

Faltando em relação ao documento: `mara-observing` e `mara-encouraging`. Vou reaproveitar `mara-thinking` (observar) e `mara-feedback` (encorajar) e deixar registrado no código, sem criar nenhuma imagem nova.

Áudios: ainda não enviados. A arquitetura já nasce pronta para receber `/assets/audio/*.mp3` por chave de fala; enquanto não chegarem, o fallback é SpeechSynthesis pt-BR (rate 0.9, pitch 1).

## Estrutura da experiência (~20 estados, um único componente controlado por estado)

1. Capa — `cover-title.png` + botão INICIAR (sem cards sobre a arte)
2. Apresentação — Mara se apresenta, botão SEGUIR
3. Tutorial — 3 peixes, 1 sai, quantos ficaram (sem pontuação)
4. Desafios 1–4 — 5−1, 6−2, 8−3, 9−4 (peixes individuais)
5. Transição dezena — `bg-transition-ten` + 1 cardume = 10
6. Desafios 5–8 — 12−2, 14−3, 16−4, 18−5 (1 cardume + unidades)
7. Transição cardumes — `bg-transition-cave`, demonstração 23−11
8. Desafios 9–12 — 21−10, 24−12, 35−23, 46−24 (sem reagrupamento)
9. Síntese — `bg-reflection`, 35−23=12 representado por cardumes
10. Metacognição — 3 perguntas reflexivas, sem penalização
11. Encerramento — `bg-final`, Mara comemorando, RECOMEÇAR

## Mecânica de cada desafio

Observação (enunciado + quantidade inicial, sem alternativas) → clique → animação de saída (cardume primeiro, depois unidades, ~800–1400 ms, máx. 2,5 s) → 3 alternativas grandes + VER NOVAMENTE → feedback no balão da Mara. Erro não avança, não revela a resposta, Mara orienta e a criança tenta de novo quantas vezes quiser. Botão de dica disponível, sem entregar a resposta. `selectedAnswer` inicia sempre `null`.

## Direção visual

Cena ilustrada, nunca dashboard: sem glassmorphism, sem gradientes, sem neon, sem emojis, sem ícones de biblioteca, sem ilustração em CSS/SVG. Botões são o PNG oficial dentro de um `<button>` transparente (hover scale 1.03, active 0.97). Balão da Mara em HTML simples: fundo creme, contorno azul-marinho, ponta pequena, no máximo 3 linhas. Tipografia Lexend (textos) + Fredoka (números/títulos curtos), tamanhos mínimos do documento (enunciado 30–32 px, fala 28 px, numerais 44–52 px), sem caixa alta em textos de leitura.

## Acessibilidade e áudio

Todo botão com `aria-label`, `focus-visible` e ativação por teclado. Toda fala da Mara tem texto na tela + botão de áudio (`btn-audio.png`). Um áudio interrompe o anterior; trocar de tela interrompe a fala. Nenhuma informação essencial só em áudio. Sem autoplay antes do primeiro clique.

## Detalhes técnicos

- Rota única `/` (substitui o placeholder), um `GameScreen` com estado controlado; sem rota por questão.
- Componentes: `GameCanvas` (scale proporcional), `Character`, `SpeechBubble`, `Scene`, `FishGroup`, `AnswerOptions`, `Feedback`, `Navigation`, `ProgressIndicator`.
- Dados separados em `src/data/`: `challenges.ts` (12 desafios + demos), `speech.ts` (fonte única texto+chave de áudio), `feedback.ts`.
- Hooks: `useCanvasScale` (min(vw/1200, vh/675) + `transform: scale`), `useMaraVoice` (arquivo mp3 quando existir, senão SpeechSynthesis pt-BR), `useAssetPreload`.
- Assets publicados no CDN do Lovable via ponteiros `.asset.json`, centralizados em um registro `src/data/assets.ts` que expõe os caminhos como `/assets/...` para o código — nada de URL externa, nada de binário pesado no repositório, e a troca por arquivos locais depois é um ponto único.
- Framer Motion apenas para as animações de saída. `html, body { overflow: hidden }` para garantir zero scroll.
- Head SEO próprio da rota (título/descrição em pt-BR).

## Sobre os áudios

Quando você enviar os mp3, eles entram só como novos valores no mapa de falas — nenhuma mudança de arquitetura.
