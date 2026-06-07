const { default: tsJest } = require('ts-jest');

module.exports = {
  createTransformer: (options) => {
    const transformer = tsJest.createTransformer({
      tsconfig: 'tsconfig.test.json',
    });
    const process = transformer.process.bind(transformer);

    return {
      ...transformer,
      process: (sourceText, sourcePath, config) => {
        const result = process(sourceText, sourcePath, config);
        const code = typeof result === 'string' ? result : result.code;

        // Ignore decorators and parameter metadata checks
        let newCode = code;
        newCode = newCode.replace(/(__decorate)/g, '/* istanbul ignore next */ $1');
        newCode = newCode.replace(
          /(typeof \(_[a-zA-Z0-9_]+ = typeof [^)]+\) === "function")/g,
          '/* istanbul ignore next */ $1'
        );

        return typeof result === 'string' ? newCode : { ...result, code: newCode };
      }
    };
  }
};
