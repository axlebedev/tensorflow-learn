import * as colors from './colors'
import * as base from './base'

export { colors }

export const flexDivRow = {
  display: 'flex',
  width: '100%',
}

// Layout {{{
export const layoutWrapperDiv = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}
export const layoutMiddleDiv = {
  position: 'relative',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',

  // https://stackoverflow.com/questions/14962468/how-can-i-combine-flexbox-and-vertical-scroll-in-a-full-height-app
  flex: '1 1 auto',
  overflowY: 'auto',
  height: '0px',
}
// }}}

// Header {{{
export const headerWrapper = {
  flexGrow: 0,
  display: 'flex',
  alignItems: 'baseline',
  padding: base.padding.main,
}

export const headerLinksWrapper = {
  ...base.tabPanel,
}

export const headerTitle = {
  fontWeight: 'bold',
}
export const active = {}
export const headerLink = {
  ...base.headerFont,
  ...base.tab,
  '&$active': {
    ...base.activeTab,
  },
}
// }}}

export const flexSpacer = {
  display: 'inline-block',
  flexBasis: 10000,
}
