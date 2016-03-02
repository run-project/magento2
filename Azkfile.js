/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({
  magento: {
    // Dependent systems
    depends: ["mysql"],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/php-fpm:5.6"},
    // Steps to execute before running instances
    provision: [
      "composer install",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "./run.sh",
    wait: 20,
    mounts: {
      '/azk/#{manifest.dir}'                       : sync("."),
      '/azk/#{manifest.dir}/composer.phar'         : persistent("./composer.phar"),
      '/azk/#{manifest.dir}/composer.lock'         : path("./composer.lock"),
      '/azk/#{manifest.dir}/.env.php'              : path("./.env.php"),
      '/azk/#{manifest.dir}/bootstrap/compiled.php': path("./bootstrap/compiled.php"),
      '/etc/nginx/sites-available/default'         : path("./nginx.conf"),

      // vendors
      '/azk/#{manifest.dir}/node_modules': persistent("./node_modules"),
      '/azk/#{manifest.dir}/.grunt'      : persistent("./.grunt"),
      '/azk/#{manifest.dir}/vendor'      : persistent("./vendor"),
      '/azk/#{manifest.dir}/var'         : persistent("./var"),
      '/azk/#{manifest.dir}/pub/media/'  : persistent("./pub/media/"),
      '/azk/#{manifest.dir}/pub/static/' : persistent("./pub/static/"),
    },
    scalable: {"default": 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      // exports global variables
      http: "80/tcp",
    },
    envs: {
      // Make sure that the PORT value is the same as the one
      // in ports/http below, and that it's also the same
      // if you're setting it in a .env file
      // APP_DIR: "/azk/#{manifest.dir}",
    },
  },
  mysql: {
    // More info about mysql image: http://images.azk.io/#/mysql?from=azkfile-mysql-images
    image: {"docker": "azukiapp/mysql:5.7"},
    shell: "/bin/bash",
    wait: 25,
    mounts: {
      '/var/lib/mysql': persistent("mysql_data"),
      // to clean mysql data, run:
      // $ azk shell mysql -c "rm -rf /var/lib/mysql/*"
    },
    ports: {
      // exports global variables: "#{net.port.data}"
      data: "3306/tcp",
    },
    envs: {
      // set instances variables
      MYSQL_USER         : "azk",
      MYSQL_PASSWORD     : "azk",
      MYSQL_DATABASE     : "#{manifest.dir}_development",
      MYSQL_ROOT_PASSWORD: "azk",
    },
    export_envs: {
      // check this gist to configure your database
      // https://gist.github.com/gullitmiranda/62082f2e47c364ef9617
      // DATABASE_URL: "mysql2://#{envs.MYSQL_USER}:#{envs.MYSQL_PASSWORD}@#{net.host}:#{net.port.data}/#{envs.MYSQL_DATABASE}",
      // or use splited envs:
      MYSQL_USER    : "#{envs.MYSQL_USER}",
      MYSQL_PASSWORD: "#{envs.MYSQL_PASSWORD}",
      MYSQL_HOST    : "#{net.host}",
      MYSQL_PORT    : "#{net.port.data}",
      MYSQL_DATABASE: "#{envs.MYSQL_DATABASE}"
    },
  },
});
