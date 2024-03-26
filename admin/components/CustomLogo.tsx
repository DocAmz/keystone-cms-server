/** @jsxRuntime classic */
/** @jsx jsx */
import Link from 'next/link'
import Image from 'next/image'
import { jsx, H3 } from '@keystone-ui/core'
import Logo from '../../public/ressources/logo.svg'

export const CustomLogo = () => {
  return (
    <H3 css={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      margin: '0',
      padding: '0',
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: 'var(--keystone-color-white)',
      textDecoration: 'none',
    }} data-testid='custom-logo'>
      <Image
        src={Logo.src}
        alt="KeystoneJS Logo"
        width="32"
        height="32"
      />
      <Link
        href="/"
        css={{
          // TODO: we don't have colors in our design-system for this.
          backgroundImage: `linear-gradient(to right, #0ea5e9, #6366f1)`,
          backgroundClip: 'text',
          lineHeight: '1.75rem',
          color: 'transparent',
          verticalAlign: 'middle',
          transition: 'color 0.3s ease',
          textDecoration: 'none',
          fontSize: '1.75rem',
        }}
      >
        FAF CMS
      </Link>
    </H3>
  )
}