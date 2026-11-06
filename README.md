# Dashboard de Vendas Industriais

[**Abrir a demonstração interativa**](https://carlosh088.github.io/Dashboard_Vendas/)

## Por que o painel surgiu

Os dados de vendas já estavam no ERP, mas consultar as informações em tabelas dificultava comparar períodos, entender o desempenho comercial e apresentar os resultados a outras pessoas. O painel nasceu para reunir essas informações em uma leitura visual, com indicadores, filtros e comparações que ajudam a explicar o que mudou.

## Sistema original 

O painel original foi desenvolvido em **Python** e é hospedado no **Streamlit**. Ele recebe relatórios de vendas exportados do ERP em CSV. O pandas trata as colunas, aplica os filtros e agrega os dados. O Streamlit monta a interface e o pacote streamlit-echarts renderiza os gráficos com Apache ECharts.

O aplicativo original tem autenticação com Streamlit Authenticator e atualização do relatório por usuários administradores. O código prevê leitura local ou armazenamento no Supabase Storage por meio da API compatível com S3 e do boto3. O ERP fornece o relatório exportado que alimenta a análise.

```text
ERP → exportação CSV → armazenamento do relatório
                           ↓
                     pandas → Streamlit / ECharts
```

O fluxo comercial inclui filtros por período, UF, produto e cliente, indicadores de faturamento, notas, ticket, clientes e quantidade, evolução mensal, rankings, distribuição por UF e detalhamento dos registros.

## Como a demonstração representa o original

A página pública replica as principais perguntas e visões comerciais do Streamlit com um catálogo sintético e notas fictícias. Ela acrescenta metas, comparação anual e uma análise ilustrativa de margem, custos, descontos e devoluções. Esses indicadores adicionais são recursos da demonstração.

| | Painel original | Demonstração |
| --- | --- | --- |
| Interface | Python, Streamlit e Apache ECharts | HTML, CSS, JavaScript e SVG |
| Hospedagem | Streamlit | GitHub Pages |
| Dados | CSV exportado do ERP, com acesso autenticado | Notas fictícias geradas no navegador |
| Armazenamento | Arquivo local ou Supabase Storage, conforme a configuração | Dados calculados na sessão do navegador |

## O que explorar

- **Resumo executivo** com receita líquida, volume, pedidos, ticket médio e margem.
- **Comparação anual** dos mesmos meses, com filtros de trimestre, região, UF, família, produto e cliente.
- **Evolução mensal** de receita e metas fictícias na visão geral.
- **Rankings** de produtos por receita e margem, além da concentração de receita nos maiores clientes.
- **Composição do resultado** com descontos, devoluções e custo dos produtos vendidos.
- **Distribuição por UF** e tabela com uma amostra das notas filtradas.
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
