export const getNaturalArray = (length) => {
  return Array.from(Array(length), (_, index) => index)
}

export const getIsDemo = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.has('demo')
}
