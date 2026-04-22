/** @type {import('@lhci/cli').UserConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/tips',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
