import Color from 'color'

/* eslint-disable max-len */
export const colorsPalette = [
  /* '#4d4d4d', '#999999', '#ffffff', */ '#f44e3b', '#fe9200', '#fcdc00', '#dbdf00', '#a4dd00', '#68ccca', '#73d8ff', '#aea1ff', '#fda1ff',
  /* '#333333', '#808080', '#cccccc', */ '#d33115', '#e27300', '#fcc400', '#b0bc00', '#68bc00', '#16a5a5', '#009ce0', '#7b64ff', '#fa28ff',
  /* '#000000', '#666666', '#b3b3b3', */ '#9f0500', '#c45100', '#fb9e00', '#808900', '#194d33', '#0c797d', '#0062b1', '#653294', '#ab149e',
]

const basePalette = {
  blue: '#008FC5',
  lightblue: '#BAD7F2',
  white: '#E9ECF5',
  pink: '#B96D9C',
  red: '#A63446',
  green: '#359283',
  transparent: 'rgba(0,0,0,0)',

  gray: '#384955',
  lightergray: '#8292A9',
  lightgray: '#D5CFE1',
  lightlightgray: '#F5F5FA',
}
basePalette.transparentWhite = Color(basePalette.white).alpha(0.4).string()
basePalette.transparentPink = Color(basePalette.pink).alpha(0.45).string()
basePalette.transparentBlue = Color(basePalette.blue).alpha(0.25).string()

const categoriesControlTmpViewArr = [
  basePalette.transparent,
  `${basePalette.transparent} 30%`,
  `${basePalette.transparentPink} 30%`,
  `${basePalette.transparentPink} 50%`,
  `${basePalette.transparent} 50%`,
]
const categoriesControlTmpView =
  `repeating-linear-gradient(-45deg, ${categoriesControlTmpViewArr.join(', ')}) top left fixed`

const getCurrentIntervalGradient = ({ isRight = false } = {}) => {
  const middleStop = 0.76
  const transparencies = [0, 0.06, 0.32]
  const pink = Color(basePalette.pink)
  const transparentPink = pink.alpha(0).string()
  const semitransparentPink = pink.alpha(transparencies[1]).string()
  const finalPink = pink.alpha(transparencies[2]).string()

  const start = 'linear-gradient(90deg,'
  if (isRight) {
    return `${start} ${transparentPink} 0%, ${semitransparentPink} ${middleStop}%, ${finalPink} 100%)`
  }
  return `${start} ${finalPink} 0%, ${semitransparentPink} ${100 - middleStop}%, ${transparentPink} 100%)`
}

export const palette = {
  primaryBackground: basePalette.white,
  secondaryBackground: basePalette.lightblue,
  buttonBackground: basePalette.blue,

  whiteText: basePalette.white,
  grayText: basePalette.lightgray,
  darkGrayText: Color(basePalette.gray).lighten(0.2).string(),
  // horizontal or vertical line of same colors looks darker, so lighten it
  darkGrayLine: Color(basePalette.gray).lighten(0.4).string(),
  blackText: basePalette.gray,

  tabPanelBorder: basePalette.blue,
  activeTabBackground: basePalette.lightblue,

  boundsSelectorBorder: basePalette.gray,
  boundsSelectorAlign: Color(basePalette.gray).alpha(0.3).string(),
  boundsSelectorVertAlign: Color(basePalette.gray).alpha(0.2).string(),

  yGridline: basePalette.lightergray,
  yGridlineSecondary: basePalette.lightgray,

  highlighter: basePalette.transparentWhite,
  tooltipTextColor: basePalette.gray,

  categoriesControlTmpView,

  chartSettingsBackground: basePalette.lightlightgray,
  chartSettingsActiveBackground: basePalette.lightblue,

  futureDaysHighlighter: basePalette.transparentWhite,
  todayLine: basePalette.red,

  weekendLinesWeekend: basePalette.lightlightgray,
  weekendLinesMonth: basePalette.lightgray,
  weekendLinesQuarter: basePalette.transparentBlue,
  weekendLinesYear: basePalette.pink,

  chartBorderColor: basePalette.lightergray,

  chartCursorBorderColor: basePalette.lightergray,
  chartCursorTextColor: basePalette.lightergray,

  diffRed: basePalette.red,
  diffGreen: basePalette.green,

  currentIntervalBackgroundColor: basePalette.transparentPink,
  currentIntervalGradientRight: getCurrentIntervalGradient({ isRight: true }),
  currentIntervalGradientLeft: getCurrentIntervalGradient({ isRight: false }),

  tableHeaderBackgroundColor: basePalette.lightblue,
  tableSpinnerBackgroundColor: basePalette.red,
  altTableRowBackgroundColor: basePalette.lightlightgray,

  modalCloseBtnColorBorder: basePalette.lightergray,
  modalCloseBtnColorIcon: basePalette.gray,
}
