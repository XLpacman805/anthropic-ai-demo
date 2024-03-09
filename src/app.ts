import { configDotenv } from 'dotenv';
configDotenv();

const STR = process.env.MY_STR;
const message = 'hello world';

console.log(message);
console.log(STR);