import React, { Children, cloneElement, useCallback, useEffect, useRef, useState } from 'react'
import { Icons } from '@welcome-ui/icons.font'
import debounce from 'lodash.debounce'
import { Size, useViewportSize } from '@welcome-ui/utils'
import { useTheme } from '@xstyled/styled-components'
import { CreateWuiProps } from '@welcome-ui/system'

import { useInterval } from './use-interval'
import * as S from './styles'

export interface UseSwiperProps {
  autoplay?: boolean
  /** If true the swiper will begin at the middle */
  centeredSlides?: boolean
  duration?: number
  /** Won't be used if centeredSlides is true */
  firstSlideToShow?: number
  fullWidth?: boolean
  id?: string
  loop?: boolean
  /** Size of left and right navigation arrows */
  navigationSize?: Size
  /** Number of slides to show per view */
  slidesPerView?: {
    mobile: number
    tablet: number
    desktop: number
  }
  /** Space between each slides */
  spaceBetween?: number
  /** Use black colors for the pagination and arrows in case of slides too bright */
  withDarkUI?: boolean
  /** Show left and rigth navigation arrows on mobile/tablet or/and desktop */
  withNavigation?: {
    mobile: boolean
    desktop: boolean
  }
  /** Show bottom pagination on mobile/tablet or/and desktop */
  withPagination?: {
    mobile: boolean
    desktop: boolean
  }
}

export const useSwiper = (options: UseSwiperProps = {}) => {
  const {
    centeredSlides = false,
    firstSlideToShow = 0,
    fullWidth = false,
    id = 'swiper',
    navigationSize = 'md' as Size,
    slidesPerView = { mobile: 1, tablet: 1, desktop: 1 },
    spaceBetween = 20,
    withNavigation = { mobile: true, desktop: true },
    withPagination = { mobile: false, desktop: false },
    loop = false,
    autoplay = false,
    duration = 5000,
    withDarkUI = false,
  } = options

  const shouldLoop = loop || autoplay
  const { width: viewportWidth } = useViewportSize()
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSlidesPerView, setCurrentSlidesPerView] = useState(slidesPerView.desktop)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const ref = useRef<HTMLUListElement>()
  const theme = useTheme()

  const getCurrentSlidesPerView = useCallback(() => {
    if (viewportWidth <= theme.screens.md) {
      setCurrentSlidesPerView(slidesPerView.mobile)
    } else if (viewportWidth <= theme.screens.lg) {
      setCurrentSlidesPerView(slidesPerView.tablet)
    } else {
      setCurrentSlidesPerView(slidesPerView.desktop)
    }
  }, [slidesPerView, theme.screens.lg, theme.screens.md, viewportWidth])

  useEffect(() => {
    getCurrentSlidesPerView()
  }, [getCurrentSlidesPerView, viewportWidth])

  return {
    centeredSlides,
    firstSlideToShow,
    currentSlidesPerView,
    currentPage,
    setCurrentPage,
    fullWidth,
    id,
    navigationSize,
    slidesPerView,
    spaceBetween,
    withNavigation,
    withPagination,
    autoplay,
    shouldLoop,
    duration,
    withDarkUI,
    ref,
    setShowLeftArrow,
    setShowRightArrow,
    showLeftArrow,
    showRightArrow,
  }
}

export type UseSwiper = ReturnType<typeof useSwiper>

export type SwiperInitialProps = {
  children: JSX.Element | JSX.Element[]
  dataTestId?: string
  store: UseSwiper
}

export type SwiperProps = CreateWuiProps<'div', SwiperInitialProps>

