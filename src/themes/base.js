import blue from './blue'
import dark from './dark'
import purple from './purple'
import red from './red'
import grey from './grey'
import teal from './teal'

export const themes = {
  blue,
  dark,
  purple,
  red,
  grey,
  teal,
  0: blue,
  1: dark,
  2: purple,
  3: red,
  4: grey,
  5: teal,
  reverseLookup: {
    blue: 0,
    dark: 1,
    purple: 2,
    red: 3,
    grey: 4,
    teal: 5,
  },
  count: 5
}

export const themeCount = 6

export default function getTheme(theme_) {
  const theme = ("" + theme_).toLowerCase()
  if (theme in themes) {
    return themes[theme]
  } else {
    return false
  }
}