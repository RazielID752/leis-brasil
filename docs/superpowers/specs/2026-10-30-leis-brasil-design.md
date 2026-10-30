# Leis Brasil — proposta de arquitetura e produto

Data: 30/10/2026. Status: proposta para aprovação.

## Objetivo e decisões do usuário

Construir uma biblioteca pública de legislação brasileira, bonita, organizada e fácil de ler e entender. O usuário escolheu combinar o acervo pesquisável com guias explicativos para uma seleção inicial de leis. Requisitos: Next.js, Tailwind CSS, pnpm, SOLID e clean code. Usar componentes do Magic UI onde ajudarem e adaptar as ideias dos componentes Markdown do blog do alivesv5.

## Abordagens consideradas

1. Biblioteca com busca e leitura: publica mais conteúdo com menos trabalho editorial, mas atende parcialmente ao objetivo de compreensão.
2. Biblioteca com guias selecionados: mesma consulta ao acervo, acompanhada de exemplos, notas e diagramas para temas prioritários. Abordagem escolhida pelo usuário.

## Experiência proposta

- Início com busca, assuntos, acesso à Constituição e guias em destaque.
- Catálogo com filtros por esfera, UF, tipo de norma e ano, resultados paginados e estado vazio claro.
- Leitura com índice, links por artigo quando identificáveis, busca no texto, tamanho de fonte e tema claro/escuro.
- Guias com explicações em linguagem simples, exemplos, tabelas, notas, passos e Mermaid, vinculados à norma de referência.
- Fontes e cobertura com origem, data de coleta, versão disponível e limitações da importação.

Proposta visual do implementador: estilo editorial, fundo claro quente, detalhes verdes, títulos marcantes e largura de texto confortável. Magic UI em destaques e transições discretas, respeitando movimento reduzido. No celular, índice recolhível e controles acessíveis.

## Stack e estrutura proposta

Next.js com App Router, TypeScript estrito, Tailwind CSS e pnpm com lockfile. Lucide React como biblioteca única de ícones proposta pelo implementador; confirmar compatibilidade dos componentes Magic UI escolhidos durante a implementação.

Organização por funcionalidades, com limites explícitos:

```text
src/app/                  rotas, layouts, metadados e composição
src/features/legislation/ domínio das normas, consultas e componentes de leitura
src/features/search/      contratos de busca, filtros e apresentação
src/features/guides/      guias editoriais e renderização controlada
src/components/ui/        componentes visuais compartilhados e Magic UI
src/lib/                  configuração e utilitários realmente compartilhados
src/infrastructure/       adaptadores de armazenamento e busca
scripts/import/           coleta, normalização, validação e indexação
content/guides/           conteúdo editorial revisável
content/legislation/      cópia própria e persistida das normas em Markdown
content/manifests/        snapshots, proveniência, hashes e relatórios
```

Entidades e regras não dependem de React, Next.js ou do formato de armazenamento. Casos de uso recebem contratos pequenos de consulta/busca; adaptadores implementam esses contratos. Componentes cuidam da apresentação. Aplicar SOLID nos limites que mudam, sem classes, interfaces ou camadas sem necessidade concreta.

Server Components por padrão. Componentes cliente apenas para interações. Diagramas e recursos pesados carregados sob demanda. Consultas, paginação e carregamento do texto acontecem no servidor.

## Acervo e proveniência

Fonte principal: https://github.com/ctresb/leis. Complemento potencial para a Constituição: https://github.com/abjur/constituicao. Conferir licenças, atribuições e conteúdo antes de incorporar código ou dados de cada fonte.

Importação reprodutível por snapshot identificado por commit, com manifesto, origem do arquivo e hash. Normalizar identificador, título, esfera, UF, município quando disponível, tipo, número, data, ementa, fonte oficial, versão do texto e data de coleta. Preservar campos ausentes como desconhecidos; nunca presumir vigência.

Decisão explícita do usuário: manter uma cópia própria de todo o conteúdo de legislação disponível nas fontes adotadas em arquivos Markdown. O site precisa continuar funcionando se os repositórios de origem forem removidos ou ficarem indisponíveis. Não usar submódulos, links para arquivos remotos ou consultas ao GitHub como armazenamento do conteúdo em produção.