export const Swiper = ({ children, dataTestId, store, ...rest }: SwiperProps) => {
  const {
    autoplay,
    centeredSlides,
    currentPage,
    currentSlidesPerView,
    duration,
    firstSlideToShow,
    fullWidth,
    id,
    navigationSize,
    ref,
    setCurrentPage,
    setShowLeftArrow,
    setShowRightArrow,
    shouldLoop,
    showLeftArrow,
    showRightArrow,
    slidesPerView,
    spaceBetween,
    withDarkUI,
    withNavigation,
    withPagination,
  } = store

  const slides = Children.map(children, (child, i) => {
    const key = `${id}-${i}`
    return cloneElement(child, {
      ...child.props,
      id: key,
      key,
      'aria-hidden': Math.ceil((i + 1) / currentSlidesPerView) - 1 !== currentPage,
      'aria-roledescription': 'slide',
      'aria-label': `${i + 1} of ${Children.toArray(children).length}`,
    })
  })

  const slidesLength = slides.length
  const numberOfPage = Math.ceil(slidesLength / currentSlidesPerView)
  const bullets = Array.from(Array(numberOfPage).keys())

  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === bullets.length - 1

  const firstPageToShow = centeredSlides
    ? // if centeredSlides is true, we calculate which number is the middle page
      Math.floor(numberOfPage / 2)
    : // if centeredSlides is false, we calculate on which page the number in firstSlideToShow props is
      Math.ceil(firstSlideToShow / currentSlidesPerView) - 1

  const getArrowStates = () => {
    const sliderContainer = ref?.current
    if (sliderContainer && !shouldLoop) {
      const { offsetWidth, scrollLeft, scrollWidth } = sliderContainer
      const isFirstPage = !(scrollLeft > spaceBetween)
      const isLastPage = !(scrollWidth - (scrollLeft + offsetWidth) > spaceBetween)

      setShowLeftArrow(!isFirstPage)
      setShowRightArrow(!isLastPage)
    } else {
      setShowLeftArrow(true)
      setShowRightArrow(true)
    }
  }

  const updatePage = () => {
    const sliderContainer = ref?.current
    if (sliderContainer) {
      const { children, offsetWidth, scrollLeft, scrollWidth } = sliderContainer
      const childWidth = children?.[0]?.getBoundingClientRect()?.width

      const isLastPage = !(scrollWidth - (scrollLeft + offsetWidth) > spaceBetween)

      const nextPage = isLastPage
        ? bullets.length - 1
        : Math.round(scrollLeft / ((childWidth + spaceBetween) * currentSlidesPerView))

      if (nextPage !== currentPage) {
        setCurrentPage(nextPage)
      }
    }
  }

  const handleScroll = debounce(() => {
    getArrowStates()
    updatePage()
  }, 100)

  const goTo = useCallback(
    (page: number, isFirstInit = false) => {
      const sliderContainer = ref?.current
      const childWidth = sliderContainer?.children?.[0]?.getBoundingClientRect()?.width

      sliderContainer?.scrollTo({
        left: page * (childWidth + spaceBetween) * currentSlidesPerView,
        top: 0,
        // We don't want to have a scroll effect when we first render the swiper
        behavior: !isFirstInit ? 'smooth' : 'auto',
      })
    },
    [currentSlidesPerView, spaceBetween, ref]
  )

  const goNext = useCallback(() => {
    if (shouldLoop && isLastPage) {
      goTo(0)
    } else {
      goTo(currentPage + 1)
    }
  }, [currentPage, goTo, isLastPage, shouldLoop])

  const goPrev = useCallback(() => {
    if (isFirstPage && shouldLoop) {
      goTo(bullets.length - 1)
    } else {
      goTo(currentPage - 1)
    }
  }, [bullets.length, currentPage, goTo, isFirstPage, shouldLoop])

  // Add autoplay
  useInterval(
    () => {
      if (autoplay) {
        goNext()
      }
    },
    autoplay ? duration : null
  )

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') {
        goPrev()
      }

      if (e.code === 'ArrowRight') {
        goNext()
      }
    }

    window.addEventListener('keydown', handleKeys)

    return () => window.removeEventListener('keydown', handleKeys)
  }, [goPrev, goNext])

  useEffect(() => {
    goTo(firstPageToShow, true)
    getArrowStates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <S.Swiper data-testid={dataTestId} {...rest}>
      <S.Container
        fullWidth={fullWidth}
        onScroll={handleScroll}
        ref={ref}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
      >
        {slides}
      </S.Container>
      <S.Arrow
        data-testid={dataTestId && `${dataTestId}-prev-button`}
        disabled={!showLeftArrow}
        left={10}
        onClick={goPrev}
        position="absolute"
        shape="circle"
        size={navigationSize}
        variant={withDarkUI ? 'secondary' : 'ghost'}
        withDarkUI={withDarkUI}
        withNavigation={withNavigation}
      >
        <Icons.Left />
      </S.Arrow>
      <S.Arrow
        data-testid={dataTestId && `${dataTestId}-next-button`}
        disabled={!showRightArrow}
        onClick={goNext}
        position="absolute"
        right={10}
        shape="circle"
        size={navigationSize}
        variant={withDarkUI ? 'secondary' : 'ghost'}
        withDarkUI={withDarkUI}
        withNavigation={withNavigation}
      >
        <Icons.Right />
      </S.Arrow>
      <S.Pagination
        className="swiper-pagination"
        data-testid={dataTestId && `${dataTestId}-pagination`}
        role="tablist"
        withPagination={withPagination}
      >
        {bullets.length > 1 &&
          bullets.map((_, idx) => {
            const props = {
              idx,
              role: 'tab',
              'aria-controls': `${id}-${idx}`,
              'aria-label': `${idx + 1} of ${bullets.length}`,
              'aria-selected': idx === currentPage,
              onClick: () => goTo(idx),
            }

            return (
              <S.Bullet
                active={idx === currentPage}
                key={`bullet-${idx + 1}`}
                withDarkUI={withDarkUI}
                {...props}
              />
            )
          })}
      </S.Pagination>
    </S.Swiper>
  )
}

Swiper.displayName = 'Swiper'
