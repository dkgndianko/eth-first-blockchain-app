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

    constructor() public {
        createTask("Mouhamad's first task");
    }


    function createTask(string memory _content) public {
        taskCount++;
        Task memory task = Task(taskCount, _content, false);
        tasks[taskCount] = task;
        emit TaskCreated(task);
    }
}