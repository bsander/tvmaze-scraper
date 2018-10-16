import fetch from 'node-fetch'
import PQueue from 'p-queue'
import retry from 'p-retry'

const queue = new PQueue({ concurrency: 1 })

// tslint:disable-next-line: ban-types -- assume signature of wrapped function
const withQueueAndRetry = <T extends Function>(wrappedFunction: T) => async (
  ...args: any[]
) =>
  queue.add(() =>
    retry(
      async () => {
        const response = await wrappedFunction(...args)
        const { status } = response
        if (status !== 200) {
          throw new Error(`Encountered statuscode ${status}`)
        }
        return JSON.parse(await response.text())
      },
      {
        onFailedAttempt: (err) =>
          console.warn(`Retrying fetch: ${err.message}`),
      },
    ),
  )

export default withQueueAndRetry(fetch)
