# Execução — Leis Brasil

Plano: docs/superpowers/plans/2026-10-30-leis-brasil.md
Aprovação: usuário autorizou começar após revisão da arquitetura e decisão de armazenamento Markdown local.
Workspace: diretório novo, sem repositório Git preexistente; execução no diretório solicitado, sem worktree para evitar duplicar acervo volumoso.
Preflight: Task 2 consome LawDocument/searchLaws/getLaw da Task 1; Task 3 consome manifesto/importação. Sem conflitos.
Execução direta nesta sessão, conforme autorização de início; sem nova rodada de aprovação do plano.

Mudança de direção solicitada pelo usuário: projeto pesado, avaliar abordagem leve.
Diagnóstico atual: 679.980 registros em files.jsonl.pending; snapshot incompleto; índice SQLite ainda inexistente. Build falhou com heap ~2 GB em operações de filesystem. Importador não estava mais rodando na auditoria. Proposta em docs/abordagem-leve.md: separar acervo permanente da raiz Next, pacotes de Markdown, índice derivado independente. Não descartar a cópia parcial sem validar migração.

Planejamento solicitado para reduzir impacto no projeto: plano proposto em docs/superpowers/plans/2026-10-30-acervo-leve.md. Nenhuma migração neste turno. Recomenda separar diretório permanente do acervo, pacotes limitados e índice derivado, com teste de build independente e hashes antes de remover duplicatas. SQLite permanece opção a medir, sem causa demonstrada do peso atual.

## Modelo híbrido implementado

Usuário aprovou Constituição e guias locais, demais leis remotas. Informou que apagou o acervo parcial; não foi restaurado. A aplicação não usa SQLite nem importação integral.

- Constituição em content/constituicao.md: 722.006 bytes; hash registrado e validado por teste com fetch desativado.
- Catálogo inicial: 19 metadados, ~11 KB serializados; escopo selecionado explícito na interface. Outras normas acessíveis pela navegação remota /acervo, sem varredura recursiva nacional.
- Cache de textos: 16 MiB/128 entradas, TTL 6h, fallback máximo de 7 dias dentro do orçamento. Diretórios: 4 MiB/128 árvores. Fonte fixa por commit, timeout, tamanho e concorrência limitados.
- Revisão independente identificou fallback sob saturação e falso 404 em árvore truncada; regressões observadas falhando e corrigidas, suíte verde.
- Backup local de verificação: /private/tmp/leisbrasil-backups/leisbrasil-local-2026-10-30T06-42-21-900Z.tar.gz (~201 KB), hash validado e conteúdo local conferido. Não contém leis remotas.

## Usabilidade — pedido adicional

Removido o painel lateral volumoso. Filtros compactos apenas quando há opções reais, anos em seleção em vez de campo livre, aplicação automática com indicador, chips removíveis e limpeza preservando o termo buscado. Acesso claro às outras coleções. Markdown não duplica h1 da página.

Verificação: 18 testes, lint e TypeScript passaram. Build final passou em 10,06s; /usr/bin/time -l registrou máximo RSS de 961.462.272 bytes para a execução medida, sem elevar heap. Conteúdo local total ~800 KB (não inclui dependências e artefatos de build). Navegador: busca consumidor → filtro 2002 → vazio → limpar mantendo busca → filtro 1990/remover → leitor remoto; controle de fonte; desktop 1440 e celular 390 sem overflow. Capturas temporárias em /tmp, fora do projeto.

## Navegação fixa do leitor — pedido adicional

Corrigido sticky do índice: a posição foi aplicada ao item aside da grade, em vez de um filho limitado pela altura do pai. Barra de leitura fixa no topo com fundo sólido. No celular, índice recolhível fixo com lista flutuante rolável, fecha ao selecionar artigo; barra fica abaixo dele. Margem de âncoras impede que o artigo fique escondido.

Reprodução anterior no navegador: índice y=-1017,8 e barra y=-691,1 após scroll1200. Após a correção: checagens de posição passaram em desktop1440 e celular390; abertura/recolhimento do índice e salto ao art.5º passaram sem encobrir conteúdo ou overflow. Capturas /tmp/leis-sticky-desktop.png e /tmp/leis-sticky-mobile.png. Suite18 testes, lint, tipos e build passaram. Guia Mermaid, tema e navegação remota até CDC também verificados sem pageerror.
Salto ao artigo também conferido após concluir a rolagem suave: art.5º visível dentro da viewport e abaixo dos controles. Captura /tmp/leis-sticky-mobile-article.png. Logs sem novos erros de aplicação; o 404 de favicon observado no início foi corrigido com icon.svg antes do build final.

## Aviso legal, fontes e colaboração

A pedido do usuário, adicionados content/legal/aviso-legal.md, seção /sobre#aviso-legal, acesso no rodapé e aviso curto no leitor. Esclarece finalidade educativa, ausência de vínculo oficial e de consulta individualizada, diferença entre guias e normas, fontes intermediárias/oficiais, limites de atualização/versão/cobertura/disponibilidade e preservação dos direitos previstos por lei. Não promete imunidade nem exclusão geral de responsabilidade.

Usuário informou não ter contato público e querer publicar projeto colaborativo no GitHub. Não inventado e-mail/URL. Aviso descreve contribuição como proposta futura e CONTRIBUTING.md prepara orientações de correção com fontes, revisão e proteção de dados pessoais. Repositórios de terceiros não são apresentados como atendimento do leisbrasil.

Fundamentação consultada em fontes oficiais da Câmara para Lei9.610 art8IV e CDC24/25/51; Planalto bloqueou leitura automatizada. Notas e URLs em docs/legal/aviso-editorial-notes.md. Texto informativo sujeito a revisão jurídica antes da publicação como política definitiva.
Aviso legal: 18 testes, lint, tipos e build passaram. Navegador conferiu /sobre em desktop1440 e celular390, link do rodapé até #aviso-legal, atribuição ctresb/leis, cláusula de preservação dos direitos e ausência de contato inventado, sem overflow. Prévia do build final em http://127.0.0.1:3025/sobre#aviso-legal. Capturas temporárias fora do projeto.

## Contribuição por PR e correção do menu móvel

CONTRIBUTING.md agora explica issue opcional para mudanças pequenas, fork, branch, preparação pnpm, validação, envio da branch, abertura de PR, draft, revisão e merge pelos mantenedores. Incluído .github/pull_request_template.md. Não foi criado repositório remoto, PR real ou promessa de aprovação automática. Aviso legal cita o fluxo futuro de PRs.

Bug móvel reproduzido: índice fixo (camada40) cobria o dropdown de navegação (camada30 sem contexto no header). Cabeçalho agora tem contexto próprio acima do conteúdo. Menu móvel isolado em componente cliente, fecha por seleção, Escape (com foco no summary) e pointerdown fora.

Verificação final: suite18, lint, TypeScript e build passaram. Playwright reproduziu sobreposição antes e depois comprovou menu acima do índice por hit-testing, fechamento por Escape/toque fora/navegação e ausência de overflow390px. Captura /tmp/leis-mobile-menu-fixed.png inspecionada. Prévia final em http://127.0.0.1:3025.
