const TodoList = artifacts.require("./TodoList.sol");
contract('TodoList', (accounts) => {
    before(async () => {
        this.todoList = await TodoList.deployed();
    })

    it('deploys successfully', async () => {
        const address = await this.todoList.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    })

    it('lists tasks', async () => {
        const taskCount = await this.todoList.taskCount();
        const lastTask = await this.todoList.tasks(taskCount);
        assert.equal(taskCount.toNumber(), lastTask.id.toNumber());
        assert.equal(lastTask.content, "Mouhamad's first task");
        assert.equal(lastTask.completed, false);
    })

    it('creates tasks', async () => {
        const taskCount = await this.todoList.taskCount();
        const result = await this.todoList.createTask('new testing task');
        const newTaskCount = await this.todoList.taskCount();
        assert.equal(newTaskCount.toNumber(), taskCount.toNumber() + 1);
        const event = result.logs[0].args;
        console.log(result.logs[0]);
        const createdTask = event.task;
        assert.equal(createdTask.id, newTaskCount);
        assert.equal(createdTask.content, 'new testing task');
        assert.equal(createdTask.completed, false);
    })
});