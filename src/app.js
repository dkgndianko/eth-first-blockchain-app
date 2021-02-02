App = {
    contracts: {},
    loading: false,
    load: async () => {
        // Load app
        console.log("app loading ...");
        await App.loadWeb3();
        const accounts = await App.getAccounts();
        console.log(accounts);
        await App.loadAccount();
        const todoListContract = await App.getContract();
        console.log(todoListContract);
        await App.loadContract();

        App.render();

        const tasks = await App.getTasks();
        console.log(tasks);
        App.loadTasks();
    },
    loadWeb3: async () => {
        if (window.ethereum) {
            try {
                // Request account access if needed
                await ethereum.request({
                    method: 'eth_requestAccounts'
                });
                App.web3Provider = ethereum;
                console.log('Web3 is initialized');
                /* // Acccounts now exposed
                ethereum.request({
                    method: 'eth_sendTransaction',
                    params: []
                });*/
            } catch (error) {
                // User denied account access...
                console.error('Error when initializing Web3');
                console.error(error);
            }
        }
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    },
    getAccounts: async () => {
        return ethereum.request({
            method: 'eth_requestAccounts'
        });
    },
    loadAccount: async () => {
        const accounts = await App.getAccounts();
        if (accounts.length > 0) {
            App.account = accounts[0];
        }
    },
    getContract: async () => {
        return $.getJSON('TodoList.json');
    },
    loadContract: async () => {
        const contractJson = await App.getContract()
        const contract = TruffleContract(contractJson);
        contract.setProvider(App.web3Provider);
        App.contracts.todoList = contract;
        App.todoList = await contract.deployed();

    },
    getTaskCount: async () => {
        return App.todoList.taskCount();
    },
    getTaskById: async (taskId) => {
        return App.todoList.tasks(taskId);
    },
    getTasks: async () => {
        const tasks = [];
        const taskCount = await App.getTaskCount();
        for (var i=1; i<= taskCount; i++) {
            task = await App.getTaskById(i);
            tasks.push(task);
        }
        return tasks;
    },
    loadTasks: async () => {
        if (App.loading) {
            return;
        }
        App.setLoading(true);
        const taskTemplate = $('.taskTemplate');
        const completedTasks = $('#completedTaskList');
        const uncompletedTasks = $('#taskList');
        const tasks = await App.getTasks();
        tasks.forEach((task) => {
            const taskContent = taskTemplate.clone();
            taskContent.find('.content').html(task.content);
            taskContent.find('input')
            .prop('name', task.id)
            .prop('checked', task.completed)
            .on('click', App.toggleCompleted);
            (task.completed?completedTasks:uncompletedTasks).append(taskContent);
            taskContent.show();
        });
        App.setLoading(false);
    },
    toggleCompleted: async () => {

    },
    render: async () => {
        $('#account').html(App.account);
    },
    rederTasks: async () => {

    },
    createTask: async () => {
        console.log('maa ngui nii');
        App.setLoading(true);
        const content = $('#newTask').val();
        if (content) {
            await App.todoList.createTask(content, {from: App.account});
            console.log('added '+ content + ". going to refresh the page");
            window.location.reload();
        }
    },
    setLoading: (loading) => {
        App.loading = loading;
        const loader = $('#loader');
        const content = $('#content');
        if (loading) {
            loader.show();
            content.hide();
        }
        else {
            loader.hide();
            content.show();
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load();
    })
})