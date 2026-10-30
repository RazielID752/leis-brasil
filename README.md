# leisbrasil

Biblioteca de legislação brasileira em Next.js, TypeScript, Tailwind CSS, pnpm, Lucide e Magic UI. **Constituição e guias ficam locais; outras leis são carregadas do repositório ao abrir. Não há SQLite, importação nacional ou índice nacional no projeto.**

A ideia do projeto é facilitar o acesso à informação e a compreensão da legislação brasileira, tanto pelo público geral quanto por advogados e outros profissionais. O objetivo não é substituir as fontes oficiais: cada página inclui um link para a fonte oficial correspondente.

## Origem do acervo e agradecimentos

Os textos legais utilizados pelo leisbrasil vêm do projeto [ctresb/leis](https://github.com/ctresb/leis), que organiza a legislação brasileira em Markdown a partir de fontes oficiais. A Constituição mantida localmente também foi obtida desse acervo. O leisbrasil acrescenta a experiência de navegação, busca e materiais educativos; não é o autor das normas nem o mantenedor do repositório de origem.

Agradecemos aos mantenedores e colaboradores de **ctresb/leis** pelo trabalho de coleta, organização e disponibilização dos textos. Se este site for útil para você, considere também apoiar o acervo na origem:

- Confira as orientações no [README de ctresb/leis](https://github.com/ctresb/leis#readme).
- Ajude a identificar erros de conversão, lacunas ou divergências, indicando a fonte oficial e a versão consultada nas [issues do acervo](https://github.com/ctresb/leis/issues).
- Se puder contribuir com correções ou melhorias na coleta e organização, confira as [propostas já abertas](https://github.com/ctresb/leis/pulls) e siga o fluxo de contribuição definido pelos mantenedores.

Para melhorar a interface, a busca ou os guias do **leisbrasil**, consulte nosso [guia de contribuição](CONTRIBUTING.md). Cada projeto tem seus próprios responsáveis e critérios de revisão; a referência à fonte não implica parceria ou vínculo entre os projetos.

O projeto [abjur/constituicao](https://github.com/abjur/constituicao) também é uma referência complementar para a Constituição. Seus dados não substituem o texto local utilizado nesta versão.

## Executar

Node.js 24.5+ e pnpm 10.18.3:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abra http://localhost:3000. Sem chaves de API e sem baixar o acervo inteiro.

```sh
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## O que fica local

- `content/constituicao.md`: Constituição completa, 722.006 bytes (~705 KiB).
- `content/guides`: guias editoriais, separados do texto legal.
- `content/catalog/laws.json`: metadados de uma seleção inicial de 19 normas, incluindo a Constituição. Cerca de 11 KB de dados serializados; sem os textos das outras 18 leis.
- `content/catalog/source.json`: origem, commit consultado e SHA-256 da Constituição.
- Código, componentes, imagens e avisos/licenças das fontes.

A busca de `/leis` consulta **somente esse catálogo selecionado**, por títulos, ementas, números e nomes usuais. Não é busca nacional completa. A interface informa seu alcance.

## Outras leis

`/acervo` permite navegar pelas pastas da fonte por esfera, UF, tipo e ano. Consulta uma árvore por vez, sem percorrer ou baixar todo o repositório. Os nomes dos arquivos podem ser filtrados dentro da pasta atual; os metadados completos aparecem ao abrir o texto. Listagens limitadas pela origem são sinalizadas.

O servidor carrega o Markdown de `ctresb/leis` usando um commit fixo em `src/infrastructure/upstream.ts`, preservando a versão consultada. Não segue mudanças de `main` silenciosamente e não garante ser a redação mais recente. A Constituição local não depende dessas chamadas.

### Cache limitado

- Textos: LRU em memória, até **16 MiB e 128 entradas por processo**; TTL de 6 horas.
- Em falha de rede, cópia já consultada pode ser usada por mais 7 dias, dentro do mesmo limite e identificada no leitor.
- Um texto remoto pode ter até 8 MiB. Respostas são limitadas durante a leitura, com timeout e concorrência limitada a 8 downloads distintos.
- Diretórios: cache separado de até 4 MiB/128 árvores, 24 horas de validade e 24 horas extras em caso de indisponibilidade; até 4 consultas simultâneas.
- Cache de processo desaparece no reinício; não é backup nem garante disponibilidade offline das leis remotas. Não persiste em `.next` nem cria novos arquivos Markdown.

A API pública de diretórios do GitHub tem limites de requisições (sem autenticação, normalmente 60 por hora por IP). O cache reduz chamadas repetidas. O site apresenta indisponibilidade quando necessário e mantém Constituição/guias acessíveis. A arquitetura aceita um adaptador de dados diferente se o tráfego crescer; esta entrega não contrata serviços.

## Atualizar o catálogo

```sh
pnpm catalog:update
```

Atualiza somente os metadados das entradas já selecionadas, preservando seus identificadores e nomes usuais. Não salva os textos remotos no disco. Execute com a aplicação parada e confira os arquivos antes de publicar; o catálogo é importado pelo build. Para acrescentar uma norma, registre o caminho e os metadados reais em `laws.json`, valide o caminho e rode os testes. Para trocar a versão remota, atualize o commit em `upstream.ts`, regenere os metadados e revise a Constituição separadamente; não substituir automaticamente o arquivo local.

## Organização e segurança

- `src/app`: rotas e composição, com Server Components por padrão.
- `src/features/legislation`: domínio, validação dos caminhos, leitor e Markdown seguro.
- `src/features/search`: busca do catálogo e paginação.
- `src/features/guides`: notas/tabelas e Mermaid carregado sob demanda.
- `src/infrastructure`: adaptadores de acesso, fonte remota, cache e navegação.
- `src/components`: interface compartilhada.

`LegislationRepository` separa a consulta da apresentação; a leitura é assíncrona. A fonte remota restringe caminhos e hosts, sem executar HTML/MDX/JavaScript vindo do repositório. Imagens remotas são omitidas. Metadados ausentes não viram confirmação de vigência.

## Backup local

```sh
pnpm backup /private/tmp/leisbrasil-backups
```

Guarda Constituição, guias, catálogo e licenças, com SHA-256 ao lado. **Não contém as leis remotas.** Copie esse arquivo e seu hash para outro disco se quiser proteção contra falha do computador; `/tmp` pode ser limpo pelo sistema. Preserve também o código e o lockfile. O acervo parcial do modelo anterior foi removido pelo usuário e não é necessário nem restaurado por esta aplicação.

## Fontes e limites

A origem do acervo e as formas de contribuir estão descritas acima. A página `/sobre` explica cobertura, datas, origem e limitações. Conversões podem ter erros e não substituem a fonte oficial. O guia inicial está identificado como pendente de revisão jurídica.

O visual aprovado usa títulos editoriais, verde escuro, fundo claro e leitura confortável. Dot Pattern adapta Magic UI (MIT); licenças em `docs/legal`. A imagem do livro foi gerada com image_gen; referência em `docs/assets.md`.

Os planos de importação integral anteriores em `docs/superpowers` são históricos e foram substituídos pelo [modelo híbrido](docs/superpowers/plans/2026-10-30-modelo-hibrido.md).

## Aviso legal e colaboração

O texto educativo e informativo está em `content/legal/aviso-legal.md` e aparece em `/sobre#aviso-legal`, com acesso pelo rodapé e pelo leitor. As referências de redação estão em `docs/legal/aviso-editorial-notes.md`. O aviso esclarece fontes e limites do serviço; não promete exclusão geral de responsabilidade e requer revisão jurídica antes da publicação como política definitiva. [CONTRIBUTING.md](CONTRIBUTING.md) explica fork, branch, validação e envio de Pull Requests; nenhum endereço de repositório próprio ou contato público foi inventado.
