const createConstants = (module, submodule, ...actions) => actions.reduce((acc, c) => {
  Object.defineProperty(acc, c, {
    value: [module, submodule, c].join('/'),
    enumerable: true,
  });
  return acc;
}, {});

export default createConstants;
