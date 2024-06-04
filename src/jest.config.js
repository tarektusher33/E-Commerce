module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
};