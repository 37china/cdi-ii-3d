# CDI II 3D

Modelos 3D interativos de Cálculo Diferencial e Integral II, feitos a partir dos apontamentos das teóricas (Alameda). Servem para explorar a matéria e para a explicar a outras pessoas.

**App:** https://37china.github.io/cdi-ii-3d/

## Matérias

| # | Matéria | Modelos | Apontamentos |
|---|---|---|---|
| 1 | Topologia em ℝⁿ | Bolas e pontos em ℝ²; bolas em ℝ³ (esfera, cilindro, cone); sucessões e fecho | pp. 2–5 |
| 2 | Diferenciabilidade | Plano tangente e o(h); derivada direcional; Jacobiana | pp. 6–16 |
| 3 | Regra da cadeia | Ao longo de uma curva; forma matricial com o gráfico de f∘g e o plano tangente | pp. 16–21 |
| 4 | Linhas, gradiente e plano tangente | Vetor tangente; gradiente e linhas de nível (com o gráfico em 3D); plano tangente a superfícies de nível | pp. 18–24 |
| 5 | Hessiana e extremos livres | Pontos críticos e valores próprios; Schwarz | pp. 24–27 |
| 6 | Função inversa e implícita | Implícita (com o gráfico de F e o corte z = 0); inversa em ℝ²; inversa em ℝ | pp. 27–33 |
| 7 | Extremos condicionados | Uma restrição, com a curva levantada até ao gráfico de f; duas restrições em ℝ³ | pp. 33–35 |
| 8 | Integrais duplos e triplos | Volume debaixo de f, fatias e somas de Riemann; área por cortes e ordens; cortes em z e as 3! ordens | pp. 35–41 |
| 9 | Mudança de variáveis | Polares, elipse, região deslocada, anel; células cilíndricas e esféricas em 3D | pp. 41–45 |
| 10 | Coordenadas cilíndricas e esféricas | O ponto P e a caixinha de volume; os sólidos das teóricas e os cortes θ constante | pp. 45–49 |
| 11 | Campos vetoriais e Green | Green com fluido, roda de pás e o rotacional em 3D; potencial como superfície (e a escada em caracol do vórtice); área com Green | pp. 49–53 |
| 12 | Superfícies em ℝ³ | Esfera parametrizada; gráfico; área | — |

## Três modos em cada matéria

- **Explorar:** os modelos para mexer à vontade. Arrasta para rodar, usa a pinça (ou Ctrl + roda do rato) para o zoom, ▶ anima cada barra, e os pontos marcados com um anel arrastam-se diretamente no desenho.
- **Explicar:** uma sequência de passos para mostrar a alguém. Cada passo põe o modelo no estado certo e tem o texto ao lado.
- **Testa-te:** perguntas de escolha múltipla com a justificação da resposta. A pontuação só dura enquanto a página está aberta.

O endereço muda à medida que navegas. Por exemplo, `#/hessiana/criticos/explicar/5` abre o passo 5 do Explicar da Hessiana. Assim podes mandar a alguém o link exato.

## Privacidade

Não há servidor, contas nem base de dados. A app não guarda nada no dispositivo, exceto a cópia offline dos próprios ficheiros (para abrir sem internet depois da primeira visita). Só a letra do texto vem do Google Fonts; sem ela, usa-se a letra do sistema. O three.js e o KaTeX (com as suas fontes) estão no próprio repositório.

## Instalar no iPhone ou iPad

Abrir no Safari → Partilhar → Adicionar ao ecrã principal.

## Estrutura

```
index.html              página
css/app.css             estilos (tema claro e escuro)
js/math.js              contas: vetores, derivadas e integrais numéricos, linhas de nível
js/tex.js               fórmulas com KaTeX ($…$ e $$…$$)
js/vista3d.js           motor 3D em WebGL (three.js)
js/plano.js             plano 2D: regiões, campos, linhas de nível, pontos arrastáveis
js/app.js               lista de matérias, modos e controlos
js/materias/*.js        uma matéria por ficheiro
testes/contas.js        verifica os valores exatos usados nos textos
testes/estrutura.js     verifica passos e perguntas
vendor/                 three.js e KaTeX, incluídos no repositório (licenças MIT em vendor/LICENSE-*.txt)
```

Para acrescentar uma matéria, cria um ficheiro em `js/materias/` que chame `CDI.materia({...})` (os existentes servem de modelo) e junta-o ao `index.html` e ao `sw.js`.

## Testes

```
node testes/contas.js
node testes/estrutura.js
```

## Publicar

GitHub Pages a partir do ramo `main`, pasta `/ (root)`. Não há passo de compilação: é HTML, CSS e JavaScript. O `vendor/t3.min.js` é um pacote do three.js (r188) feito uma vez com o esbuild, só com as partes usadas.
