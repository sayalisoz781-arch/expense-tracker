// =============================
// Expense Tracker Pro
// =============================


const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");


const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const totalTransactions = document.getElementById("totalTransactions");


const addBtn = document.getElementById("addBtn");
const transactionList = document.getElementById("transactionList");

const search = document.getElementById("search");
const monthFilter = document.getElementById("monthFilter");


let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];


let editId = null;



addBtn.addEventListener("click",addTransaction);

search.addEventListener("keyup",searchTransaction);

monthFilter.addEventListener("change",filterMonth);



updateUI();





// =============================
// Add Transaction
// =============================


function addTransaction(){


    if(
        text.value.trim()==="" ||
        amount.value==="" ||
        date.value===""

    ){

        alert("Please fill all fields");

        return;

    }



    const data={

        id:editId || Date.now(),

        text:text.value,

        amount:Number(amount.value),

        type:type.value,

        category:category.value,

        date:date.value

    };



    if(editId){

        const index =
        transactions.findIndex(t=>t.id===editId);


        transactions[index]=data;

        editId=null;

        addBtn.innerHTML="Add Transaction";

    }

    else{

        transactions.push(data);

    }



    saveData();

    clearInputs();

    updateUI();


}







// =============================
// Update UI
// =============================


function updateUI(){


    transactionList.innerHTML="";


    let totalIncome=0;

    let totalExpense=0;



    if(transactions.length===0){

        transactionList.innerHTML=
        `<h3 style="color:white;text-align:center">
        No Transactions Added
        </h3>`;

    }



    transactions.forEach(transaction=>{



        if(transaction.type==="income"){

            totalIncome += transaction.amount;

        }

        else{

            totalExpense += transaction.amount;

        }




        const li=document.createElement("li");


        li.className="transaction";



        li.innerHTML=`

        <div>

            <h3>${transaction.text}</h3>

            <small>${transaction.category}</small>

            <br>

            <small>${transaction.date}</small>

        </div>



        <div>


            <strong class="${
                transaction.type==="income"
                ?"amount-income"
                :"amount-expense"

            }">


            ${
                transaction.type==="income"
                ? "+"
                : "-"
            }

            ₹${transaction.amount}


            </strong>


            <br><br>


            <button class="edit-btn"
            onclick="editTransaction(${transaction.id})">

            ✏️

            </button>


            <button class="delete-btn"
            onclick="deleteTransaction(${transaction.id})">

            🗑️

            </button>



        </div>

        `;


        transactionList.appendChild(li);


    });



    income.innerHTML="₹"+totalIncome.toFixed(2);

    expense.innerHTML="₹"+totalExpense.toFixed(2);

    balance.innerHTML="₹"+

    (totalIncome-totalExpense).toFixed(2);



    totalTransactions.innerHTML=
    transactions.length;



    updateChart();

}








// =============================
// Edit
// =============================


function editTransaction(id){


    const transaction =
    transactions.find(t=>t.id===id);



    text.value=transaction.text;

    amount.value=transaction.amount;

    type.value=transaction.type;

    category.value=transaction.category;

    date.value=transaction.date;



    editId=id;


    addBtn.innerHTML="Update Transaction";


}








// =============================
// Delete
// =============================


function deleteTransaction(id){


    if(confirm("Delete this transaction?")){


        transactions =
        transactions.filter(t=>t.id!==id);


        saveData();

        updateUI();


    }


}








// =============================
// Search
// =============================


function searchTransaction(){


    let value=
    search.value.toLowerCase();



    document.querySelectorAll(".transaction")

    .forEach(item=>{


        item.style.display =

        item.innerText
        .toLowerCase()
        .includes(value)

        ?

        "flex"

        :

        "none";


    });


}








// =============================
// Month Filter
// =============================


function filterMonth(){


    let month =
    monthFilter.value;



    document.querySelectorAll(".transaction")

    .forEach((item,index)=>{


        if(

        transactions[index]
        .date
        .startsWith(month)

        || month===""

        ){

            item.style.display="flex";

        }

        else{

            item.style.display="none";

        }


    });


}








// =============================
// Clear Inputs
// =============================


function clearInputs(){


    text.value="";

    amount.value="";

    date.value="";

    type.value="income";

    category.selectedIndex=0;


}








// =============================
// Local Storage
// =============================


function saveData(){


    localStorage.setItem(

        "transactions",

        JSON.stringify(transactions)

    );


}








// =============================
// Dark Mode
// =============================


const themeBtn =
document.getElementById("themeBtn");



themeBtn.addEventListener("click",()=>{


    document.body.classList.toggle("dark");



    themeBtn.innerHTML =

    document.body.classList.contains("dark")

    ?

    "☀️ Light Mode"

    :

    "🌙 Dark Mode";


});








// =============================
// Export CSV
// =============================


const exportBtn =
document.getElementById("exportBtn");



exportBtn.addEventListener("click",()=>{


    let csv=
    "Name,Amount,Type,Category,Date\n";



    transactions.forEach(t=>{


        csv +=

        `${t.text},${t.amount},${t.type},${t.category},${t.date}\n`;


    });



    let blob =
    new Blob([csv],
    {type:"text/csv"});


    let url =
    URL.createObjectURL(blob);



    let a =
    document.createElement("a");


    a.href=url;


    a.download="Expense_Report.csv";


    a.click();



});








// =============================
// Chart
// =============================


const ctx =
document.getElementById("expenseChart");



let chart =
new Chart(ctx,{


    type:"doughnut",


    data:{


        labels:[

            "Income",

            "Expense"

        ],


        datasets:[{

            data:[0,0]

        }]


    }


});





function updateChart(){


    let inc=0;

    let exp=0;



    transactions.forEach(t=>{


        if(t.type==="income")

            inc+=t.amount;

        else

            exp+=t.amount;


    });



    chart.data.datasets[0].data=[inc,exp];


    chart.update();


}