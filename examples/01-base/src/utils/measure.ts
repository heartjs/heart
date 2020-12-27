export async function measure(title: string, callback: any) {
  const startTime = new Date().getTime()
  await callback()
  const endTime = new Date().getTime()
  console.log(`Elapsed: "${title}" >>> ${endTime - startTime}ms`)
}
