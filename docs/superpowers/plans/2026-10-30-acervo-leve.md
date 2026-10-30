# Acervo leve — plano proposto de migração

Status: planejamento solicitado pelo usuário; nenhuma migração executada neste turno. A escolha técnica abaixo é recomendação para avaliação, não uma decisão já aprovada pelo usuário.

**Objetivo:** manter uma cópia própria dos textos jurídicos e permitir busca/leitura sem fazer o Next.js, o editor ou o build percorrerem todo o acervo.

**Contexto:** `docs/abordagem-leve.md`, `docs/superpowers/specs/2026-10-30-leis-brasil-design.md` e pedido de reduzir peso sem afetar o projeto.

## Diagnóstico e limites da evidência

O manifesto parcial registra 679.980 documentos; os `.md.gz` estão dentro de `content/legislation`. Não existe um índice `data/index.sqlite` nesta auditoria. O build anterior atingiu heap próximo de 2 GB em operações de filesystem. Isso sustenta priorizar a disposição dos arquivos, mas não prova que ela seja a única fonte de consumo: bundle e dependências também precisam ser medidos.

A importação não terminou. Não chamar essa cópia de acervo completo nem inventar dados de cobertura para fazer as páginas funcionarem.

## Alternativas

| Abordagem | Benefício | Custo/limitação |
| --- | --- | --- |
| Acervo separado, pacotes compactados e SQLite derivado | Poucos arquivos, acesso pontual, busca pronta sem servidor adicional; preserva Markdown | Precisa adaptar o leitor e a operação dos dados |
| Markdown por arquivo apenas fora do projeto | Correção inicial simples; tira o acervo do build | Mantém centenas de milhares de arquivos e seu custo em disco/backup |
| Pacotes e índice de busca próprio sem SQL | Remove SQLite | Exige implementar índice invertido, filtros, paginação e atualização; ganho de peso ainda não demonstrado |

Recomendação: primeira abordagem. Mover os arquivos para fora da raiz é uma etapa intermediária segura, seguida do empacotamento. Não carregar um JSON nacional, banco ou arquivo ZIP inteiro na memória.

## Estrutura proposta

```text
sites/
  leis-brasil/                       aplicação, dependências, guias e imagens
    src/
    content/guides/
    tests/fixtures/                  acervo pequeno para testes
  leis-brasil-acervo/                dados próprios, fora da raiz Next
    snapshots/<snapshot-id>/
      packs/                        pacotes de Markdown originais
      inventory.jsonl               inventário incremental com hashes
      index.sqlite                  índice derivado e endereços dos documentos
      report.json                   cobertura, erros e estado de integridade
    active.json                     snapshot válido selecionado
    staging/                        importações ainda não publicadas
```

A localização é configurada por `LEIS_DATA_DIR`, sem caminho absoluto do computador embutido no código. O destino externo precisa de permissão de escrita do ambiente quando a migração for executada. Nunca usar diretório temporário como única cópia permanente. Backups devem ter destino independente configurável; uma cópia no mesmo disco não protege contra falha desse disco.

## Limites entre aplicação e dados

- Build, instalação e typecheck não importam nem indexam o acervo. Páginas do catálogo/leitor continuam dinâmicas.
- Inicialização de desenvolvimento não baixa nada. O modo de integração usa apenas uma pequena fixture identificada; não faz passar dados de teste por produção.
- Configuração de acervo ausente/incompleto produz estado claro, sem falha no build, contagens inventadas ou resultados demonstrativos silenciosos.
- Guias e código ficam no repositório da aplicação; acervo, staging, índices e backup não ficam no Git nem no observador do Next.
- O frontend mantém somente o estado e os resultados da página atual. Não recebe o índice nacional.

## Formato de preservação e leitura

Proposta: ZIPs imutáveis divididos por coleção/UF e, se necessário, por lotes. Limite inicial: até 10.000 documentos ou aproximadamente 64 MiB compactados por pacote, o que ocorrer primeiro. Um documento maior que o limite fica sozinho, identificado no relatório. Esses valores são parâmetros iniciais a validar com uma amostra, não estimativas do tamanho final.

Cada entrada é o Markdown original, compactado diretamente; não recomprimir `.md.gz` dentro de ZIP. Guardar caminho original e SHA-256 dos bytes descompactados. Não compilar o conteúdo remoto como MDX.

Usar leitor de ZIP com acesso por intervalo e descompactação em fluxo, sem extrair todas as entradas. Manter um número pequeno e limitado de pacotes abertos. O índice guarda a localização do documento; o inventário completo não é carregado no início de cada requisição. Medir a leitura do diretório central do ZIP antes de fixar a biblioteca e os limites de lote.

Leis extraordinariamente grandes precisam de limite explícito de renderização e leitura por partes, sem truncar silenciosamente o original. Medir o maior documento antes de definir esse limite.

