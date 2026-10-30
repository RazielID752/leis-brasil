# Leis Brasil Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans task by task.

**Goal:** Biblioteca Next.js com acervo Markdown próprio, busca e guias.
**Architecture:** Arquivos locais são canônicos; SQLite FTS5 é reconstruível. Server Components consultam contratos pequenos e componentes cliente cuidam só das interações.
**Tech Stack:** Next.js, TypeScript, Tailwind CSS, pnpm, Lucide, Magic UI.
**Spec:** docs/superpowers/specs/2026-10-30-leis-brasil-design.md

## Global Constraints

Markdown externo não executa código. Não presumir vigência. Não depender do GitHub em runtime. Preservar snapshot e proveniência. Não publicar nem contratar infraestrutura.

## Review Focus

- Arquivos inválidos: relatório sem ocultar falhas.
- Consulta com pontuação/acentos: resultados ou estado vazio, nunca erro SQL.
- Identidade e caminhos conflitantes: rejeição sem sobrescrita.
- HTML/links externos no texto: renderização segura.
- Fonte offline: busca, leitor e reconstrução locais continuam funcionando.

### Task 1: Acervo e consulta

Files: package.json, scripts/import/*, src/features/legislation/{types,parse}.ts, src/infrastructure/legislation.ts, tests/acervo.test.ts.
Interfaces: parseLaw(source, path) produz LawDocument; searchLaws(filters) produz resultados paginados; getLaw(id) retorna documento.
- [ ] Criar configuração e instalar dependências.
- [ ] Escrever e executar testes de normalização, campos ausentes, conflito, busca e caminhos inseguros antes da implementação.
- [ ] Baixar snapshot identificado, preservar arquivo original e importar todos os Markdown jurídicos com relatório e hashes.
- [ ] Implementar índice FTS5 reconstruível e adaptador local.
- [ ] Executar pnpm test; esperado: todos passam. Medir contagens e conferir relatório.

### Task 2: Interface e guias

Files: src/app/*, src/components/ui/*, src/features/{legislation,guides,search}/*, content/guides/*.
Interfaces: consome searchLaws/getLaw e manifesto da Task 1. Rotas /, /leis, /leis/[id], /guias, /guias/constituicao, /sobre.
- [ ] Criar tokens visuais e componentes compartilhados a partir do conceito editorial.
- [ ] Implementar início, catálogo com filtros/paginação e leitor com índice, controles e Markdown seguro.
- [ ] Adaptar notas/passos/tabelas e Mermaid para guia local da Constituição, com estado editorial explícito.
- [ ] Executar typecheck, lint e build; esperado: sucesso.
- [ ] Verificar desktop, celular, teclado, tema, busca e links no navegador.

### Task 3: Preservação, documentação e revisão

Files: scripts/backup.*, README.md, docs/architecture.md, docs/progress.md.
- [ ] Documentar execução, importação, reconstrução, hospedagem e cobertura.
- [ ] Criar backup independente local e validar restauração/reindexação sem rede.
- [ ] Executar suite completa e revisão independente; corrigir problemas materiais com regressão.
- [ ] Registrar comandos, limites e caminhos finais.
