<p align="center">
  <a href="https://www.vendure.io">
    <img alt="Vendure logo" src="https://res.cloudinary.com/hczpmiapo/image/upload/v1731251520/Static%20assets/Logos/Vendure_rk01uc.png" width=100>
  </a>
  <a href="https://railway.app?referralCode=-Yg50p">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://railway.app/brand/logo-light.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://railway.app/brand/logo-dark.svg">
      <img alt="Railway logo" src="https://railway.app/brand/logo-light.svg" width=100>
    </picture>
  </a>
</p>

<h2 align="center">
  Vendure open source ecommerce platform<br>
  <a href="https://railway.app/template/6DeBLr?referralCode=-Yg50p">one-click deploy on railway!</a>
</h2>

<h1 align="center">
  Need help?<br>
  <a href="https://funkyton.com/vendure-tutorial/">Step by step tutorial, with screenshots</a>
</h1>





<p align="center">
This boilerplate consist of a complete setup, backend + admin dashboard & react storefront. Everything is connected, plug n' play when using the reailway deploy template</p>

<p align="center">
  <a href="https://github.com/vendure-ecommerce/vendure/blob/0b1dcb7b03ca127ac8e63540d61d13fbcc02ff9f/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://www.vendure.io/community">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
</p>

# vendure-backend

### railway setup

Use one-click deploy template:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/6DeBLr?referralCode=-Yg50p)

Please change the value of environment variables: `SUPERADMIN_USERNAME` and `SUPERADMIN_PASSWORD`.

### local setup
- Rename `.env.template` ->  `.env`
- To connect to your online database, from local; copy the values of the envorinment variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_SCHEMA`
that has been auto-generated on railway, and add to your `.env`. Or use value for a local database.

### requirements
- **postgres database** (will be automatically generated if using the railway template)


### commands
`cd vendure-backend/`
`pnpm install` to install dependencies
`pnpm build` will compile the app.
`pnpm dev` will start the local development server with admin dashboard at: `localhost:3000/admin`
`pnpm start` will start the production backend server with admin dashboard at: `localhost:3000/admin`
`pnpm seed:once` will seed the database with initial data (run after first setup). This script automatically rebuilds native modules like bcrypt to ensure compatibility across different platforms.

### additional resources
- **Tutorial blog post**: [Vendure Tutorial on Funkyton](https://funkyton.com/vendure-tutorial/)


<p align="center">
  <a href="https://funkyton.com/">
    A template by,
    <br><br>
    <picture>
      <img alt="FUNKYTON logo" src="https://res-5.cloudinary.com/hczpmiapo/image/upload/q_auto/v1/ghost-blog-images/funkyton-logo.png" width=200>
    </picture>
  </a>
</p>

### License

This project is licensed under the GPLv3 License. See the [LICENSE](LICENSE.md) file for details.