## Busca

SQLite é uma hipótese eficiente, ainda não medida com este acervo: um índice derivado com metadados, FTS5 e localização das entradas. Não duplicar o texto integral no índice inicialmente. Preservar busca por título, ementa e número; busca dentro de uma lei lê somente o documento solicitado. Calcular filtros/facetas durante a importação ou manter cache limitado por snapshot para evitar agregações completas repetidas.

O contrato atual `LegislationRepository` permanece o limite de acesso. A leitura deve tornar-se assíncrona se o adaptador de pacotes exigir, atualizando explicitamente as páginas e metadados que a consomem. Separar seleção de snapshot, consulta SQL e leitura de pacotes em módulos focados.

## Execução em etapas

### 1. Medir e preservar

- Confirmar os arquivos efetivamente presentes e validar as linhas completas do manifesto parcial.
- Registrar contagem, bytes originais, bytes compactados, maior documento e distribuição por coleção sem carregar o inventário inteiro em memória.
- Medir um build de referência em cópia só do código/fixture, fora da árvore volumosa; não repetir um build nacional que já esgotou memória.
- Verificar espaço para dados atuais, pacotes novos, índice e margem operacional. Não iniciar uma cópia que exceda o espaço disponível.
- Não completar a importação nacional antes de estabilizar o caminho leve.

### 2. Isolar o acervo do Next

- Criar diretório permanente de dados fora da raiz da aplicação e mover a cópia parcial sem duplicação desnecessária quando o volume permitir.
- Introduzir configuração e resolução de paths; remover dependência de `process.cwd()/content/legislation` e `process.cwd()/data`.
- Criar fixture mínima com Constituição e normas de esferas diferentes. Guias continuam reais e separados.
- Validar dev, lint, typecheck e build sem depender de rede ou do acervo nacional.

### 3. Empacotar e conferir

- Provar primeiro em uma amostra com artigos, acentos, caminhos repetidos em esferas diferentes e documento grande.
- Empacotar de forma incremental e determinística em staging. Rejeitar entradas com caminho inseguro, colisões e duplicatas conflitantes.
- Comparar cada hash de entrada com os bytes originais e conferir contagens por pacote/coleção.
- Somente depois da verificação integral remover arquivos redundantes cuja cópia empacotada foi comprovada. Preservar relatório e capacidade de voltar à configuração anterior.

### 4. Reconstruir busca e integrar leitor

- Gerar índice em staging, usando os mesmos identificadores públicos; preservar links e separar desconhecido de vigência confirmada.
- Testar consultas com acentos/pontuação, filtros, paginação, ausência de resultados e localização de documento no pacote.
- Exercitar início → busca → norma → artigo → fonte e guia → Constituição, incluindo celular e tema.
- Não misturar pacotes de um snapshot com o índice de outro.

### 5. Validar desempenho e publicar snapshot local

- Testar a cópia migrada com os dados disponíveis, identificando-a explicitamente como parcial.
- Selecionar `active.json` apenas após validação; preservar o snapshot anterior. Publicação local com aplicação parada/reiniciada nesta primeira versão, sem promessa de troca online.
- Retomar importação integral por pipeline novo, separado do projeto, somente após o piloto passar. Marcar completo apenas quando todo o snapshot tiver sido consumido e reconciliado.
- Criar backup e testar restauração/reconstrução sem rede.

## Critérios de aceite

1. Nenhum arquivo do acervo nacional permanece na raiz observada pelo Next ou entra no bundle/Git da aplicação.
2. Build termina sem aumentar o heap padrão apenas para contornar a varredura; medir tempo e pico de memória com versões idênticas e caches equivalentes.
3. Com e sem acervo externo conectado, o build não o percorre; diferença de tempo/memória deve ficar dentro da variação normal de execução, investigando diferenças repetidas acima de 10%.
4. Consultar uma lei abre somente seu pacote/entrada, sem carregar o arquivo nacional; busca e filtros não leem todos os Markdown.
5. Todos os bytes migrados passam na verificação SHA-256 e todas as normas indexadas apontam para entradas existentes.
6. Busca e leitor funcionam sem GitHub. Interrupção de importação conserva a versão local válida e não publica staging.
7. A página de cobertura distingue documentos preservados, indexados, rejeitados e importação parcial.
8. Relatório final inclui medidas reais de disco, memória, tempo de build e latência de consulta; não prometer percentual de redução antes da medição.

## Escopo desta decisão

Este plano reduz o impacto do acervo no desenvolvimento e no funcionamento da aplicação; não elimina o espaço necessário para armazenar uma biblioteca nacional completa. Hospedagem será definida depois, conforme armazenamento persistente e volume medido. Serviços pagos, APIs externas de busca e dependência dos repositórios de origem em runtime não fazem parte desta proposta.
