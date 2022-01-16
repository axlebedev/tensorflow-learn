import fs from 'fs'
import path from 'path'
import round from 'lodash/round'
import pad from 'lodash/pad'
import getETFs from './pullData/getETFs'
import getStocks from './pullData/getStocks'
import getCandle from './pullData/getCandle'
import momentum from './strategy/momentum'
import testHistory from './strategy/testHistory'
import { getSnpTickers, getPrices, history } from './strategy/snp'
import { oneTickerYearly } from './strategy/manual'

const main = async (): Promise<void> => {
  // const etfs = await getETFs()
  // const test = await testHistory(history())
  const tickets = getSnpTickers()
  const prices = await getPrices(tickets)
  console.log('%c11111', 'background:#00FF00', 'prices=', prices);

  return
  let leader = null
  for (let month = 0; month < 12; ++month) {
    const date = new Date()
    date.setMonth(month)
    for (let howManyTickers = 20; howManyTickers > 0; --howManyTickers) {
      const deals = await momentum({
        instruments: snpTickers,
        howManyTickers,
        date,
      })
      const testArray = await testHistory(deals)
      const toPrint = {
        avgProfit: pad(`${round(testArray.avgProfit, 3)}`, 5),
        minProfit: pad(`${round(Math.min(...testArray.profitArray.map(({ profit }) => profit)), 3)}`, 5),
        maxProfit: pad(`${round(Math.max(...testArray.profitArray.map(({ profit }) => profit)), 3)}`, 5),
      }
      console.log(pad(`${howManyTickers}`, 2), pad(`${month}`, 2), 'testArray=', toPrint);
      if (!leader || testArray.avgProfit > leader.avgProfit) {
        leader = testArray
      }
    }
  }
  console.log('%c11111', 'background:#00FF00', 'leader=', leader);
  //
  // const stocks = JSON.parse(fs.readFileSync(snpTickers, { encoding: 'utf8' })).snp.map((ticker) => ({ ticker }))
  // console.log('%c11111', 'background:#00FF00', 'stocks=', stocks);
  // const stocksdeals = await momentum(stocks)
  // const stockstestArray = await testHistory(stocksdeals)
  // console.log('stocks', 'testArray=', testArray);
}

export default main
