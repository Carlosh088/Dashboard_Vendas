# Dashboard de Vendas Industriais

[**Abrir a demonstração interativa**](https://carlosh088.github.io/Dashboard_Vendas/)

## Por que o painel surgiu

Os dados de vendas já estavam no ERP, mas consultar as informações em tabelas dificultava comparar períodos, entender o desempenho comercial e apresentar os resultados a outras pessoas. O painel nasceu para reunir essas informações em uma leitura visual, com indicadores, filtros e comparações que ajudam a explicar o que mudou.

## O que explorar

- **Resumo executivo** com receita líquida, volume, pedidos, ticket médio e margem.
- **Comparação anual** dos mesmos meses, com filtros de trimestre, região e família.
- **Evolução mensal** de receita e metas fictícias na visão geral.
- **Rankings** de produtos por receita e margem, além da concentração de receita nos maiores clientes.
- **Composição do resultado** com descontos, devoluções e custo dos produtos vendidos.
- **Exportação CSV** dos registros do recorte selecionado.

Comece pelo ano de 2025 e compare a evolução da receita com a margem percentual. Depois filtre **Mangueiras** e consulte os rankings e a composição do resultado para investigar o efeito do mix, dos descontos e dos custos.

## Dados e indicadores

Todos os registros são gerados no navegador a partir de regras fixas. A série de 2023 a 2025 inclui pedidos fictícios, seis produtos, quatro regiões e quinze clientes genéricos. O ano de 2023 serve de base para comparar 2024. As metas são ilustrativas e só aparecem sem recorte de região ou família.

| Indicador | Regra |
| --- | --- |
| Receita líquida | Faturamento bruto menos descontos e devoluções |
| Margem bruta em reais | Receita líquida menos custo líquido dos itens vendidos |
| Margem percentual | Margem bruta em reais dividida pela receita líquida |
| Ticket médio | Receita líquida dividida pelo número de pedidos distintos |
| Volume líquido | Quilogramas vendidos menos quilogramas devolvidos |

A demonstração usa HTML, CSS, JavaScript e SVG. O GitHub Pages serve os arquivos estáticos e o navegador calcula os indicadores localmente. Para executar no computador, extraia os arquivos e abra `index.html`.

O painel interno serviu como referência para o contexto de negócio. Este projeto público usa uma implementação própria e uma base sintética, independente do ERP e da infraestrutura de produção.
