/* 
Define an asynchronous queue function that executes a list of tasks with a maximum 
number of workers, in parallel. The function processes the tasks in the order they 
are received and returns an array with the results of each task. The tasks are passed 
as an array of functions that return promises. Each function represents a task that 
takes a variable amount of time to complete.

The `asyncQueue` function is designed to limit the number of active workers to a 
specified maximum. If the number of active workers reaches the maximum, the function 
waits for any worker to complete before scheduling the next task to run. This ensures 
that the maximum number of workers is not exceeded at any given time.

The code should handle any errors that may arise from executing the tasks in the asyncQueue function. If an error occurs, instead of throwing it, the code should catch it and append it to the result array.

*/

async function asyncQueue(tasks, maxWorkers = 4) {
  // Implement...
}

// ------ MAIN ------
const tasksToRun = [1, 2, 3, 4, 5, 6].map(
  (value) => () =>
    new Promise((resolve) => {
      console.log(`Starting task ${value}...`);
      setTimeout(() => {
        console.log(`Task ${value} finished...`);
        resolve(value);
      }, value * 1000);
    })
);

asyncQueue(tasksToRun).then(console.log)