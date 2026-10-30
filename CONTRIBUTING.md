# Como contribuir com o leisbrasil

O leisbrasil é um projeto educativo para facilitar o acesso e a compreensão da legislação brasileira. Você pode contribuir com código, documentação, acessibilidade, guias ou correções acompanhadas de fonte oficial.

O repositório público próprio ainda não foi divulgado no site. O fluxo abaixo será usado quando ele estiver disponível; não use os repositórios de origem dos textos como se fossem o repositório ou o atendimento do leisbrasil.

## Entenda o fluxo

**Issue → fork → branch → alteração → validação → Pull Request → revisão → merge.**

- **Issue:** conversa pública sobre um problema ou uma proposta.
- **Fork:** uma cópia do repositório na sua conta do GitHub.
- **Branch:** um espaço para trabalhar em uma mudança sem misturá-la com outras.
- **Pull Request (PR):** pedido para incorporar a sua alteração ao projeto.
- **Merge:** incorporação da mudança depois da revisão dos mantenedores.

As alterações devem ser propostas por PR; enviar um PR não publica a mudança automaticamente nem garante sua aprovação. Para uma correção pequena, você pode abrir um PR direto. Para uma funcionalidade nova, mudança de arquitetura ou explicação jurídica relevante, abra uma issue primeiro para alinhar a proposta e evitar trabalho duplicado.

## 1. Explique o problema ou a ideia

Procure issues e PRs existentes antes de começar. Ao abrir uma issue, informe a página ou trecho afetado, o comportamento observado e o resultado esperado. Para um bug visual, inclua navegador, tamanho da tela, passos para reproduzir e uma captura quando possível.

Para correções jurídicas, indique artigo, redação/versão consultada e link da fonte oficial. Issues e PRs não são canal de consulta jurídica individualizada. Não publique dados pessoais, nomes de partes, CPF, documentos ou informações sigilosas de situações concretas.

## 2. Faça um fork e prepare uma branch

No GitHub, abra o repositório do **leisbrasil**, clique em **Fork** e copie a URL do seu fork em **Code**. Clone essa URL no computador e entre na pasta do projeto. Você também pode usar GitHub Desktop.

Crie uma branch para uma única mudança:

```sh
git switch -c fix/menu-mobile
```

Use nomes curtos que descrevam o trabalho: `fix/menu-mobile`, `docs/guia-de-leitura` ou `feat/navegacao`. Esses nomes são exemplos; escolha o nome correspondente à sua contribuição.

Requer Node.js 24.5+ e pnpm 10.18.3:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abra http://localhost:3000. Não é necessário baixar o acervo nacional, configurar banco de dados ou obter uma chave de API para iniciar o projeto. A Constituição é local; consultar outras normas exige acesso à fonte remota.

## 3. Faça uma alteração focada

Mantenha o PR concentrado em um problema. Evite misturar uma correção visual com refatorações ou atualizações de dependências sem relação com ela.

- Separe regras de domínio, acesso às fontes e apresentação.
- Use os componentes, TypeScript e estilos Tailwind existentes.
- Não execute MDX, HTML arbitrário ou JavaScript importado das fontes.
- Preserve cache limitado, caminhos permitidos e a distinção entre indisponibilidade e documento inexistente.
- Não acrescente download nacional ao build nem milhares de textos ao repositório.
- Preserve licenças e atribuições dos materiais de terceiros.

Para um bug ou regra nova, acrescente um teste de regressão quando ele comprovar um comportamento relevante. Para ajustes apenas de texto ou documentação, os comandos de código podem não ser necessários; explique isso na validação do PR.

## 4. Valide sua contribuição

Para mudanças de código, execute:

```sh
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

Em mudanças de interface, teste desktop e celular, navegação por teclado, tema claro/escuro e os estados afetados. Inclua capturas de antes/depois quando ajudarem a revisão. Se uma verificação não puder ser executada, diga qual foi e por quê; não marque como aprovada uma checagem que não rodou.

Antes de criar o commit, confira o que será enviado:

```sh
git status --short
git diff
```

Adicione ao commit somente os arquivos da sua mudança usando seu editor ou `git add` com os caminhos escolhidos. Revise o conteúdo selecionado com `git diff --cached`, faça um commit com descrição clara e envie a branch para o seu fork:

```sh
git push -u origin fix/menu-mobile
```

No comando acima, troque `fix/menu-mobile` pelo nome da branch que você criou.

## 5. Abra o Pull Request

No GitHub, use **Compare & pull request** ou **Pull requests → New pull request**. Confira a comparação:

- **Base:** repositório original do leisbrasil e sua branch padrão.
- **Compare/head:** seu fork e a branch com a alteração.

Preencha o modelo de PR com o problema, o que mudou, como verificou e as fontes utilizadas. Se houver uma issue relacionada, vincule-a na descrição, por exemplo `Closes #123` quando o PR resolver aquela issue. O número é um exemplo.

Se o trabalho ainda estiver em andamento, abra um **Draft Pull Request**. Quando estiver pronto, solicite revisão. Para um ajuste pequeno em documentação, você também pode usar o editor do GitHub e a opção de propor a alteração por PR, sem rodar o projeto localmente.

## 6. Aguarde a revisão e responda aos comentários

Os mantenedores podem pedir ajustes, fontes adicionais ou explicações. Novos commits enviados à **mesma branch** atualizam o PR; não é necessário abrir outro PR para cada correção.

A aprovação e o merge cabem aos mantenedores. Não há prazo de resposta garantido. Explicações jurídicas exigem atenção editorial específica; um build verde não comprova correção jurídica. A incorporação de uma contribuição não representa chancela oficial ou aconselhamento individualizado.

## Cuidados com normas e guias

Não altere uma norma para encaixá-la em uma explicação. Mudanças no texto original precisam de fonte oficial e identificação da versão; explicações e interpretações ficam nos guias, separadas do texto legal. Não afirme revisão jurídica, vigência ou atualização que não foram verificadas.

A Constituição é o único texto legal integral persistido no projeto. Preserve esse modelo. A publicação de um repositório não autoriza automaticamente reutilizar qualquer material sob qualquer licença; observe as licenças de cada conteúdo.

## Referências

- [Como contribuir por fork e PR — GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project)
- [Como criar um Pull Request — GitHub](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request)
