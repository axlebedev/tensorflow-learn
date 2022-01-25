/* eslint-disable quote-props */
// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: '@babel/eslint-parser',

  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },

  extends: [
    'airbnb',
  ],

  plugins: ['babel'],

  globals: {
    __DEV__: true,
    __CLIENT__: true,
    gapi: 'readonly',
    tf: true,
    tfvis: true,
  },

  env: {
    browser: true,
    jest: true,
  },

  rules: {
    // Так и не смог подружить это правило с yarn workspaces
    'import/no-extraneous-dependencies': 0,

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],

    // Functional and class components are equivalent from React’s point of view
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': 'off',

    // Мы не хотим при импорте указывать расширение файла
    'import/extensions': 0,

    // Нам к сожалению нужны интерактивные div'ы
    'jsx-a11y/no-static-element-interactions': 0,

    // Ребята из airbnb считают, что даже в циклах не стоит использовать ++
    // в основном потому, что они в целом избегают for, while, и т.д.
    // мы же их иногда используем
    'no-plusplus': ['error', {
      'allowForLoopAfterthoughts': true,
    }],

    // Забить на тело функции. Хотел бы, чтобы было правило на
    // обязательные скобки для многострочных функций, но такой опции нет
    'arrow-body-style': 0,
    'arrow-parens': ['error', 'always'],

    // Запрещаем функции с телом в одну строчку типа (arg) => { return arg; }
    // Делаем перенос строки обязательным
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],

    // Тернарник обязательно должен быть многострочным вида
    // condition
    //   ? expression1
    //   : expression2
    'multiline-ternary': 0,
    'operator-linebreak': ['error', 'before', { 'overrides': { '?': 'before', ':': 'before', '=': 'after' } }],

    // все if должны быть с фигурными скобками
    'curly': ['error', 'all'],

    // https://eslint.org/docs/rules/function-paren-newline
    // https://eslint.org/docs/rules/object-curly-newline
    // Не нашел подходящую для нас опцию, голосовали за miltiline, но с ним не
    // все ок
    'function-paren-newline': 'off',
    'object-curly-newline': 'off',

    // я хотел бы never в propsax и always в children, но такой опции нет
    'react/jsx-curly-brace-presence': 0,

    // не нужно дестракчурить this.props
    'react/destructuring-assignment': 0,

    // попробуем без точке с запятой
    'semi': ['error', 'never'],

    // вообще не понимаю этого правила
    'jsx-a11y/label-has-for': 0,

    // а это правило не работает вовсе, всегда дает ошибку
    'jsx-a11y/label-has-associated-control': 0,

    // бесит
    'import/prefer-default-export': 0,

    'react/jsx-props-no-spreading': 0,
    // ['error', {
    //   'html': 'ignore',
    //   'custom': 'ignore',
    // }],

    // в optional chaining бывал варнинг, если вызывается optional метод
    // а такое же правило из babel работает ок
    'no-unused-expressions': 'off',
    'babel/no-unused-expressions': 'error',

    // чтобы не срабатывал self в воркере
    'no-restricted-globals': 'off',

    // это нужно в useMemo
    'no-underscore-dangle': 'off',
  },

  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    'import/resolver': {
      node: {},
      webpack: {
        config: 'tools/webpack.config.babel.js',
      },
    },
  },
}
/* eslint-enable */
