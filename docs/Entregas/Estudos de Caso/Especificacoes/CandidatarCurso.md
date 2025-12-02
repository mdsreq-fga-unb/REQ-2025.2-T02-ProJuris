# Candidatar a Curso

## Breve descrição
Este caso de uso descreve como um refugiado pode se candidatar a um curso. O fluxo inclui desde o acesso à página de cursos, escolha de um curso de interesse, leitura de informações detalhadas e confirmação da candidatura, até mensagens de sucesso ou falha no processo.

## Atores
- **Ator Principal**: Refugiado
- **Atores Secundários**:
    - Sistema de Gestão de Cursos
    - API de Serviços

## Fluxo de Eventos

### Fluxo Principal
2.1.1 O refugiado acessa o sistema e realiza o login com suas credenciais válidas.

2.1.2 O sistema exibe a página inicial, que inclui acesso ao menu de cursos.

2.1.3 O refugiado acessa a página que lista os cursos disponíveis.

2.1.4 O sistema exibe a lista de cursos disponíveis com informações básicas como título, descrição e carga horária.

2.1.5 O refugiado seleciona o curso desejado para visualizar os detalhes.

2.1.6 O sistema exibe os detalhes completos do curso, incluindo pré-requisitos, horários e local de realização ou modalidade.

2.1.7 O refugiado escolhe a opção de se candidatar ao curso.

2.1.8 O sistema verifica se o refugiado atende aos pré-requisitos. (Possível exceção: FE01)

2.1.9 O sistema verifica se ainda existem vagas no curso. (Possível exceção: FE02)

2.1.10 O sistema registra a candidatura do refugiado ao curso.

2.1.11 O sistema exibe a mensagem: "Candidatura realizada com sucesso."

2.1.12 O fluxo se encerra.

### Fluxos Alternativos

#### FA01 — Usuário desiste da candidatura
**Passo de origem**: 2.1.7

O refugiado decide não candidatar ao curso e volta à página anterior.

O fluxo retorna ao passo 2.1.5.

### Fluxos de Exceção

#### FE01 — Refugiado não atende aos pré-requisitos
**Passo de origem**: 2.1.8

O sistema identifica que o refugiado não atende a todos os pré-requisitos exigidos pelo curso.

O sistema exibe a mensagem: "Você não atende aos pré-requisitos para este curso."

O fluxo retorna ao passo 2.1.6.

#### FE02 — Curso sem vagas
**Passo de origem**: 2.1.9

O sistema identifica que não há vagas disponíveis para o curso escolhido.

O sistema exibe a mensagem: "Não há vagas disponíveis para este curso."

O fluxo retorna ao passo 2.1.6.

## Requisitos Especiais
- **[RS01]**: O sistema deve apresentar os cursos com informações completas e atualizadas, incluindo os pré-requisitos.
- **[RS02]**: O sistema deve permitir o funcionamento da candidatura somente quando houver conexão estável com a API de serviços.

## Regras de Negócio
- **[RN01]**: O sistema deve validar automaticamente se o refugiado atende aos pré-requisitos do curso antes da candidatura.
- **[RN02]**: A candidatura deve ser registrada imediatamente após a verificação de vagas.

## Precondições
- O refugiado deve estar autenticado no sistema.
- O refugiado deve ter acesso à página de cursos.

## Pós-condições
- A candidatura é registrada no sistema.
- O refugiado passa a ter sua inscrição vinculada ao curso.
