require('reflect-metadata');

require('ts-node').register({
  project: 'tsconfig.typeorm.json',
  transpileOnly: true,
});

require('typeorm/cli');
