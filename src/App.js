import { useState, useEffect, useRef } from "react";
import "./App.css";

// Main App component
export default function App() {
const [history, setHistory] = useState([]);
const [command, setCommand] = useState("");
const [currentView, setCurrentView] = useState(null);
const [isFullscreen, setIsFullscreen] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
const terminalRef = useRef(null);
const inputRef = useRef(null);

// Define the data for each experiment
const experiments = [
[
{
title: "FabCar – Managing Car Assets on Blockchain",
command: "fabcar",
content: {
aim: "To deploy and interact with the FabCar chaincode on a Hyperledger Fabric test network to demonstrate asset creation, querying, and transfer.",
prerequisites:
"- Fabric environment set up in Ubuntu (WSL2), Docker running, fabric-samples repository cloned, Go and Docker installed correctly.",
system_design:
"Asset: Car Record\nFields: make, model, color, owner\nFunctions: InitLedger, CreateCar, QueryAllCars, ChangeCarOwner",
program: `// FabCar Chaincode Logic
{
"make": "Toyota",
"model": "Prius",
"color": "blue",
"owner": "Tomoko"
}

// Functions:
// - InitLedger: Preloads some car records
// - CreateCar: Add a new car
// - QueryAllCars: Retrieve all car records
// - ChangeCarOwner: Update ownership of a car`,
steps: `1. Start the Test Network:
cd ../test-network
./network.sh down
./network.sh up createChannel -ca

2. Deploy the FabCar Chaincode:
./network.sh deployCC -ccn fabcar -ccp ../fabcar/javascript -ccl javascript

3. Set Up Application Environment:
cd ../fabcar/javascript
npm install

4. Enroll Admin and Register User:
node enrollAdmin.js
node registerUser.js

5. Run FabCar Application:
node invoke.js # Adds a new car asset
node query.js # Queries all cars on ledger`,
result:
"Students have gained hands-on experience with the basic life cycle of assets on the blockchain using Hyperledger Fabric.",
},
outputs: {
network_start: `$ ./network.sh up createChannel -ca
Using docker and docker-compose
LOCAL_VERSION=2.4.7
DOCKER_IMAGE_VERSION=2.4.7
CA_LOCAL_VERSION=1.5.5
CA_DOCKER_IMAGE_VERSION=1.5.5

========== Creating channel 'mychannel' ==========
Creating network "fabric_test" with the default driver
Generating certs using Fabric CA
Creating ca_org1 ... done
Creating ca_org2 ... done
Creating ca_orderer ... done

========== Channel 'mychannel' created successfully ==========

Joining org1 peer to the channel...
2024-08-10 18:30:15.123 UTC [channelCmd] InitCmdFactory -> INFO 001 Endorser and orderer connections initialized
2024-08-10 18:30:15.234 UTC [channelCmd] executeJoin -> INFO 002 Successfully submitted proposal to join channel
Anchor peer set for org1 on channel 'mychannel'

Joining org2 peer to the channel...
2024-08-10 18:30:16.456 UTC [channelCmd] InitCmdFactory -> INFO 001 Endorser and orderer connections initialized
2024-08-10 18:30:16.567 UTC [channelCmd] executeJoin -> INFO 002 Successfully submitted proposal to join channel
Anchor peer set for org2 on channel 'mychannel'

Channel 'mychannel' joined successfully`,

chaincode_deploy: `$ ./network.sh deployCC -ccn fabcar -ccp ../fabcar/javascript -ccl javascript
deploying chaincode on channel 'mychannel'

executing with the following
- CHANNEL_NAME: mychannel
- CC_NAME: fabcar
- CC_SRC_PATH: ../fabcar/javascript
- CC_SRC_LANGUAGE: javascript
- CC_VERSION: 1.0
- CC_SEQUENCE: 1
- CC_INIT_FCN: NA
- CC_END_POLICY: NA
- CC_COLL_CONFIG: NA
- CC_RUNTIME_LANGUAGE: node
- FABRIC_CFG_PATH: /opt/gopath/src/github.com/hyperledger/fabric/peer

Packaging chaincode...
2024-08-10 18:31:20.123 UTC [cli.lifecycle.chaincode] submitInstallProposal -> INFO 001 Installed chaincode 'fabcar' on peer0.org1.example.com:7051
2024-08-10 18:31:20.234 UTC [cli.lifecycle.chaincode] submitInstallProposal -> INFO 002 Installed chaincode 'fabcar' on peer0.org2.example.com:9051

Querying chaincode definition on peer0.org1 on channel 'mychannel'...
Committed chaincode definition for chaincode 'fabcar' on channel 'mychannel':
Version: 1.0, Sequence: 1, Endorsement Plugin: escc, Validation Plugin: vscc, Approvals: [org1MSP: true, org2MSP: true]

Chaincode deployment completed successfully!`,

query_cars: `$ node query.js
Wallet path: /home/user/fabric-samples/fabcar/javascript/wallet
Transaction has been evaluated, result is:
[
{
"Key": "CAR0",
"Record": {
"make": "Toyota",
"model": "Prius",
"color": "blue",
"owner": "Tomoko"
}
},
{
"Key": "CAR1",
"Record": {
"make": "Ford",
"model": "Mustang",
"color": "red",
"owner": "Brad"
}
},
{
"Key": "CAR2",
"Record": {
"make": "Hyundai",
"model": "Tucson",
"color": "green",
"owner": "Jin Soo"
}
},
{
"Key": "CAR3",
"Record": {
"make": "Volkswagen",
"model": "Passat",
"color": "yellow",
"owner": "Max"
}
}
]`,

create_car: `$ node invoke.js
Wallet path: /home/user/fabric-samples/fabcar/javascript/wallet
Transaction has been submitted, result is:
Transaction ID: b8c2c3e4f5a6789d0123456789abcdef
Status: VALID

Car CAR10 has been successfully created with the following details:
{
"make": "Honda",
"model": "Civic",
"color": "white",
"owner": "Alice"
}

Transaction completed successfully at 2024-08-10T18:35:42.123Z`
}
},

{
title: "Library Book Management System",
command: "library",
content: {
aim: "To design and implement a decentralized Library Book Management System on the Hyperledger Fabric platform, enabling secure, transparent, and auditable management of books, borrowers, and transactions like issue/return.",
prerequisites:
"- Ubuntu 20.04 or WSL2 setup, Docker & Docker Compose, Node.js v14.x or Go v1.17+, Fabric binaries and Docker images (version 2.2+ recommended).",
system_design:
"Asset: Book Asset\nFields: BookID, Title, Author, ISBN, Status (Available/Issued), BorrowerID\nUser Asset Fields: UserID, Name, Email, Role (Student/Faculty)",
program: `// Chaincode (library.js)
'use strict';
const { Contract } = require('fabric-contract-api');

class LibraryContract extends Contract {
async initLedger(ctx) {
const books = [
{ bookID: 'B001', title: 'Blockchain Basics', author: 'Daniel Drescher', isbn: '9781484226032', status: 'Available', borrower: '' }
];
for (const book of books) {
await ctx.stub.putState(book.bookID, Buffer.from(JSON.stringify(book)));
}
}

async addBook(ctx, bookID, title, author, isbn) {
const book = { bookID, title, author, isbn, status: 'Available', borrower: '' };
await ctx.stub.putState(bookID, Buffer.from(JSON.stringify(book)));
}

async issueBook(ctx, bookID, userID) {
const bookBytes = await ctx.stub.getState(bookID);
if (!bookBytes || bookBytes.length === 0) throw new Error(\`\${bookID} not found\`);
const book = JSON.parse(bookBytes.toString());
if (book.status !== 'Available') throw new Error(\`Book \${bookID} already issued\`);
book.status = 'Issued';
book.borrower = userID;
await ctx.stub.putState(bookID, Buffer.from(JSON.stringify(book)));
}

async returnBook(ctx, bookID) {
const bookBytes = await ctx.stub.getState(bookID);
const book = JSON.parse(bookBytes.toString());
book.status = 'Available';
book.borrower = '';
await ctx.stub.putState(bookID, Buffer.from(JSON.stringify(book)));
}

async queryBook(ctx, bookID) {
const bookBytes = await ctx.stub.getState(bookID);
if (!bookBytes || bookBytes.length === 0) throw new Error(\`\${bookID} not found\`);
return bookBytes.toString();
}

async getAllBooks(ctx) {
const results = [];
const iterator = await ctx.stub.getStateByRange('', '');
for await (const res of iterator) {
results.push(JSON.parse(res.value.toString('utf8')));
}
return JSON.stringify(results);
}
}

module.exports = LibraryContract;`,
steps: `1. Deploy the network and chaincode:
./network.sh up createChannel -ca
./network.sh deployCC -ccn librarycc -ccp ../chaincode/library -ccl javascript

2. Test the chaincode using CLI commands:
- Add Book: \`peer chaincode invoke -C mychannel -n librarycc -c '{"function":"addBook","Args":["B002","Hyperledger Fabric","Andreas Ohlmer","9781492045397"]}'\`
- Issue Book: \`peer chaincode invoke -C mychannel -n librarycc -c '{"function":"issueBook","Args":["B002","U123"]}'\`
- Return Book: \`peer chaincode invoke -C mychannel -n librarycc -c '{"function":"returnBook","Args":["B002"]}'\`
- Query Book: \`peer chaincode query -C mychannel -n librarycc -c '{"function":"queryBook","Args":["B002"]}'\``,
result:
"This experiment demonstrated how Hyperledger Fabric can be used to implement a decentralized Library Management System with asset lifecycle, smart contracts, and blockchain-based transparency.",
},
outputs: {
add_book: `$ peer chaincode invoke -C mychannel -n librarycc -c '{"function":"addBook","Args":["B002","Hyperledger Fabric","Andreas Ohlmer","9781492045397"]}'
2024-08-10 18:40:15.123 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: e7f8c9d0a1b2345678901234567890ef
Block Number: 5
Book B002 'Hyperledger Fabric' by Andreas Ohlmer has been successfully added to the library.`,

issue_book: `$ peer chaincode invoke -C mychannel -n librarycc -c '{"function":"issueBook","Args":["B002","U123"]}'
2024-08-10 18:41:22.456 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: f1a2b3c4d5e6789012345678901234ab
Block Number: 6
Book B002 has been successfully issued to user U123.
Status changed from 'Available' to 'Issued'.`,

query_book: `$ peer chaincode query -C mychannel -n librarycc -c '{"function":"queryBook","Args":["B002"]}'
{
"bookID": "B002",
"title": "Hyperledger Fabric",
"author": "Andreas Ohlmer",
"isbn": "9781492045397",
"status": "Issued",
"borrower": "U123"
}`,

return_book: `$ peer chaincode invoke -C mychannel -n librarycc -c '{"function":"returnBook","Args":["B002"]}'
2024-08-10 18:42:33.789 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: c4d5e6f7a8b9012345678901234567cd
Block Number: 7
Book B002 has been successfully returned.
Status changed from 'Issued' to 'Available'.
Borrower field cleared.`
}
},

// Add remaining experiments with outputs...
{
title: "Student Record Management System",
command: "student",
content: {
aim: "To implement a Student Record Management System on Hyperledger Fabric that allows secure creation, retrieval, and modification of student data using smart contracts.",
prerequisites:
"- Ubuntu 20.04 / WSL2, Docker & Docker Compose, Node.js v14.x / Go, Hyperledger Fabric Samples, Binaries, and Docker Images.",
system_design:
"Asset: Student Record\nFields: studentID, name, department, dob, email, grades (Object with subject-grade mapping)",
program: `// Chaincode (student.js)
'use strict';
const { Contract } = require('fabric-contract-api');

class StudentContract extends Contract {
async initLedger(ctx) {
const students = [
{ studentID: 'S001', name: 'Alice', department: 'CSE', dob: '2002-01-10', email: 'alice@example.com', grades: {} }
];
for (const student of students) {
await ctx.stub.putState(student.studentID, Buffer.from(JSON.stringify(student)));
}
}

async addStudent(ctx, studentID, name, department, dob, email) {
const student = { studentID, name, department, dob, email, grades: {} };
await ctx.stub.putState(studentID, Buffer.from(JSON.stringify(student)));
}

async updateGrade(ctx, studentID, subject, grade) {
const studentBytes = await ctx.stub.getState(studentID);
if (!studentBytes || studentBytes.length === 0) {
throw new Error(\`Student \${studentID} not found\`);
}
const student = JSON.parse(studentBytes.toString());
student.grades[subject] = grade;
await ctx.stub.putState(studentID, Buffer.from(JSON.stringify(student)));
}

async getStudent(ctx, studentID) {
const studentBytes = await ctx.stub.getState(studentID);
if (!studentBytes || studentBytes.length === 0) {
throw new Error(\`Student \${studentID} not found\`);
}
return studentBytes.toString();
}

async getAllStudents(ctx) {
const results = [];
const iterator = await ctx.stub.getStateByRange('', '');
for await (const res of iterator) {
results.push(JSON.parse(res.value.toString('utf8')));
}
return JSON.stringify(results);
}
}

module.exports = StudentContract;`,
steps: `1. Deploy the network and chaincode:
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn studentcc -ccp ../chaincode/student -ccl javascript

2. Test the chaincode using CLI commands:
- Add Student: \`peer chaincode invoke -C mychannel -n studentcc -c '{"function":"addStudent","Args":["S002","Bob","ECE","2001-03-14","bob@example.com"]}'\`
- Update Grade: \`peer chaincode invoke -C mychannel -n studentcc -c '{"function":"updateGrade","Args":["S002","Math","A+"]}'\`
- Query Student: \`peer chaincode query -C mychannel -n studentcc -c '{"function":"getStudent","Args":["S002"]}'\`
- List All Students: \`peer chaincode query -C mychannel -n studentcc -c '{"function":"getAllStudents","Args":[]}'\``,
result:
"This lab demonstrated how blockchain can enhance security, transparency, and traceability in managing sensitive academic data like student records using Hyperledger Fabric.",
},
outputs: {
add_student: `$ peer chaincode invoke -C mychannel -n studentcc -c '{"function":"addStudent","Args":["S002","Bob","ECE","2001-03-14","bob@example.com"]}'
2024-08-10 18:45:11.234 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: a1b2c3d4e5f6789012345678901234ef
Block Number: 8
Student S002 'Bob' has been successfully added to the system.
Department: ECE
Email: bob@example.com`,

update_grade: `$ peer chaincode invoke -C mychannel -n studentcc -c '{"function":"updateGrade","Args":["S002","Math","A+"]}'
2024-08-10 18:46:25.567 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: b2c3d4e5f6a7890123456789012345fg
Block Number: 9
Grade updated successfully for student S002
Subject: Math
Grade: A+`,

query_student: `$ peer chaincode query -C mychannel -n studentcc -c '{"function":"getStudent","Args":["S002"]}'
{
"studentID": "S002",
"name": "Bob",
"department": "ECE",
"dob": "2001-03-14",
"email": "bob@example.com",
"grades": {
"Math": "A+",
"Physics": "A",
"Chemistry": "B+"
}
}`
}
},

{
title: "Peer-to-Peer Fund Transfer System",
command: "wallet",
content: {
aim: "To implement a decentralized digital wallet system using Hyperledger Fabric, where users can transfer funds securely in a peer-to-peer (P2P) manner using smart contracts.",
prerequisites:
"- Docker & Docker Compose, Node.js (v14.x) or Go (if using Go SDK), Hyperledger Fabric samples, binaries, and Docker images.",
system_design:
"Asset: User Wallet\nFields: userID, name, balance (Number - Wallet balance in currency units)",
program: `// Chaincode (wallet.js)
'use strict';
const { Contract } = require('fabric-contract-api');

class WalletContract extends Contract {
async initLedger(ctx) {
const users = [
{ userID: 'U001', name: 'Alice', balance: 5000 },
{ userID: 'U002', name: 'Bob', balance: 3000 }
];
for (const user of users) {
await ctx.stub.putState(user.userID, Buffer.from(JSON.stringify(user)));
}
}

async createUser(ctx, userID, name, initialBalance) {
const user = { userID, name, balance: parseFloat(initialBalance) };
await ctx.stub.putState(userID, Buffer.from(JSON.stringify(user)));
}

async transferFunds(ctx, fromUserID, toUserID, amount) {
const amountFloat = parseFloat(amount);
const fromUserBytes = await ctx.stub.getState(fromUserID);
const toUserBytes = await ctx.stub.getState(toUserID);

if (!fromUserBytes || !toUserBytes || fromUserBytes.length === 0 || toUserBytes.length === 0) {
throw new Error(\`One or both user accounts not found.\`);
}

const fromUser = JSON.parse(fromUserBytes.toString());
const toUser = JSON.parse(toUserBytes.toString());

if (fromUser.balance < amountFloat) {
throw new Error(\`Insufficient funds in \${fromUserID}\`);
}

fromUser.balance -= amountFloat;
toUser.balance += amountFloat;

await ctx.stub.putState(fromUserID, Buffer.from(JSON.stringify(fromUser)));
await ctx.stub.putState(toUserID, Buffer.from(JSON.stringify(toUser)));
}

async getUser(ctx, userID) {
const userBytes = await ctx.stub.getState(userID);
if (!userBytes || userBytes.length === 0) {
throw new Error(\`User \${userID} not found\`);
}
return userBytes.toString();
}

async getAllUsers(ctx) {
const results = [];
const iterator = await ctx.stub.getStateByRange('', '');
for await (const res of iterator) {
results.push(JSON.parse(res.value.toString('utf8')));
}
return JSON.stringify(results);
}
}

module.exports = WalletContract;`,
steps: `1. Deploy the network and chaincode:
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn walletcc -ccp ../chaincode/wallet -ccl javascript

2. Test the chaincode using CLI commands:
- Create User: \`peer chaincode invoke -C mychannel -n walletcc -c '{"function":"createUser","Args":["U003","Charlie","1000"]}'\`
- Transfer Funds: \`peer chaincode invoke -C mychannel -n walletcc -c '{"function":"transferFunds","Args":["U001","U002","1000"]}'\`
- Query User: \`peer chaincode query -C mychannel -n walletcc -c '{"function":"getUser","Args":["U002"]}'\`
- List All Users: \`peer chaincode query -C mychannel -n walletcc -c '{"function":"getAllUsers","Args":[]}'\``,
result:
"This lab demonstrated a secure P2P fund transfer system using Hyperledger Fabric, showcasing blockchain's ability to track transactions immutably, prevent double-spending, and remove intermediaries.",
},
outputs: {
create_user: `$ peer chaincode invoke -C mychannel -n walletcc -c '{"function":"createUser","Args":["U003","Charlie","1000"]}'
2024-08-10 18:48:33.123 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: c3d4e5f6a7b8901234567890123456gh
Block Number: 10
User U003 'Charlie' created successfully with initial balance of ₹1000.00`,

transfer_funds: `$ peer chaincode invoke -C mychannel -n walletcc -c '{"function":"transferFunds","Args":["U001","U002","1000"]}'
2024-08-10 18:49:44.456 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: d4e5f6a7b8c9012345678901234567hi
Block Number: 11

=== FUND TRANSFER COMPLETED ===
From: U001 (Alice)
To: U002 (Bob)
Amount: ₹1000.00
Transaction Fee: ₹0.00
New Balance (Alice): ₹4000.00
New Balance (Bob): ₹4000.00`,

query_balance: `$ peer chaincode query -C mychannel -n walletcc -c '{"function":"getUser","Args":["U002"]}'
{
"userID": "U002",
"name": "Bob",
"balance": 4000,
"lastTransaction": "2024-08-10T18:49:44.456Z",
"transactionCount": 3
}`
}
},

{
title: "Employee Payroll Management System",
command: "payroll",
content: {
aim: "To implement an Employee Payroll Management System on Hyperledger Fabric that securely manages employee details, salary records, and payroll processing on a tamper-proof distributed ledger.",
prerequisites:
"- Docker & Docker Compose, Node.js (v14.x) or Go, Hyperledger Fabric binaries and Docker images.",
system_design:
"Asset: Employee Record\nFields: empID, name, department, salary, lastPaidDate",
program: `// Chaincode (payroll.js)
'use strict';
const { Contract } = require('fabric-contract-api');

class PayrollContract extends Contract {
async initLedger(ctx) {
const employees = [
{ empID: 'E001', name: 'Alice', department: 'HR', salary: 50000, lastPaidDate: '' },
{ empID: 'E002', name: 'Bob', department: 'IT', salary: 60000, lastPaidDate: '' }
];
for (const emp of employees) {
await ctx.stub.putState(emp.empID, Buffer.from(JSON.stringify(emp)));
}
}

async addEmployee(ctx, empID, name, department, salary) {
const emp = { empID, name, department, salary: parseFloat(salary), lastPaidDate: '' };
await ctx.stub.putState(empID, Buffer.from(JSON.stringify(emp)));
}

async processPayroll(ctx, empID, date) {
const empBytes = await ctx.stub.getState(empID);
if (!empBytes || empBytes.length === 0) {
throw new Error(\`Employee \${empID} not found\`);
}
const emp = JSON.parse(empBytes.toString());
emp.lastPaidDate = date;
await ctx.stub.putState(empID, Buffer.from(JSON.stringify(emp)));
}

async getEmployee(ctx, empID) {
const empBytes = await ctx.stub.getState(empID);
if (!empBytes || empBytes.length === 0) {
throw new Error(\`Employee \${empID} not found\`);
}
return empBytes.toString();
}

async getAllEmployees(ctx) {
const results = [];
const iterator = await ctx.stub.getStateByRange('', '');
for await (const res of iterator) {
results.push(JSON.parse(res.value.toString('utf8')));
}
return JSON.stringify(results);
}
}

module.exports = PayrollContract;`,
steps: `1. Deploy the network and chaincode:
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn payrollcc -ccp ../chaincode/payroll -ccl javascript

2. Test the chaincode using CLI commands:
- Add Employee: \`peer chaincode invoke -C mychannel -n payrollcc -c '{"function":"addEmployee","Args":["E003","Charlie","Finance","55000"]}'\`
- Process Salary Payment: \`peer chaincode invoke -C mychannel -n payrollcc -c '{"function":"processPayroll","Args":["E003","2025-07-01"]}'\`
- Query Employee: \`peer chaincode query -C mychannel -n payrollcc -c '{"function":"getEmployee","Args":["E003"]}'\`
- List All Employees: \`peer chaincode query -C mychannel -n payrollcc -c '{"function":"getAllEmployees","Args":[]}'\``,
result:
"This lab illustrates how Hyperledger Fabric can be used to build a decentralized employee payroll system that guarantees security, transparency, and immutability of salary transactions.",
},
outputs: {
add_employee: `$ peer chaincode invoke -C mychannel -n payrollcc -c '{"function":"addEmployee","Args":["E003","Charlie","Finance","55000"]}'
2024-08-10 18:52:15.789 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: e5f6a7b8c9d0123456789012345678ij
Block Number: 12
Employee E003 'Charlie' added to payroll system.
Department: Finance
Annual Salary: ₹55,000.00`,

process_payroll: `$ peer chaincode invoke -C mychannel -n payrollcc -c '{"function":"processPayroll","Args":["E003","2025-07-01"]}'
2024-08-10 18:53:22.012 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: f6a7b8c9d0e1234567890123456789jk
Block Number: 13

=== PAYROLL PROCESSED ===
Employee ID: E003
Employee Name: Charlie
Department: Finance
Salary Amount: ₹55,000.00
Payment Date: 2025-07-01
Status: PAID`
}
},

{
title: "Property Registration and Transfer System",
command: "property",
content: {
aim: "To develop a blockchain-based system that allows secure, immutable, and transparent property registration and ownership transfer using Hyperledger Fabric.",
prerequisites:
"- Docker & Docker Compose, Node.js v14.x or Go, Hyperledger Fabric binaries, samples, and Docker images.",
system_design:
"Asset: Property Record\nFields: propertyID, ownerID, location, area, marketValue, status",
program: `// Chaincode (property.js)
'use strict';
const { Contract } = require('fabric-contract-api');

class PropertyContract extends Contract {
async initLedger(ctx) {
const properties = [
{ propertyID: 'P001', ownerID: 'U001', location: 'Bangalore', area: '1200 sqft', marketValue: 4500000, status: 'Registered' }
];
for (const property of properties) {
await ctx.stub.putState(property.propertyID, Buffer.from(JSON.stringify(property)));
}
}

async registerProperty(ctx, propertyID, ownerID, location, area, value) {
const property = { propertyID, ownerID, location, area, marketValue: parseFloat(value), status: 'Registered' };
await ctx.stub.putState(propertyID, Buffer.from(JSON.stringify(property)));
}

async transferProperty(ctx, propertyID, newOwnerID) {
const propBytes = await ctx.stub.getState(propertyID);
if (!propBytes || propBytes.length === 0) {
throw new Error(\`Property \${propertyID} not found\`);
}
const property = JSON.parse(propBytes.toString());
property.ownerID = newOwnerID;
property.status = 'Transferred';
await ctx.stub.putState(propertyID, Buffer.from(JSON.stringify(property)));
}

async getProperty(ctx, propertyID) {
const propBytes = await ctx.stub.getState(propertyID);
if (!propBytes || propBytes.length === 0) {
throw new Error(\`Property \${propertyID} not found\`);
}
return propBytes.toString();
}

async getAllProperties(ctx) {
const results = [];
const iterator = await ctx.stub.getStateByRange('', '');
for await (const res of iterator) {
results.push(JSON.parse(res.value.toString('utf8')));
}
return JSON.stringify(results);
}
}

module.exports = PropertyContract;`,
steps: `1. Deploy the network and chaincode:
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn propertycc -ccp ../chaincode/property -ccl javascript

2. Test the chaincode using CLI commands:
- Register Property: \`peer chaincode invoke -C mychannel -n propertycc -c '{"function":"registerProperty","Args":["P002","U002","Mumbai","900 sqft","5500000"]}'\`
- Transfer Ownership: \`peer chaincode invoke -C mychannel -n propertycc -c '{"function":"transferProperty","Args":["P002","U003"]}'\`
- Query Property: \`peer chaincode query -C mychannel -n propertycc -c '{"function":"getProperty","Args":["P002"]}'\`
- List All Properties: \`peer chaincode query -C mychannel -n propertycc -c '{"function":"getAllProperties","Args":[]}'\``,
result:
"This lab illustrates how blockchain and Hyperledger Fabric can be used to modernize property registration systems by increasing trust, eliminating fraud, and improving transparency in land transactions.",
},
outputs: {
register_property: `$ peer chaincode invoke -C mychannel -n propertycc -c '{"function":"registerProperty","Args":["P002","U002","Mumbai","900 sqft","5500000"]}'
2024-08-10 18:55:33.345 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: a7b8c9d0e1f2345678901234567890kl
Block Number: 14

=== PROPERTY REGISTERED ===
Property ID: P002
Owner: U002
Location: Mumbai
Area: 900 sqft
Market Value: ₹55,00,000.00
Registration Status: REGISTERED
Registration Date: 2024-08-10`,

transfer_property: `$ peer chaincode invoke -C mychannel -n propertycc -c '{"function":"transferProperty","Args":["P002","U003"]}'
2024-08-10 18:56:44.678 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: b8c9d0e1f2a3456789012345678901lm
Block Number: 15

=== PROPERTY TRANSFER COMPLETED ===
Property ID: P002
Previous Owner: U002
New Owner: U003
Transfer Date: 2024-08-10
Transfer Status: COMPLETED
Legal Status: VERIFIED`
}
},

{
title: "Academic Credential Verification System",
command: "credential",
content: {
aim: "To develop a blockchain-based application to securely store and verify academic credentials (e.g., degrees, marksheets, certificates) using Hyperledger Fabric.",
prerequisites:
"- Basic understanding of Hyperledger Fabric architecture, Familiarity with Chaincode (smart contract) in Go or JavaScript, Installed Hyperledger Fabric samples, binaries, and Docker.",
system_design:
"Asset: Academic Credential\nFields: credentialID, studentName, university, degree, year, grade, issuedDate",
program: `// Chaincode (credentialcc.js)
'use strict';
const { Contract } = require('fabric-contract-api');

class CredentialContract extends Contract {
async initLedger(ctx) {
const credentials = [
{ credentialID: 'CRED1001', studentName: 'Alice Johnson', university: 'ABC University', degree: 'B.Tech Computer Science', year: '2024', grade: 'A+', issuedDate: '2024-06-15' }
];
for (const credential of credentials) {
await ctx.stub.putState(credential.credentialID, Buffer.from(JSON.stringify(credential)));
}
}

async addCredential(ctx, credentialID, studentName, university, degree, year, grade, issuedDate) {
const credential = { credentialID, studentName, university, degree, year, grade, issuedDate };
await ctx.stub.putState(credentialID, Buffer.from(JSON.stringify(credential)));
return JSON.stringify(credential);
}

async getCredential(ctx, credentialID) {
const credentialAsBytes = await ctx.stub.getState(credentialID);
if (!credentialAsBytes || credentialAsBytes.length === 0) {
throw new Error(\`Credential \${credentialID} does not exist\`);
}
return credentialAsBytes.toString();
}

async verifyCredential(ctx, credentialID) {
const credentialAsBytes = await ctx.stub.getState(credentialID);
if (!credentialAsBytes || credentialAsBytes.length === 0) {
return false;
}
return true;
}
}

module.exports = CredentialContract;`,
steps: `1. Deploy the network and chaincode:
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn credentialcc -ccp ../chaincode/credential -ccl javascript

2. Test the chaincode using CLI commands:
- Add Credential: \`peer chaincode invoke -C mychannel -n credentialcc -c '{"function":"addCredential","Args":["CRED1002","Bob Smith","XYZ University","MSc AI","2023","A","2023-07-15"]}'\`
- View Credential: \`peer chaincode query -C mychannel -n credentialcc -c '{"function":"getCredential","Args":["CRED1002"]}'\`
- Verify Credential: \`peer chaincode query -C mychannel -n credentialcc -c '{"function":"verifyCredential","Args":["CRED1002"]}'\`

3. Sample Test Cases:
- Add new credential: All fields of credential → Should return confirmation
- View credential: Valid ID → Should return correct data
- View credential: Invalid ID → Should throw error
- Verify credential: Valid ID → true
- Verify credential: Invalid ID → false`,
result:
"The student successfully deployed and tested a blockchain-based credential verification system using Hyperledger Fabric.",
},
outputs: {
add_credential: `$ peer chaincode invoke -C mychannel -n credentialcc -c '{"function":"addCredential","Args":["CRED1002","Bob Smith","XYZ University","MSc AI","2023","A","2023-07-15"]}'
2024-08-10 18:58:55.901 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: c9d0e1f2a3b4567890123456789012mn
Block Number: 16

=== CREDENTIAL ISSUED ===
Credential ID: CRED1002
Student: Bob Smith
University: XYZ University
Degree: MSc AI
Year: 2023
Grade: A
Issue Date: 2023-07-15
Verification Hash: 0xa1b2c3d4e5f6789012345678901234ef`,

verify_credential: `$ peer chaincode query -C mychannel -n credentialcc -c '{"function":"verifyCredential","Args":["CRED1002"]}'
{
"credentialID": "CRED1002",
"isValid": true,
"verificationStatus": "VERIFIED",
"issuer": "XYZ University",
"blockchainHash": "0xa1b2c3d4e5f6789012345678901234ef",
"verificationDate": "2024-08-10T18:59:01.234Z",
"message": "Credential is authentic and verified on blockchain"
}`
}
},

{
title: "E-commerce Product Catalog System",
command: "product",
content: {
aim: "To create a blockchain-based application that allows secure creation, storage, retrieval, and listing of products in an e-commerce catalog using Hyperledger Fabric.",
prerequisites:
"- Familiarity with Hyperledger Fabric, Chaincode, Docker, Node.js, Tools: VS Code, Postman (for REST calls), Fabric binaries setup.",
system_design:
"Asset: Product Record\nFields: productID, name, description, price, quantity, seller",
program: `// Chaincode (productcc.js)
'use strict';
const { Contract } = require('fabric-contract-api');

class ProductContract extends Contract {
async initLedger(ctx) {
const products = [
{ productID: 'P001', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with USB receiver', price: '799', quantity: '150', seller: 'TechStore' }
];
for (const product of products) {
await ctx.stub.putState(product.productID, Buffer.from(JSON.stringify(product)));
}
}

async addProduct(ctx, productID, name, description, price, quantity, seller) {
const product = { productID, name, description, price, quantity, seller };
await ctx.stub.putState(productID, Buffer.from(JSON.stringify(product)));
return JSON.stringify(product);
}

async getProduct(ctx, productID) {
const productAsBytes = await ctx.stub.getState(productID);
if (!productAsBytes || productAsBytes.length === 0) {
throw new Error(\`Product \${productID} does not exist\`);
}
return productAsBytes.toString();
}

async getAllProducts(ctx) {
const iterator = await ctx.stub.getStateByRange('', '');
const allResults = [];
while (true) {
const res = await iterator.next();
if (res.value && res.value.value.toString()) {
allResults.push(JSON.parse(res.value.value.toString('utf8')));
}
if (res.done) {
await iterator.close();
return JSON.stringify(allResults);
}
}
}
}

module.exports = ProductContract;`,
steps: `1. Deploy the network and chaincode:
./network.sh up createChannel -c ecommercechannel -ca
./network.sh deployCC -ccn productcc -ccp ../chaincode/product -ccl javascript

2. Test the chaincode using CLI commands:
- Add Product: \`peer chaincode invoke -o localhost:7050 -C ecommercechannel -n productcc -c '{"function":"addProduct","Args":["P002","Bluetooth Keyboard","Compact Bluetooth keyboard","1499","200","GadgetWorld"]}'\`
- View Product: \`peer chaincode query -C ecommercechannel -n productcc -c '{"function":"getProduct","Args":["P002"]}'\`
- List All Products: \`peer chaincode query -C ecommercechannel -n productcc -c '{"function":"getAllProducts","Args":[]}'\`

3. Sample Test Cases:
- Add new product: All product details → Product added to ledger
- Get product: Valid Product ID → Product JSON returned
- Get product: Invalid Product ID → Error message
- Get all products: N/A → All products in catalog`,
result:
"Successfully created a decentralized e-commerce catalog where products can be added, viewed, and listed in a tamper-proof manner.",
},
outputs: {
add_product: `$ peer chaincode invoke -o localhost:7050 -C ecommercechannel -n productcc -c '{"function":"addProduct","Args":["P002","Bluetooth Keyboard","Compact Bluetooth keyboard","1499","200","GadgetWorld"]}'
2024-08-10 19:01:12.234 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
Transaction ID: d0e1f2a3b4c5678901234567890123no
Block Number: 17

=== PRODUCT ADDED ===
Product ID: P002
Name: Bluetooth Keyboard
Description: Compact Bluetooth keyboard
Price: ₹1,499.00
Quantity: 200 units
Seller: GadgetWorld
Status: ACTIVE`,

query_products: `$ peer chaincode query -C ecommercechannel -n productcc -c '{"function":"getAllProducts","Args":[]}'
[
{
"productID": "P001",
"name": "Wireless Mouse",
"description": "Ergonomic wireless mouse with USB receiver",
"price": "799",
"quantity": "150",
"seller": "TechStore",
"status": "ACTIVE"
},
{
"productID": "P002",
"name": "Bluetooth Keyboard",
"description": "Compact Bluetooth keyboard",
"price": "1499",
"quantity": "200",
"seller": "GadgetWorld",
"status": "ACTIVE"
}
]`
}
}
],
];

// Helper function to simulate typing with delays
const simulateTyping = (text, delay = 50) => {
return new Promise((resolve) => {
let index = 0;
const interval = setInterval(() => {
if (index < text.length) {
index++;
} else {
clearInterval(interval);
resolve();
}
}, delay);
});
};

// Helper function to add history items with delays
const addHistoryWithDelay = async (items, baseDelay = 800) => {
for (let i = 0; i < items.length; i++) {
const item = items[i];
const delay = item.type === 'processing' ? 1000 :
item.type === 'output' ? 1200 : baseDelay;

await new Promise(resolve => setTimeout(resolve, delay));

setHistory(prev => [...prev, item]);
}
};

// Effect to handle initial welcome message with realistic delay
useEffect(() => {
const showWelcome = async () => {
await new Promise(resolve => setTimeout(resolve, 800));
const instructionMessage =
'Welcome to the Hyperledger Fabric Lab Manual CLI. Type "help" to see available commands.';
setHistory([{ type: "info", text: instructionMessage }]);
};
showWelcome();
}, []);

// Effect to scroll to the bottom of the terminal on new output
useEffect(() => {
if (terminalRef.current) {
terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
}
}, [history]);

// Effect to keep input focused
useEffect(() => {
if (inputRef.current && !isProcessing) {
inputRef.current.focus();
}
}, [history, isProcessing]);

// Handle clicks on terminal to refocus input
const handleTerminalClick = () => {
if (inputRef.current && !isProcessing) {
inputRef.current.focus();
}
};

// Toggle fullscreen mode
const toggleFullscreen = () => {
if (!document.fullscreenElement) {
document.documentElement
.requestFullscreen()
.then(() => {
setIsFullscreen(true);
})
.catch((err) => {
console.log("Error attempting to enable fullscreen:", err);
});
} else {
document.exitFullscreen().then(() => {
setIsFullscreen(false);
});
}
};

// Handle fullscreen change events
useEffect(() => {
const handleFullscreenChange = () => {
setIsFullscreen(!!document.fullscreenElement);
};

document.addEventListener("fullscreenchange", handleFullscreenChange);
return () => {
document.removeEventListener("fullscreenchange", handleFullscreenChange);
};
}, []);

// Handle command submission with realistic delays
const handleCommand = async (e) => {
// Handle F11 for fullscreen toggle
if (e.key === "F11") {
e.preventDefault();
toggleFullscreen();
return;
}

if (e.key === "Enter") {
const trimmedCommand = command.trim();
if (!trimmedCommand) {
setHistory((prev) => [
...prev,
{ type: "command", text: "user@labmanual:~$ " },
]);
setCommand("");
return;
}

setIsProcessing(true);

// Add command to history immediately
setHistory((prev) => [
...prev,
{ type: "command", text: "user@labmanual:~$ " + trimmedCommand },
]);

const [cmd, arg] = trimmedCommand.toLowerCase().split(" ");
let newHistory = [];

// Add a small delay to simulate command processing
await new Promise(resolve => setTimeout(resolve, 200));

switch (cmd) {
case "help":
newHistory = [
{ type: "info", text: "Available commands:" },
{ type: "info", text: " - help: Show this message" },
{ type: "info", text: " - list: List all available experiments" },
{ type: "info", text: " - view <experiment_name>: View details for a specific experiment (use the command name)" },
{ type: "info", text: " - output: Show available programs with sample outputs" },
{ type: "info", text: " - output <program_name>: Show sample output for a specific program" },
{ type: "info", text: " - clear: Clear the terminal" },
{ type: "info", text: " - fullscreen: Toggle fullscreen mode (or press F11)" },
];
await addHistoryWithDelay(newHistory, 150);
break;

case "list":
newHistory = [
{ type: "info", text: "Available experiments (use the command name to view details):" }
];
experiments[0].forEach((exp) =>
newHistory.push({
type: "info",
text: `- ${exp.command}: ${exp.title}`,
})
);
await addHistoryWithDelay(newHistory, 120);
break;

case "view":
const exp = experiments[0].find((e) => e.command === arg);
if (exp) {
setCurrentView(exp.content);
newHistory = [
{ type: "info", text: `Viewing details for: ${exp.title}` },
{ type: "info", text: '--- Use "clear" to return to the main prompt ---' },
];
await addHistoryWithDelay(newHistory, 500);
} else {
newHistory = [
{ type: "error", text: `Error: Experiment '${arg}' not found. Type 'list' to see all experiments.` }
];
await addHistoryWithDelay(newHistory, 300);
}
break;

case "output":
if (!arg) {
// Show processing indicator
setHistory(prev => [...prev, { type: "processing", text: "Loading available outputs..." }]);
await new Promise(resolve => setTimeout(resolve, 1000));

newHistory = [
{ type: "info", text: "Available programs with sample outputs:" }
];
experiments[0].forEach((exp) => {
if (exp.outputs) {
const outputKeys = Object.keys(exp.outputs);
newHistory.push({
type: "info",
text: `- ${exp.command}: ${outputKeys.join(", ")}`,
});
}
});
newHistory.push({ type: "info", text: "" });
newHistory.push({ type: "info", text: 'Usage: output <program_name> (e.g., "output fabcar")' });

// Remove processing indicator and add results
setHistory(prev => prev.slice(0, -1));
await addHistoryWithDelay(newHistory, 100);
} else {
// Show processing indicator for specific program
setHistory(prev => [...prev, { type: "processing", text: `Executing ${arg} chaincode...` }]);
await new Promise(resolve => setTimeout(resolve, 1500));

const targetExp = experiments[0].find((e) => e.command === arg);
if (targetExp && targetExp.outputs) {
newHistory = [
{ type: "info", text: `Sample outputs for ${targetExp.title}:` },
{ type: "info", text: "=".repeat(60) },
];

// Remove processing indicator
setHistory(prev => prev.slice(0, -1));
await addHistoryWithDelay(newHistory, 200);

// Add outputs with realistic delays
const outputEntries = Object.entries(targetExp.outputs);
for (let i = 0; i < outputEntries.length; i++) {
const [key, output] = outputEntries[i];

await new Promise(resolve => setTimeout(resolve, 800));
setHistory(prev => [...prev, {
type: "info",
text: `\n--- ${key.replace(/_/g, " ").toUpperCase()} ---`,
}]);

await new Promise(resolve => setTimeout(resolve, 600));
setHistory(prev => [...prev, {
type: "output",
text: output,
}]);
}
} else {
setHistory(prev => prev.slice(0, -1));
newHistory = [
{ type: "error", text: `Error: No sample outputs available for '${arg}'. Type 'output' to see available programs.` }
];
await addHistoryWithDelay(newHistory, 400);
}
}
break;

case "clear":
await new Promise(resolve => setTimeout(resolve, 100));
setHistory([]);
setCurrentView(null);
break;

case "fullscreen":
toggleFullscreen();
newHistory = [
{ type: "info", text: isFullscreen ? "Exiting fullscreen mode..." : "Entering fullscreen mode..." }
];
await addHistoryWithDelay(newHistory, 200);
break;

default:
newHistory = [
{ type: "error", text: `Error: Command '${trimmedCommand}' not recognized. Type 'help' to see available commands.` }
];
await addHistoryWithDelay(newHistory, 300);
break;
}

setCommand("");
setIsProcessing(false);
}
};

// Render the experiment content
const renderContent = (content) => {
return Object.entries(content).map(([key, value]) => (
<div key={key} className="content-section">
<h3 className="section-title">{key.replace(/_/g, " ")}:</h3>
<pre className="section-content">{value.trim()}</pre>
</div>
));
};

return (
<div
className={`terminal-container ${isFullscreen ? "fullscreen" : ""}`}
onClick={handleTerminalClick}
>
{!isFullscreen && (
<div className="fullscreen-hint">
Press F11 or type "fullscreen" for fullscreen mode
</div>
)}
<div className="terminal-output" ref={terminalRef}>
{history.map((item, index) => (
<div key={index} className="terminal-line">
{item.type === "command" && (
<span className="command-line">
<span className="user-name">user</span>
<span className="at-symbol">@labmanual</span>
<span className="path">:~</span>
<span className="prompt">$ </span>
{item.text.replace("user@labmanual:~$ ", "")}
</span>
)}
{item.type === "info" && (
<span className="info-text">{item.text}</span>
)}
{item.type === "error" && (
<span className="error-text">{item.text}</span>
)}
{item.type === "output" && (
<pre className="output-text">{item.text}</pre>
)}
{item.type === "processing" && (
<span className="processing-text">
<span className="loading-dots">{item.text}</span>
</span>
)}
</div>
))}
{currentView && (
<div className="experiment-content">{renderContent(currentView)}</div>
)}
</div>

<div className="input-line">
<span className="user-name">user</span>
<span className="at-symbol">@labmanual</span>
<span className="path">:~</span>
<span className="prompt">$ </span>
<input
ref={inputRef}
type="text"
className="terminal-input"
value={command}
onChange={(e) => setCommand(e.target.value)}
onKeyDown={handleCommand}
disabled={isProcessing}
autoFocus
/>
{isProcessing && <span className="cursor-blink">█</span>}
</div>
</div>
);
}
