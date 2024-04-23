#! /usr/bin/env node
import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
class Bank {
    customers = [];
    accounts = [];
    initialDataDisplayed = false;
    addCustomer(customer) {
        this.customers.push(customer);
    }
    addAccount(account) {
        this.accounts.push(account);
    }
    displayAllData() {
        console.table(this.customers.map((customer, index) => ({ ...customer, ...this.accounts[index] })));
    }
    displayInitialData() {
        console.log("Initial data:");
        this.displayAllData();
        console.log("----------------------");
        this.initialDataDisplayed = true;
    }
    displayIndividualCustomer(accountNo) {
        const index = this.customers.findIndex(customer => customer.Account_No === accountNo);
        if (index !== -1) {
            console.table([{ ...this.customers[index], ...this.accounts[index] }]);
        }
        else {
            console.log("Customer not found.");
        }
    }
    modifyCustomerData() {
        for (let i = 0; i < this.customers.length; i++) {
            // Modify customer name
            this.customers[i].First_Name = faker.person.firstName("male");
            this.customers[i].Last_Name = faker.person.lastName();
            // Modify account balance
            this.accounts[i].Balance = Math.floor(Math.random() * 5000) + 1000; // Random balance between 1000 and 6000
        }
    }
    withdraw(accountNo, amount) {
        const index = this.accounts.findIndex(account => account.Account_No === accountNo);
        if (index !== -1) {
            if (this.accounts[index].Balance >= amount) {
                this.accounts[index].Balance -= amount;
                console.log(`Withdrawal of ${amount} successful. Updated balance: ${this.accounts[index].Balance}`);
            }
            else {
                console.log("Insufficient balance.");
            }
        }
        else {
            console.log("Account not found.");
        }
    }
    deposit(accountNo, amount) {
        const index = this.accounts.findIndex(account => account.Account_No === accountNo);
        if (index !== -1) {
            this.accounts[index].Balance += amount;
            console.log(`Deposit of ${amount} successful. Updated balance: ${this.accounts[index].Balance}`);
        }
        else {
            console.log("Account not found.");
        }
    }
}
const myBank = new Bank();
// Interaction loop
(async () => {
    while (true) {
        const answer = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Enter your choice:",
            choices: ["View All Customers", "View Individual Customer", "Withdraw", "Deposit", "Exit"],
        });
        if (answer.select === "Exit") {
            break;
        }
        switch (answer.select) {
            case "View All Customers":
                if (!myBank.initialDataDisplayed) {
                    // Generate customers and accounts
                    for (let i = 1; i <= 10; i++) {
                        const firstName = faker.person.firstName("male");
                        const lastName = faker.person.lastName();
                        const mobNumber = faker.phone.number();
                        const gender = faker.person.sexType();
                        const age = Math.floor(Math.random() * (65 - 20 + 1) + 20);
                        const newCustomer = {
                            First_Name: firstName,
                            Last_Name: lastName,
                            Age: age,
                            Gender: gender,
                            Account_No: 1000 + i,
                            Mob_Number: mobNumber,
                        };
                        const newAccount = { Account_No: newCustomer.Account_No, Balance: Math.floor(Math.random() * 5000) + 1000 };
                        myBank.addCustomer(newCustomer);
                        myBank.addAccount(newAccount);
                    }
                    // Modify customer data (names and balances)
                    myBank.modifyCustomerData();
                    // Display initial data
                    myBank.displayInitialData();
                }
                else {
                    myBank.displayAllData();
                }
                break;
            case "View Individual Customer":
                const { accountNo } = await inquirer.prompt({
                    type: "number",
                    name: "accountNo",
                    message: "Enter account number to view:",
                });
                myBank.displayIndividualCustomer(accountNo);
                break;
            case "Withdraw":
                const { withdrawAccountNo, withdrawAmount } = await inquirer.prompt([
                    {
                        type: "number",
                        name: "withdrawAccountNo",
                        message: "Enter account number to withdraw from:",
                    },
                    {
                        type: "number",
                        name: "withdrawAmount",
                        message: "Enter amount to withdraw:",
                    }
                ]);
                myBank.withdraw(withdrawAccountNo, withdrawAmount);
                break;
            case "Deposit":
                const { depositAccountNo, depositAmount } = await inquirer.prompt([
                    {
                        type: "number",
                        name: "depositAccountNo",
                        message: "Enter account number to deposit to:",
                    },
                    {
                        type: "number",
                        name: "depositAmount",
                        message: "Enter amount to deposit:",
                    }
                ]);
                myBank.deposit(depositAccountNo, depositAmount);
                break;
            default:
                console.log("Invalid choice.");
        }
    }
})();
