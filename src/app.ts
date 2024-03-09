import { configDotenv } from 'dotenv';
configDotenv();

const App = (): string => {
    const STR = process.env.MY_STR;
    const message = 'hello world';

    console.log(message);
    console.log(STR);
    return message;
};

export default App;
App();