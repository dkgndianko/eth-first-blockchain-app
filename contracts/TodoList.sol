pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;


contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;
    event TaskCreated(
        Task task
    );
    event TaskToggled(
        uint id,
        bool completed
    );

    constructor() public {
        createTask("Mouhamad's first task");
        createTask("Give credit to https://dappuniversity.com");
    }


    function createTask(string memory _content) public {
        taskCount++;
        Task memory task = Task(taskCount, _content, false);
        tasks[taskCount] = task;
        emit TaskCreated(task);
    }

    function toggleCompleted(uint _id) public {
        Task memory task = tasks[_id];
        task.completed = !task.completed;
        tasks[_id] = task;
        emit TaskToggled(_id, task.completed);
    }
}