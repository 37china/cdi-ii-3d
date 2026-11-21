# CDI II 3D

Modelos 3D interativos de Cálculo Diferencial e Integral II, feitos a partir dos apontamentos das teóricas (Alameda). Servem para explorar a matéria e para a explicar a outras pessoas.

**App:** https://37china.github.io/cdi-ii-3d/

## Matérias

| # | Matéria | Modelos | Apontamentos |
|---|---|---|---|
| 1 | Topologia em ℝⁿ | Bolas e pontos (interior, exterior, fronteira); sucessões e fecho | pp. 2–5 |
| 2 | Diferenciabilidade | Plano tangente e o(h); derivada direcional; Jacobiana | pp. 6–16 |
| 3 | Regra da cadeia | Ao longo de uma curva; forma matricial | pp. 16–21 |
| 4 | Linhas, gradiente e plano tangente | Vetor tangente; gradiente e linhas de nível; plano tangente a superfícies de nível | pp. 18–24 |
| 5 | Hessiana e extremos livres | Pontos críticos e valores próprios; Schwarz | pp. 24–27 |
| 6 | Função inversa e implícita | Implícita; inversa em ℝ²; inversa em ℝ | pp. 27–33 |
| 7 | Extremos condicionados | Uma restrição em ℝ²; duas restrições em ℝ³ | pp. 33–35 |
| 8 | Integrais duplos e triplos | Cortes e ordens; cortes em z e as 3! ordens | pp. 35–41 |
| 9 | Mudança de variáveis | Polares, elipse, região deslocada, anel | pp. 41–45 |
| 10 | Coordenadas cilíndricas e esféricas | O ponto P e a caixinha de volume; os sólidos das teóricas | pp. 45–49 |
| 11 | Campos vetoriais e Green | Teorema de Green; potencial e caminhos; área com Green | pp. 49–53 |
| 12 | Superfícies em ℝ³ | Esfera parametrizada; gráfico; área | — |

## Três modos em cada matéria

- **Explorar:** os modelos para mexer à vontade. Arrasta para rodar, usa a pinça (ou Ctrl + roda do rato) para o zoom, ▶ anima cada barra, e os pontos marcados com um anel arrastam-se diretamente no desenho.
- **Explicar:** uma sequência de passos para mostrar a alguém. Cada passo põe o modelo no estado certo e tem o texto ao lado.
- **Testa-te:** perguntas de escolha múltipla com a justificação da resposta. A pontuação só dura enquanto a página está aberta.

O endereço muda à medida que navegas. Por exemplo, `#/hessiana/criticos/explicar/5` abre o passo 5 do Explicar da Hessiana. Assim podes mandar a alguém o link exato.

## Privacidade

Não há servidor, contas nem base de dados. A app não guarda nada no dispositivo, exceto a cópia offline dos próprios ficheiros (para abrir sem internet depois da primeira visita). Só a letra vem do Google Fonts; sem ela, usa-se a letra do sistema.

## Instalar no iPhone ou iPad

Abrir no Safari → Partilhar → Adicionar ao ecrã principal.

## Estrutura

```
index.html              página
css/app.css             estilos (tema claro e escuro)
js/math.js              contas: vetores, derivadas e integrais numéricos, linhas de nível
js/vista3d.js           motor 3D em canvas (sem WebGL nem bibliotecas)
js/plano.js             plano 2D: regiões, campos, linhas de nível, pontos arrastáveis
js/app.js               lista de matérias, modos e controlos
js/materias/*.js        uma matéria por ficheiro
testes/contas.js        verifica os valores exatos usados nos textos
testes/estrutura.js     verifica passos e perguntas
```

Para acrescentar uma matéria, cria um ficheiro em `js/materias/` que chame `CDI.materia({...})` (os existentes servem de modelo) e junta-o ao `index.html` e ao `sw.js`.

## Testes

```
node testes/contas.js
node testes/estrutura.js
```

## Publicar

GitHub Pages a partir do ramo `main`, pasta `/ (root)`. Não há passo de compilação: é HTML, CSS e JavaScript.
