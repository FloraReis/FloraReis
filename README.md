# Floricultura Flora Reis 🌸

**Descrição**  
Sistema de controle de estoque para a floricultura "Flora Reis", desenvolvido para facilitar a automação de processos e gestão de estoque.

---

## Índice

1. [Descrição do Projeto](#descrição-do-projeto)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Como Usar](#como-usar)
5. [Contribuição](#contribuição)
6. [Licença](#licença)

---

## Descrição do Projeto

Este sistema foi desenvolvido para auxiliar no gerenciamento de uma floricultura, permitindo que vendedores e compradores acessem as informações de estoque de forma prática. O sistema gerencia:
- Cadastro de clientes e fornecedores
- Controle de pedidos e estoque
- Automatização de busca de endereços com API de CEP

**Público-Alvo:** Pequenas floriculturas buscando otimizar processos de controle de estoque.

---

## Tecnologias Utilizadas

- **Back-end:** Python (Flask, SQLAlchemy)
- **Banco de Dados:** PostgreSQL
- **Front-end:** Angular
- **Outras:** Marshmallow para validação, AWS para hospedagem
- **Arquitetura:** Monolítica

---

## Instalação e Configuração

1. **Pré-requisitos**
   - Python 3.8+
   - PostgreSQL configurado
   - Node.js e Angular CLI para o front-end
   - Git para controle de versão

2. **Clone o Repositório**
   ```bash
   git clone https://github.com/seuusuario/floricultura-flora-reis.git
   cd floricultura-flora-reis

3. **Instale as Dependências**
    - Back-end:
        . cd back-end
        . python -m venv venv
        . source venv/bin/activate  # Linux/Mac
        . venv\Scripts\activate     # Windows
        . pip install -r requirements.txt

    - Front-end:
        . cd front-end
        . npm install

4. **Configuração do Banco de Dados**
    Crie um banco de dados PostgreSQL e configure as credenciais no arquivo config.py.

5. **Execução do Projeto**
    - Back-end:
        . cd back-end
        . flask run
    
    - Front-end:
        . cd front-end
        . ng serve

---

## Como usar

    1. Cadastro de Pessoas e Produtos: Utilize a interface para cadastrar clientes, fornecedores e produtos.
    2. Pedidos e Estoque: Visualize e edite os pedidos e o estoque de produtos de acordo com a necessidade.
    3. Funcionalidade de CEP: No cadastro de endereços, use a funcionalidade de busca automática pelo CEP para preenchimento rápido dos dados.

---

## Contribuição

    Contribuições são bem-vindas! Para contribuir:

    1. Faça um fork do projeto
    2. Crie uma nova branch para sua feature (git checkout -b feature/sua-feature)
    3. Commit suas mudanças (git commit -m 'Adiciona nova feature')
    4. Faça um push para a branch (git push origin feature/sua-feature)
    5. Abra um Pull Request

## Licença

    Esse exemplo cobre as informações básicas de instalação, uso e contribuições, garantindo que qualquer pessoa possa entender e colaborar no projeto.