Os arquivos importados e seus metadados são o acervo canônico local. Preservar também os bytes originais de cada snapshot em arquivo de distribuição com manifesto e hashes, antes de normalizar. O objetivo é importar integralmente o conteúdo jurídico disponível, com inventário de arquivos, contagens, validação de integridade e relatório explícito de eventuais falhas; isso não equivale a afirmar cobertura de todas as leis brasileiras.

Atualizações são executadas separadamente do funcionamento do site, com comparação e validação antes da substituição do snapshot ativo. Falhas na coleta preservam a última cópia válida. Manter backup independente do repositório do site e documentar restauração dos Markdown e reconstrução dos índices. Medir o volume para definir o empacotamento e a distribuição do acervo sem depender de Git LFS remoto em tempo de execução.

Uma norma terá identidade canônica e proveniência. O complemento da ABJ não sobrescreverá silenciosamente a Constituição da fonte principal. Divergências ficam registradas. Importações devem ser idempotentes, rejeitar identidades conflitantes e emitir relatório de falhas e cobertura.

Markdown externo será tratado como conteúdo não confiável: sem executar MDX/JavaScript e sem HTML arbitrário. MDX e componentes editoriais ficam restritos aos guias locais revisados.

Não prometer todas as leis já na primeira versão: exibir a cobertura efetivamente importada. Conteúdo demonstrativo, se necessário, deve estar identificado e separado das contagens reais.

## Armazenamento e busca

Markdown é o armazenamento canônico próprio. Decisão proposta do implementador: gerar um índice derivado em SQLite com busca FTS5 no servidor para uma implantação Node com disco persistente, usando importação em lote e índices de metadados. O índice pode ser descartado e reconstruído integralmente a partir dos Markdown e manifestos locais. Validar FTS5 e o adaptador compatível com a versão instalada de Node antes de consolidar a implementação. Não empacotar centenas de milhares de textos no JavaScript cliente nem gerar todas as páginas no build.

O provedor de hospedagem ainda não foi escolhido. Se o destino não oferecer disco persistente, usar banco e mecanismo de busca externos pelos mesmos contratos antes de publicar. A primeira entrega local não inclui contratar infraestrutura ou publicar o site.

## Guias e confiança editorial

Começar pela Constituição. O texto original permanece separado das explicações, cada guia informa a norma e a versão consultadas. Não gerar explicações automaticamente para todo o acervo. Exemplos são didáticos e precisam de revisão; conteúdo pendente não será apresentado como revisado. Histórico de emendas e comparação entre versões ficam fora da primeira entrega, pois dependem da qualidade dos dados.

## Escopo de implementação e validação

Primeira entrega: aplicação local navegável, catálogo e leitor com dados reais, pipeline de importação, busca e filtros, guia inicial da Constituição e documentação de execução e atualização. Medir tamanho e estrutura do snapshot e executar a importação integral do conteúdo jurídico disponível nas fontes adotadas, registrando explicitamente o que foi importado e eventuais falhas ou impedimentos.

Validar parser e normalização com arquivos reais; testar idempotência, conflito de identidade, busca e filtros e segurança da renderização. Executar checagem de tipos, lint e build. Verificar no navegador busca → resultado → leitura → fonte e guia → artigo, incluindo celular, teclado, tema e movimento reduzido.

Verificar independência das fontes: reconstruir o índice e servir catálogo, busca e textos usando somente a cópia local, sem acesso aos repositórios externos. Verificar restauração de backup antes de declarar a preservação validada.

## Fora do escopo inicial

Login, assinatura, chatbot, aconselhamento jurídico personalizado, atualização automática sem auditoria, sincronização de todas as fontes oficiais e garantia de cobertura nacional integral.

## Critérios de sucesso

Encontrar uma norma e abrir sua fonte sem dificuldade; ler em celular com conforto; distinguir texto legal de explicação; conhecer a cobertura e atualização reais; atualizar o acervo de forma repetível sem duplicações; manter mudanças de dados e interface independentes.
