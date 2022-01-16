import fs from 'fs'
import last from 'lodash/last'

const content = JSON.parse(fs.readFileSync('exps.json'))
console.log('%c11111', 'background:#00FF00', 'last(content)=', last(content));

const pricesByItem = content.reduce(
  (acc, current) => {
    if (current.category.toLowerCase() !== 'еда') {
      return acc
    }
    const item = current.item.toLowerCase()
    if (acc[item] !== undefined) {
      acc[item] += current.price
    } else {
      acc[item] = current.price
    }
    return acc
  },
  {},
)

console.log('%c11111', 'background:#00FF00', 'pricesByItem=', pricesByItem)
