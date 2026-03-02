# Avivamento - Projeto de Doação
Site desenvolvido para apoiar ações de arrecadação de alimentos de Grupos de Oração do município de Ribeirão das Neves - MG.


## Sobre o Projeto
Este site foi desenvolvido como parte de um projeto extensionista voltado à aplicação prática de tecnologia em ações sociais.
O objetivo é oferecer um meio simples de organizar campanhas de arrecadação, aproximando doadores, famílias e voluntários da comunidade.


### Objetivos
- Desenvolver um site como ferramenta de apoio às ações de arrecadação de alimentos
- Melhorar a divulgação das campanhas de doação
- Facilitar a comunicação com a comunidade local
- Contribuir para o "ODS 02: Fome zero e agricultura sustentável"


## Funcionalidades
- **Página Inicial**: Apresentação do projeto, informações sobre funcionamento e pontos de encontro
- **Quero Doar**: Formulário para doadores realizarem doações
- **Quero Receber**: Formulário para famílias solicitarem ajuda
- **Voluntários**: Informações e formulário para pessoas interessadas em colaborar
- **Página Obrigado**: Confirmação após envio dos formulários
- **Integração WhatsApp**: Botão para contato direto


## Tecnologias Utilizadas
- **HTML5**: Estrutura das páginas
- **CSS3**: Estilização e organização visual
- **JavaScript**: Funcionalidades interativas
- **Google Fonts**: Tipografia utilizada no projeto
- **Design Responsivo**: Adaptação para diferentes tamanhos de tela


## Integração de Formulários
Os formulários do projeto utilizam o serviço da plataforma FormSubmit (https://formsubmit.co/) para envio dos dados por e-mail.
O envio é realizado por meio de requisição HTTP do tipo POST para o serviço externo, que encaminha automaticamente as informações para o endereço de e-mail configurado.
Essa integração permite o funcionamento necessário para os formulários do site.


## Estrutura de Arquivos
```
ProjetoAvivamento/
│
├── readme.md               # Este arquivo
├── index.html              # Página inicial
│
├── pages/
│   ├── doar.html           # Página para doadores
│   ├── receber.html        # Página para beneficiários
│   ├── voluntarios.html    # Página para voluntários
│   └── obrigado.html       # Página de confirmação
│
├── css/
│   └── styles.css          # Estilos principais do site
│
└── js/
    └── scripts.js          # Scripts JavaScript
```


## Como Usar

### Visualização Local

1. Baixe este repositório
2. Abra o arquivo `index.html` em seu navegador
3. Navegue pelas páginas através do menu


### Personalização

- **Cores**: Variáveis CSS em `css/styles.css`
- **Conteúdo**: Arquivos HTML
- **Imagens**: URLs imagens
- **WhatsApp**: Direcionamento para `wa.me`


## Páginas do Site

### Página Inicial (`index.html`)
- Apresentação do projeto
- Explicação de funcionamento
- Pontos de encontro
- Informações sobre o projeto extensionista


### Quero Doar (`pages/doar.html`)
- Formulário de doação
- Informações básicas sobre como contribuir


### Quero Receber (`pages/receber.html`)
- Formulário para solicitar ajuda
- Informações sobre o processo


### Voluntários (`pages/voluntarios.html`)
- Formulário de cadastro
- Informações sobre participação nas ações


## Projeto Extensionista
Este projeto faz parte das Atividades Extensionistas da UNINTER:

- **Disciplina**: Atividade Extensionista II: Tecnologia Aplicada à Inclusão Digital
- **Curso**: CST em Redes de Computadores
- **Etapa**: Trabalho final
- **ODS**: 02 - Fome zero e agricultura sustentável


### Setor de Aplicação
Grupos de Oração do município de Ribeirão das Neves - MG


## Autor
**Paulo Barbosa**
RU: 5151223


## Informação Adicional
Este projeto foi desenvolvido para fins acadêmicos e de extensão comunitária.


## Privacidade
Os dados coletados são utilizados exclusivamente para organização das doações e contato com os participantes do projeto.
As informações são enviadas por meio de serviço externo de processamento de formulários (FormSubmit) e armazenadas apenas na conta de e-mail responsável pela gestão do projeto.
O envio do formulário implica concordância com essa finalidade de uso dos dados.


## Contribuições
Este projeto foi desenvolvido como atividade acadêmica, mas sugestões são bem-vindas.

