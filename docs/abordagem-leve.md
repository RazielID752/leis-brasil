# Proposta de abordagem mais leve

Status: proposta após pedido do usuário em 30/10/2026; não substituída silenciosamente.

## Diagnóstico verificado

- Importação interrompida com 679.980 registros no manifesto parcial.
- Os arquivos `.md.gz` estão sob `content/legislation`, dentro da raiz do projeto Next.js.
- Nenhum `data/index.sqlite` foi criado. Portanto, não há evidência de que SQLite tenha causado o peso observado.
- O build atingiu o heap padrão de aproximadamente 2 GB; a stack envolve leitura de diretórios e promessas/mapas de arquivos.
- A cópia do acervo está parcial. Não deve ser apresentada como snapshot completo ou descartada antes de validar sua migração.

## Alternativa recomendada

Separar a aplicação do acervo, tanto na estrutura de diretórios quanto no ciclo de atualização:

1. Aplicação Next.js pequena: código, guias e assets; sem centenas de milhares de arquivos de legislação em sua raiz.
2. Acervo próprio em diretório de dados independente e durável, fora da raiz observada pelo Next. Nunca usar /tmp como única cópia permanente.
3. Markdown original preservado dentro de poucos pacotes ZIP, divididos por coleção/UF, com manifesto SHA-256 e acesso pontual ao documento. Sem extrair todo o acervo para servir uma página.
4. Índice de metadados separado e reconstruível. SQLite FTS5 continua sendo uma opção eficiente: é embutido, sem servidor adicional, e ainda não foi responsável por consumo medido. Medir tamanho e uso real antes de decidir substituí-lo.
5. Busca e leitura no servidor, com paginação. Nenhum índice nacional inteiro no JavaScript do navegador.
6. Importação e backup executados fora de `next dev` e `next build`. Construir e testar a aplicação com um acervo pequeno de integração; medir a consulta ao acervo maior separadamente.

Primeira correção: empacotar e validar os dados já baixados, conservar a cópia original até conferir hashes/contagens, mover os pacotes para armazenamento permanente separado e só então remover os arquivos duplicados da raiz da aplicação. Adaptar o repositório de leitura sem alterar as páginas.

## Alternativa sem SQL

Índice invertido particionado em arquivos, consultado no servidor. Elimina SQLite, mas exige implementar e testar ranking, interseção de termos, filtros, paginação e atualização atômica. Não há evidência de que isso economize memória ou disco neste caso. Evitar um JSON nacional único carregado em memória.

## O que não muda

Next.js, Tailwind, pnpm, visual aprovado, ícones Lucide, componentes Magic UI, texto original separado das explicações e independência dos repositórios externos.

## Verificação necessária

- Build e dev com o acervo fora da raiz sem percorrer seus documentos.
- Busca e leitura paginadas com medição de memória e latência.
- Integridade de todos os bytes migrados e distinção entre importação parcial e completa.
- Restauração local sem rede.
