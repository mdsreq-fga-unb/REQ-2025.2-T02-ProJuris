Tendo em vista as informações apresentadas no documento, a decisão sobre as estratégias de engenharia de software a serem utilizadas prioriza a adaptação constante e a entrega de valor de forma ágil para um cliente que precisa de resultados rápidos e visíveis, considerando feedbacks.

## 3.1 Estratégia Priorizada

**Abordagem de Desenvolvimento de Software**: Ágil

**Ciclo de vida**: Iterativo e Incremental

**Processo de Engenharia de Software**: eXtreme Programming (XP)

**FrameWork**: Scrum

## 3.2 Quadro Comparativo

| Características | eXtreme Programming (XP) | Feature-Driven Development (FDD) |
| - | - | - |
| Filosofia Central | Foco na excelência técnica, comunicação constante e feedback rápido. Visa entregar software de alta qualidade através de práticas rigorosas de codificação e testes. | Foco na entrega de funcionalidades tangíveis. O trabalho é organizado e planejado em torno da construção de "features" ou funcionalidades valiosas para o cliente. |
| Ciclo de Vida | Iterativo e Incremental. O trabalho é dividido em iterações curtas, geralmente de uma a duas semanas, onde o foco é entregar um software funcional e testado. | Iterativo e Incremental. O processo é dividido em cinco etapas, com as duas últimas sendo iterativas: "Projetar por Funcionalidade" e "Construir por Funcionalidade". |
| Papéis (Funções) | Baseado em um conjunto de práticas como Programação em Par, Desenvolvimento Orientado a Testes e Refatoração Contínua. Sendo assim, a equipe inteira é responsável pelo código. | Baseado em um conjunto de práticas como a construção de Modelos de Domínio e a elaboração de Listas de Funcionalidades. O desenvolvimento é feito em times pequenos e orientados por funcionalidades. |
| Ritmo de Trabalho | Constante e sustentável. O foco é manter um ritmo de trabalho que evite a exaustão da equipe e garanta a qualidade contínua do código. | Fluxo contínuo e disciplinado. O trabalho é planejado e executado de forma estruturada para garantir a entrega de funcionalidades completas no prazo. |
| Documentação | Prioriza a entrega de software funcionando sobre a documentação extensiva. Nesse contexto, a documentação é mínima e focada apenas no essencial. | Embora seja ágil, é mais proativo na documentação. A modelagem de domínio é um ponto crucial, e a documentação é feita para cada funcionalidade. |
| Controle de Mudanças | Altamente flexível. As mudanças são vistas como parte natural do processo e são incorporadas em ciclos de feedback curtos. | Mais estruturado. As mudanças são gerenciadas através da priorização das funcionalidades, mas o processo de desenvolvimento de cada uma é mais formalizado. |

## 3.3 Justificativa

Dado a análise apresentada, consolidou-se a escolha do eXtreme Programming (XP) como processo principal para o desenvolvimento do produto. A decisão justifica-se pela sua notável adequação às necessidades do projeto e do cliente, que priorizam a flexibilidade e a qualidade do código em um ambiente de equipe pequena como a nossa.

Nesse sentido, o XP, com seu foco em práticas de excelência técnica, como o Desenvolvimento Orientado a Testes (TDD) e a Programação em Par, garante um código de alta qualidade desde o início, sendo fundamental para um projeto que lida com dados confidenciais e que precisa ser robusto e confiável, a fim de minimizar o risco de erros e retrabalho. Ainda que o FDD também seja ágil, o processo é mais voltado para funcionalidades e à modelagem de domínio, o que não é o foco principal da equipe neste momento. O XP, por outro lado, vai direto ao ponto, priorizando a qualidade do código que irá sustentar o produto.

Além disso, a filosofia do XP de aceitar mudanças como parte natural do processo se alinha perfeitamente com a necessidade de adaptação ao longo do projeto. Como a equipe não tem acesso a sistemas legados para testes de interoperabilidade, a capacidade de refatorar e se ajustar a novos requisitos de dados é crucial. O XP facilita essa flexibilidade, ao passo que o FDD, por justamente ser mais estruturado em torno de funcionalidades, poderia ter um processo de adaptação mais formal e lento.

Portanto, a simplicidade e o foco do XP em comunicação direta e feedback contínuo se encaixam bem com a equipe pequena do projeto. O processo incentiva a colaboração e a transparência, elementos que garantem que todos os membros estejam alinhados com o Product Owner, minimizando ruídos e maximizando a eficiência da entrega.