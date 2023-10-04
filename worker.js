const { parentPort } = require('worker_threads')

parentPort.on('message', (msg) => {
    if (msg === 'kill') process.exit()
    const func = (new Function('return (' + msg.func + ')')())().then(res => parentPort.postMessage(res))
})
