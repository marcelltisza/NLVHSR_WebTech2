const userRepository = require("../repositories/userRepository");

async function main() {
    const newUser = {
        email: "abc@gmail.com",
        password: "dfadsfasdhfibafbiwer"
    };
    await addUser(newUser);

    const anotherNewUser = {
        email: "nothing@freemail.hu",
        password: "vnoevndafibvasibbdsaic"
    };
    await addUser(anotherNewUser);
    
    console.log("users:");
    const users = await userRepository.get();
    users.forEach(user => {
        console.log(user);
    });

    await userRepository.dropDatabase();
}

async function addUser(user) {
    const userId = await userRepository.add(user);
    console.log("Added user:");
    console.log(await userRepository.getById(userId));
}

main();