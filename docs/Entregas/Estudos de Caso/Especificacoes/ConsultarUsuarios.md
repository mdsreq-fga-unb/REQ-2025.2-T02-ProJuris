# Consultar Usuários

## Breve Descrição
Este caso de uso aborda um requisito funcional do ator "administrador", que visa permitir que ele consulte usuários no sistema do HopeBridge, para que dessa forma, possa tomar decisões informadas com esse dado.

## Atores
- **Ator principal**: Administrador
- **Atores secundários**:
    - Sistema de gerenciamento do ambiente
    - Sistema de gerenciamento de usuários

## Fluxo de Eventos

### Fluxo Principal
1. O administrador acessa a plataforma e realiza autenticação.
2. O sistema exibe a tela inicial com as opções de gerenciamento geral do sistema.
3. O Administrador seleciona a opção "gerenciar usuários" e é direcionado para a página referente.
4. O sistema apresenta as categorias de gerenciamento de usuários, incluindo um contador referente aos usuários totais do sistema.
5. Ao pressionar no contador, ele se expande e apresenta a quantidade de usuários totais e a quantidade de usuários ativos do sistema lado a lado.
6. Abaixo dos contadores, o sistema disponibiliza uma página de gerenciamento de usuários inativos.
7. O fluxo se encerra.

### Fluxos Alternativos

#### [FA01] Remover usuários
- **Passo de Origem**: 2.1.3 (Passo 3 do Fluxo Principal)
1. Iniciando em 3, o Administrador agora seleciona a página "remover usuários".
2. O sistema agora apresenta as categorias referentes à página, e obrigatoriamente, o contador de usuários totais, ativos e a diferença entre os dois, representando usuários inativos.
3. Fluxo retorna a 5.

### Fluxos de Exceção

#### [FE01] Falha em modo offline
- Em caso de uso offline e falta de cache, o sistema acusa "Impossível realizar contagem em modo offline".

## Requisitos Especiais
- O sistema deve suportar múltiplos idiomas.
- O sistema deve manter a lista de contadores e lista de usuários inativos em cache, para permitir uso de modo offline.

## Regras de Negócio
- **[RN01]**: O sistema deve mostrar todos os números presentes na contagem de usuários no contador, evitando cortar números.
- **[RN02]**: O contador deve contar a quantidade de usuários apenas uma vez durante o uso da aplicação, apenas fazendo uma recontagem ao reiniciar a página.
- **[RN03]**: O cache deve ser salvo em formato JSON.

## Pré-condições
- **[PRE01]**: O administrador deve estar autenticado.
- **[PRE02]**: O administrador deve estar registrado na plataforma.
- **[PRE03]**: Na primeira vez utilizado, o administrador deve possuir acesso à wi-fi.

## Pós-condições
- **[POS01]**: O contador e lista de usuários inativos deve ser mantido em cache.

## Pontos de Extensão
- Nos passos 3 e 6 este caso pode ser estendido por remover usuários.
