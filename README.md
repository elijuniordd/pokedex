# Pokédex Interativa — React + Vite

Atividade 03 — Pokédex com React + Vite, desenvolvida em dupla com a metodologia de Pair Programming.

**Integrantes**

- Eli Júnior Domingos Dias
- Guilherme Pereira Bittencourt

---

## Sobre o projeto

Aplicação web para consultar e explorar os 151 Pokémon da primeira geração, com pesquisa, filtro por tipo, detalhes de cada criatura, área de treinadores e favoritos salvos na conta de cada usuário.

### Funcionalidades

-  **Lista de Pokémon** em cards com ID, nome, tipos e os 6 atributos (HP, Ataque, Defesa, Ataque Especial, Defesa Especial e Velocidade).
-  **Pesquisa** por nome ou ID (aceita `bulba`, `25`, `025` e `#025`), atualizada enquanto se digita.
-  **Filtro por tipo**, usando os tipos presentes no `pokedex-data.json`.
- **Detalhes do Pokémon** em um modal, com artwork oficial e barras de progresso para cada atributo.
-  **Estado vazio:** mensagem quando nenhum Pokémon é encontrado.
-  **Treinadores:** nome, quantidade de insígnias e equipe de cada um. Clicar em um Pokémon da equipe abre os detalhes.
-  **Favoritos** (requisito extra): login com e-mail e senha, favoritos salvos no banco de dados Supabase e aba própria para consultá-los.
-  **Tema escuro** e **layout responsivo** (desktop, tablet e celular).
-  Navegação por teclado, foco gerenciado nos modais e respeito a `prefers-reduced-motion`.

---

## Como executar

Pré-requisito: [Node.js](https://nodejs.org/) 20.19 ou superior.

```bash
# 1. instalar as dependências
npm install

# 2. configurar o Supabase (veja a seção abaixo)
cp .env.example .env.local

# 3. iniciar o servidor de desenvolvimento
npm run dev
```

Abra o endereço mostrado no terminal, normalmente **http://localhost:5173**.

Outros comandos:

| Comando           | O que faz                          |
| ----------------- | ---------------------------------- |
| `npm run build`   | gera a versão de produção em `dist` |
| `npm run preview` | serve a versão de produção         |
| `npm run lint`    | verifica o código com o ESLint     |

> 💡 **Sem configurar o Supabase a Pokédex continua funcionando** (lista, pesquisa, filtro, detalhes e treinadores). Apenas o login e os favoritos ficam indisponíveis, e a aplicação mostra um aviso ao tentar favoritar.

---

## Configuração do Supabase (login e favoritos)

Os favoritos ficam em um banco de dados [Supabase](https://supabase.com/), e cada usuário só enxerga os seus.

### Usando o projeto da dupla

O arquivo `.env.local` **não está no repositório** (é ignorado pelo Git). As duas variáveis foram enviadas junto com a entrega no Canvas. Basta criar o arquivo `.env.local` na raiz do projeto, ao lado do `package.json`:

```env
VITE_SUPABASE_URL=https://<id-do-projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=<chave publishable/anon>
```

Depois, reinicie o `npm run dev` (o Vite só lê o `.env` ao iniciar).


4. Em **Project Settings**, copie a **Project URL** e a chave pública (**anon** ou **publishable**) para o `.env.local`, como no exemplo acima.

> ⚠️ Use **somente** a chave pública no frontend. As chaves `service_role` / *secret* e a senha do banco nunca devem entrar no projeto. A segurança dos dados é garantida pelo Row Level Security: cada usuário só lê, cria e apaga as próprias linhas.

---

## 🗂️ Organização do projeto

```text
pokedex/
├── public/
├── src/
│   ├── assets/images/trainers/   # fotos dos treinadores (ash.png, lt-surge.png, ...)
│   ├── components/
│   │   ├── PokemonCard.jsx       # card do Pokémon (ID, imagem, tipos, 6 atributos, favorito)
│   │   ├── PokemonList.jsx       # grade de cards e mensagem de lista vazia
│   │   ├── PokemonDetails.jsx    # modal de detalhes com barras de atributos
│   │   ├── SearchBar.jsx         # pesquisa por nome ou ID
│   │   ├── TypeFilter.jsx        # filtro por tipo
│   │   ├── TrainerList.jsx       # lista de treinadores
│   │   ├── TrainerCard.jsx       # card do treinador (foto, insígnias e equipe)
│   │   ├── AuthModal.jsx         # login e criação de conta
│   │   ├── UserMenu.jsx          # botão Entrar / e-mail e Sair
│   │   └── StarIcon.jsx          # ícone de estrela reutilizado
│   ├── css/                      # um arquivo de estilos por componente
│   ├── data/
│   │   └── pokedex-data.json     # dados fornecidos na atividade
│   ├── hooks/
│   │   ├── useAuth.js            # usuário logado e sessão
│   │   ├── useFavorites.js       # favoritos do usuário (com atualização imediata)
│   │   └── useModal.js           # comportamento comum dos modais (Esc, foco, scroll)
│   ├── lib/supabase.js           # cliente do Supabase
│   ├── services/
│   │   ├── auth.js               # entrar, criar conta, sair
│   │   └── favorites.js          # buscar, adicionar e remover favoritos
│   ├── utils/pokemon.js          # funções auxiliares (formatar ID, URL da imagem, tipos...)
│   ├── App.jsx                   # estado principal, abas e filtros
│   ├── main.jsx
│   └── index.css
├── .env.example                  # modelo das variáveis do Supabase
├── index.html
├── package.json
└── vite.config.js
```

### Estrutura dos componentes

```text
App
 ├── UserMenu
 ├── SearchBar + TypeFilter        (aba Pokémon)
 ├── PokemonList → PokemonCard     (abas Pokémon e Favoritos)
 ├── TrainerList → TrainerCard     (aba Treinadores)
 ├── PokemonDetails                (modal)
 └── AuthModal                     (modal)
```

## 🛠️ Tecnologias

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) 8
- [Supabase](https://supabase.com/) (`@supabase/supabase-js`) para autenticação e banco de dados
- CSS puro (sem frameworks), com CSS Grid e `color-mix`
- ESLint
