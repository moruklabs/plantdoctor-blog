// Mock for next-intl to avoid ES module issues in Jest
/* eslint-disable @typescript-eslint/no-require-imports */
const React = require('react')

module.exports = {
  useTranslations: () => (key) => key,
  useLocale: () => 'en',
  useMessages: () => ({}),
  NextIntlClientProvider: ({ children }) => children,
  getTranslations: async () => (key) => key,
  getMessages: async () => ({}),
  getRequestConfig: () => ({}),
  setRequestLocale: () => {},
  defineRouting: (config) => config,
  createNavigation: () => {
    const Link = ({ href, children, ...props }) =>
      React.createElement('a', { href, ...props }, children)
    const redirect = (path) => path
    const usePathname = () => '/'
    const useRouter = () => ({
      push: () => {},
      replace: () => {},
      back: () => {},
      forward: () => {},
      refresh: () => {},
      prefetch: () => {},
    })
    const getPathname = () => '/'

    return { Link, redirect, usePathname, useRouter, getPathname }
  },
}
