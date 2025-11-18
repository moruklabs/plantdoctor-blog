// import type { MDXComponents } from "mdx/types" // TODO: Fix MDX types import
import Image, { type ImageProps } from 'next/image'
import { Callout } from '@/components/molecules/callout'
import type { ReactNode } from 'react'

type MDXComponents = Record<string, unknown>

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }: { children: ReactNode }) => (
      <h1 className="text-4xl font-bold tracking-tight mb-6 mt-8 first:mt-0">{children}</h1>
    ),
    h2: ({ children }: { children: ReactNode }) => (
      <h2 className="text-3xl font-semibold tracking-tight mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }: { children: ReactNode }) => (
      <h3 className="text-2xl font-semibold tracking-tight mb-4 mt-6">{children}</h3>
    ),
    p: ({ children }: { children: ReactNode }) => <p className="leading-7 mb-4">{children}</p>,
    ul: ({ children }: { children: ReactNode }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
    blockquote: ({ children }: { children: ReactNode }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
    img: (props: ImageProps) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="rounded-lg my-6"
        {...(props as ImageProps)}
      />
    ),
    Callout,
    ...components,
  }
}
