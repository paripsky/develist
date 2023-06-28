# Develist

![Nuxtjs](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)

Develist is a web application built using Nuxt 3 and Supabase, designed to help
developers manage and organize their development tools and resources. With
Develist, developers can create a categorized list of their favorite development
tools, libraries, frameworks, tutorials, and other resources for easy reference
and sharing.

The application utilizes Nuxt 3, a powerful framework for building modern web
applications, and Supabase, an open-source Firebase alternative, for handling
data storage and authentication. In addition, it leverages the NuxtLabs UI
components, a set of beautifully designed UI elements specifically tailored for
Nuxt applications.

## Features

- Create a personalized list of development tools and resources.
- Organize items into customizable categories.
- Add, edit, and delete items from the list.
- Mark items as favorites for quick access.
- Search and filter items by category, name, or tags.
- User authentication and authorization.
- Responsive design for a seamless experience across devices.

## Getting Started

To get started with Develist, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/paripsky/develist.git
```

2. Install dependencies:

```bash
cd develist
npm install
```

3. Configure Supabase:

   - Create a new project on Supabase (https://supabase.io/).
   - Copy your Supabase project URL, API key & Service key.
   - Rename the `.env.example` file to `.env` and update the `SUPABASE_URL`,
     `SUPABASE_KEY` and `SUPABASE_SERVICE_KEY` values with your Supabase URL,
     API key & Service key respectively.

4. Start the development server:

```bash
npm run dev
```

5. Visit `http://localhost:3000` in your browser to access Develist.

## Contributing

Contributions to Develist are welcome! If you have any ideas, suggestions, or
bug reports, please open an issue or submit a pull request. Make sure to follow
the existing coding style and conventions.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

Develist is built upon the amazing technologies and open-source projects.
Special thanks to the following:

- [Nuxt 3](https://nuxtjs.org) - The Vue.js framework for building modern web
  applications.
- [Supabase](https://supabase.io) - An open-source Firebase alternative for
  building and scaling applications.
- [NuxtLabs UI](https://labs.nuxtjs.org/ui) - Beautifully designed UI components
  for Nuxt.js applications.
