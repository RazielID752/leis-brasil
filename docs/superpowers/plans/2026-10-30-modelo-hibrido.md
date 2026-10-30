# Modelo híbrido — implementação autorizada

Usuário aprovou: Constituição e guias locais, demais leis remotas com cache limitado e catálogo de metadados.

1. Preservar Constituição e mover cópia parcial volumosa para diretório irmão de arquivo, sem apagá-la. Retirar scripts de importação nacional e SQLite do fluxo ativo.
2. Criar catálogo editorial de metadados reais das leis essenciais e navegação por diretórios do repositório para alcançar o restante. Busca local declara explicitamente seu alcance; não apresentar catálogo selecionado como busca nacional integral. Nenhum clone/índice nacional no navegador.
3. Implementar fonte remota fixa por commit, timeout, limite de documento e cache LRU em memória com TTL, limite de bytes e fallback expirado dentro do orçamento. Só caminhos jurídicos permitidos e conteúdo Markdown, sem SSRF. Constituição não precisa de rede.
4. Adaptar contratos assíncronos, páginas, cobertura e estados de erro/disponibilidade. Manter visual aprovado.
5. Testar offline Constituição/guias, cache/evicção/falhas, caminhos, busca/paginação e navegação remota. Executar lint, tipos, build e navegador.

A cópia parcial é arquivo de segurança fora do projeto, não fonte ativa nem acervo completo. Não retomar download integral. Escolhas de orçamento de cache devem ser documentadas e verificadas por teste.
