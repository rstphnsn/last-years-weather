module.exports = {
  'env': {
    "browser": true,
    'es6': true,
    'node': true,
    'mocha': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'no-unused-vars': [
      'error',
      {
        'vars': 'all',
        'args': 'none',
      }
    ],
    'no-console': 'off',
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
