import type { FC, PropsWithChildren } from 'react'

const DefaultProvider: FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>
}

export { DefaultProvider }
