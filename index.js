
async function asyncQueue(tasks, maxWorkers = 4) {

    const runTask = async (task) => {
        if (!maxWorkers) return new Promise(resolve => setImmediate(() => resolve(runTask(task))))

        maxWorkers--
        return task().then(res => {
            maxWorkers++
            return res
        })
    }

    const results = tasks.map((task) => {
        return runTask(task)
    })

    return Promise.all(results)
}
  
const tasksToRun = [1, 2, 3, 4, 5, 6].map(
    (value) => () =>
        new Promise((resolve) => {
            console.log(`Starting task ${value}...`)
            setTimeout(() => {
                console.log(`Task ${value} finished...`)
                resolve(value)
            }, value * 1000)
        })
);
  
asyncQueue(tasksToRun).then(console.log)
