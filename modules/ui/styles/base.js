import * as colors from './colors'

const unit = 8 // px
const tabBorderBottom = 1 // px
const activeTabBorderBottom = 3 // px

export const fontFamilies = {
  sansSerif: 'Arial',
  monospace: 'Courier New',
}

export const padding = {
  huge: unit * 8,
  big: unit * 2,
  main: unit,
  small: unit / 2,
  tiny: unit / 4,
}

export const margin = {
  big: unit * 2,
  main: unit,
  small: unit / 2,
}

export const repeatingLineSize = unit * 4

export const boxShadow = {
  boxShadow: '0 1px 6px 0 rgba(32, 33, 36, 0.28)',
}

export const borderRadius = unit / 2

export const smallFont = {
  fontFamily: fontFamilies.sansSerif,
  fontSize: unit * 1.5,
}

export const mainFont = {
  fontFamily: fontFamilies.sansSerif,
  fontSize: unit * 2,
}

export const midsizeFont = {
  fontFamily: fontFamilies.sansSerif,
  fontSize: unit * 3,
}

export const bigFont = {
  fontFamily: fontFamilies.sansSerif,
  fontSize: unit * 4,
}

export const headerFont = {
  fontFamily: fontFamilies.sansSerif,
  fontSize: unit * 2.5,
  whiteSpace: 'nowrap',
}

export const button = {
  backgroundColor: colors.palette.buttonBackground,
  color: colors.palette.whiteText,
  textDecoration: 'none',
  padding: unit,
  borderRadius: unit / 2,
}

export const tabPanel = {
  paddingBottom: unit / 2,
  borderBottom: `${tabBorderBottom}px solid ${colors.palette.tabPanelBorder}`,
}
export const tab = {
  textDecoration: 'none',
  padding: `${unit / 2}px ${unit}px`,
  color: colors.palette.blackText,
}
export const activeTab = {
  borderBottom: `${activeTabBorderBottom}px solid ${colors.palette.tabPanelBorder}`,
  paddingBottom: activeTabBorderBottom,
}

// for boundsSelectorDot
export const dotSize = unit * 2
