/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

declare module 'next/cache' {
  export * from 'next/dist/server/web/spec-extension/revalidate';
  
  // Override revalidateTag to support 2 arguments
  export function revalidateTag(tag: string, profile?: string): void;
}
