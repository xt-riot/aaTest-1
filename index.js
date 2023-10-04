const { Worker } = require('worker_threads')


const workers = []

async function asyncQueue(tasks, maxWorkers = 4) {
    let allTasks
    Array(maxWorkers).fill().forEach(() => {
        workers.push({
            worker: new Worker('./worker.js'),
            isFree: true
        })
    })
    const findFreeWorker = async () => {
        const index = workers.findIndex(worker => worker.isFree === true)
        if (index === -1) {
            await new Promise(resolve => setTimeout(resolve, 10))
            return findFreeWorker()
        }
        workers[index].isFree = false
        return index
    }
    const taskToPromise = (task, index) => {
        return new Promise(async (resolve, reject) => {
            const workerIndex = await findFreeWorker()
            workers[workerIndex].worker.postMessage({
                func: task.toString().replace(/${value}|value/g, index + 1)
            })
            workers[workerIndex].worker.on('message', (msg) => {
                workers[workerIndex].isFree = true
                resolve(msg)
            })
            workers[workerIndex].worker.on('error', (msg) => {
                workers[workerIndex].isFree = true
                
                resolve(msg)
            })
            workers[workerIndex].worker.on('exit', code => {
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
            })
        })
    }

    allTasks = tasks.map((task, index) => taskToPromise(task, index))

    const results = (await Promise.allSettled(allTasks)).map(res => res.value)
    workers.forEach(worker => worker.worker.terminate())
    return results
}
  
const tasksToRun = [1, 2, 3, 4, 5, 6].map(
    (value) => () => {
        return new Promise((resolve) => {
        console.log(`Starting task ${value}...`)
        setTimeout(() => {
            console.log(`Task ${value} finished...`)
            resolve(value)
        }, value * 1000)
    })}
)

  
asyncQueue(tasksToRun).then(res => console.log('res', res))