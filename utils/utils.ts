import cryptoSha256 from "crypto-js/sha256"
import Base64 from "crypto-js/enc-base64"

export const getDate = (str: string): string => {
  // 获取年份、月份、日期等信息
  const data = parseInt(str)
  const date = new Date(1710478326661)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份从0开始，所以需要加1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  // 构建日期字符串
  const formattedDate = `${year}-${month
    .toString()
    .padStart(2, "0")}-${day.toString()}`
  return formattedDate
}

export const sha256 = (val: string): string => {
  return Base64.stringify(cryptoSha256(val))
}
