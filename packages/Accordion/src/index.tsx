import React, { cloneElement } from 'react'
import * as Ariakit from '@ariakit/react'
import AnimateHeight from 'react-animate-height'
import { RightIcon } from '@welcome-ui/icons'
import { CreateWuiProps, forwardRef } from '@welcome-ui/system'

import * as S from './styles'

export interface AccordionOptions {
  title: string | JSX.Element
  icon?: JSX.Element
  /**
   * store from useAccordion()
   */
  store: UseAccordion
}

export type AccordionProps = CreateWuiProps<'div', AccordionOptions>

export const Accordion = forwardRef<'div', AccordionProps>(
  ({ children, icon = <RightIcon />, title, store, dataTestId, ...rest }, ref) => {
    const isOpen = store.useState('open')

    return (
      <S.Accordion data-testid={dataTestId} ref={ref} {...rest}>
        <S.Disclosure data-testid={dataTestId ? `${dataTestId}-title` : undefined} store={store}>
          {title}
          <S.Icon isOpen={isOpen}>{cloneElement(icon, { size: 'sm' })}</S.Icon>
        </S.Disclosure>
        <S.Content
          data-testid={dataTestId ? `${dataTestId}-content` : undefined}
          isOpen={isOpen}
          store={store}
        >
          <AnimateHeight animateOpacity duration={200} height={isOpen ? 'auto' : 0}>
            {children}
          </AnimateHeight>
        </S.Content>
      </S.Accordion>
    )
  }
)

export type UseAccordion = Ariakit.DisclosureStore
export type UseAccordionProps = Ariakit.DisclosureStoreProps
export type UseAccordionState = Ariakit.DisclosureStoreState

export function useAccordion(options?: UseAccordionProps): UseAccordion {
  const accordion = Ariakit.useDisclosureStore({ animated: true, ...options })

  return accordion
}
