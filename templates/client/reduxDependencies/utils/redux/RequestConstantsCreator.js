import createConstants from './ConstantsCreator';

const REQUEST_CONSTANTS = [
  'SEND',
  'SUCCEED',
  'REJECTED',
  'ERROR_ENCOUNTERED',
];

export default (module, submodule, additionalConstants = []) => createConstants(
  module,
  submodule,
  ...REQUEST_CONSTANTS,
  ...additionalConstants,
);
