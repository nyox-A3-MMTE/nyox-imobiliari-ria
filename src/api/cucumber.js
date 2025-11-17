export default {
  paths: ['tests/features/**/*.feature'],
  require: [
    'tests/steps/serverInstance.mjs',
    'tests/steps/userSteps.mjs',
    'tests/steps/imoveisSteps.mjs'
  ],
  format: ['@cucumber/pretty-formatter'],
  publishQuiet: true,
};
