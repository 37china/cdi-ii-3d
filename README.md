# CDI II IST

App de Cálculo Diferencial e Integral II (IST) que parte das definições: em cada matéria, definição → teoremas e proposições (com as hipóteses) → exemplos → contraexemplos → exercícios. Ao lado há sempre um modelo 2D/3D onde escreves as tuas próprias funções.

**App:** https://37china.github.io/cdi-ii-3d/ · versão anterior: https://37china.github.io/cdi-ii-3d/antiga/

## Matérias (uma por linha do programa)

| # | Linha do programa | Modelos |
|---|---|---|
| 1 | Noções básicas topológicas em ℝⁿ, sucessões | bolas e pontos em ℝ², bolas em ℝ³, sucessões e fecho |
| 2 | Campos escalares e vetoriais. Limite e continuidade. Diferenciabilidade e gradiente | desenha a tua função (ℝ, ℝ², ℝ³), campo vetorial, limites por caminhos, plano tangente e o(h), derivada direcional, Jacobiana, regra da cadeia, gradiente e níveis, plano tangente a superfícies de nível |
| 3 | Teorema de valor intermédio | valor intermédio num caminho (com domínio e funções descontínuas) |
| 4 | Funções Cᵏ, lema de Schwarz. Extremos e pontos de sela | derivadas de 2.ª ordem, pontos críticos |
| 5 | Weierstrass, Taylor, Hessiana, multiplicadores de Lagrange | extremos num compacto, polinómio de Taylor, Hessiana, Lagrange em ℝ² e ℝ³ |
| 6 | Inversa e implícita | inversa em ℝ e em ℝ², função implícita |
| 7 | Integrais múltiplos e aplicações | volume e somas de Riemann, cortes e ordens, integrais triplos, sólido pelos limites (o aluno propõe, a app verifica), polares, células, mudar de coordenadas passo a passo, cilíndricas, esféricas |
| 8 | Curvas, caminhos e integrais de linha | vetor tangente, comprimento e ∫f ds (massa, centro de massa, inércia), trabalho ∫F·dr |
| 9 | TFC para integrais de linha | trabalho com potencial proposto pelo aluno, potencial e caminhos |
| 10 | Green | teorema de Green (fluido e roda de pás), área com Green |
| 11 | Campos vetoriais gradientes de campos escalares | campos fechados, potencial, vórtice |
| + | Superfícies em ℝ³ (extra) | esfera parametrizada, gráfico, área |

## Três modos

- **Aprender:** os passos da matéria, partindo das definições, com o modelo ao lado sempre disponível. Os teoremas centrais têm um esboço da demonstração.
- **Laboratório:** os modelos, livres.
- **Exercícios:** aquecimento de escolha múltipla e exercícios originais do tipo dos testes, cada um com dicas, resolução passo a passo ou só a solução, «Abrir no modelo» e «Gerar outro».

Em todos os modelos podes escrever as funções como no caderno: `2x`, `xy`, `x^2` ou `x²`, `sen`/`sin`, `√` ou `sqrt`, `|x|`, `pi`, `e`, decimais com vírgula ou ponto, coordenadas separadas por `;`, funções por ramos e condições com `≤`, `≥`, `≠`, `e`, `ou`.

O endereço guarda a matéria, o passo e as funções que escreveste: copia-o para partilhar exatamente o que estás a ver. A app não tem contas nem servidor e não guarda nada no dispositivo.

## Estrutura

- `index.html`, `css/app.css`, `sw.js` (funciona sem internet depois da primeira visita)
- `js/expr.js`: leitor de expressões (texto → função e TeX, conversão de coordenadas)
- `js/math.js`, `js/tex.js`, `js/vista3d.js`, `js/plano.js`, `js/app.js`, `js/livre.js`
- `js/modelos/`: os modelos interativos
- `js/materias/`: uma matéria por linha do programa (Aprender, aquecimento, exercícios e geradores)
- `testes/`: `node testes/contas.js`, `node testes/expr.js`, `node testes/estrutura.js`
- `antiga/`: a versão anterior

Bibliotecas: three.js e KaTeX (em `vendor/`); tipos de letra Newsreader e IBM Plex (OFL), guardados localmente.
