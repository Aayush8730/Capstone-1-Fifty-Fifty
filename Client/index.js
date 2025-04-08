
const signupButtonNavBar = document.querySelector(".signup");
const loginPage = document.querySelector(".login-container");
const orSignUp = document.querySelector(".or-sign-up");
const mainPage = document.querySelector(".main-container");
const signUpPage = document.querySelector(".signin-container");
const orLogin = document.querySelector(".or-login");
const loginButtonLoginPage = document.querySelector(".login-button");
const signUpButtonSignUpPage = document.querySelector(".signin-button");
const aboutPage = document.querySelector(".about-container");
const aboutButton = document.querySelector(".about");
const logoHomeButton = document.querySelector(".whole-logo");
const wrapperDiv = document.querySelector(".wrapper-div");
const userNavbar = document.querySelector(".user");
const logoutButton = document.querySelector(".logout");
const dashboardBoard = document.querySelector(".dashboard-container");
const container = document.querySelector(".container");
const expensesList = document.getElementById("expenses-list");



signupButtonNavBar.addEventListener("click" ,()=>{
   signUpPage.style.display = "block";
   aboutPage.style.display = "none";
   wrapperDiv.style.display = "none";
   dashboardBoard.style.display ="none";

});

orSignUp.addEventListener("click" , ()=>{
   loginPage.style.display = "none";
   signUpPage.style.display = "block";
})

orLogin.addEventListener("click" , ()=>{
  signUpPage.style.display = "none";
  loginPage.style.display = "block";
})

function updateUIAfterLogin(name){
    mainPage.style.filter = "blur(0px)";
    loginPage.style.display = "none";
    signupButtonNavBar.style.display = "none";
    wrapperDiv.style.display = "flex";
    userNavbar.textContent =  `👤  ${name}`;
    signupButtonNavBar.style.display ="none";
    logoutButton.style.display = "block";
}

aboutButton.addEventListener("click",()=>{
   aboutPage.style.display = "block";
   wrapperDiv.style.display = "none";
   signUpPage.style.display ="none";
   loginPage.style.display= "none";
})

logoHomeButton.addEventListener("click",()=>{
  aboutPage.style.display = "none";
  wrapperDiv.style.display = "flex";
})

function updateUIAfterSignup(){
  signUpPage.style.display = "none";
  loginPage.style.display = "block";
}


const rotatingText = document.getElementById('sss');
const phrases = ['Share.', 'Split.', 'Smile.'];
let index = 0;
let i  = 0;
setInterval(() => {
  rotatingText.textContent = phrases[index];
  index = (index + 1) % phrases.length;
}, 5000);



//login and signup
document.getElementById("signin-press").addEventListener("click", async () => {
  const name = document.getElementById("username-signup").value.trim();
  const email = document.getElementById("email-signup").value.trim();
  const password = document.getElementById("password-signup").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showPopup("Please enter a valid email address.",2000);
    return;
  }

  if (password.length < 8) {
    showPopup("Password should be at least 8 characters long.",2000);
    return;
  }

  const userData = { name, email, password };

  try {
    const response = await fetch('http://localhost:8090/users/signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      alert("Signup successful!");
      updateUIAfterSignup();
    } else {
      const error = await response.json();
      alert("Signup failed: " + error.message);
    }

  } catch (error) {
    console.error("Error during signup:", error);
    alert("Signup error!" + error.message);
  }
});


document.getElementById("login-press").addEventListener("click", async () => {
  const name = document.getElementById("username-input").value.trim();
  const password = document.getElementById("password-input").value.trim();

  if (!name || !password) {
    showPopup("Please enter both username and password.",2000);
    return;
  }

  if (password.length < 8) {
    showPopup("Password should be at least 8 characters long.",2000);
    return;
  }

  try {
    const response = await fetch("http://localhost:8090/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", name);
      calculateBalances();
      showPopup("Login successful!", 1500);
      setTimeout(reloadDOM, 500);
      updateUIAfterLogin(name);
    } else {
      const error = await response.json();
      alert("Login failed: Enter valid credentials.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred during login.");
  }
});



window.addEventListener("load", () => {
  const storedUsername = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  if (storedUsername && token) {
      updateUIAfterLogin(storedUsername);
  } else {
      logoutButton.style.display = "none";
  }
});


logoutButton.addEventListener("click", () => {
  const confirmLogout = confirm("Are you sure you want to logout?");

  if (!confirmLogout) {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("name");

  userNavbar.textContent = "User"; 
  signupButtonNavBar.style.display = "block";
  logoutButton.style.display = "none";
  aboutButton.style.display ="block";
  document.querySelector(".dashboard-container").style.display = "none";
  document.querySelector(".wrapper-div").style.display = "flex";
  showPopup("Logged out successfully!");
});



//show the popup

function showPopup(message,time) {
  const popup = document.getElementById("popup-message");
  popup.textContent = message;
  popup.style.display = "block";

  setTimeout(() => {
      popup.style.display = "none";
  }, time);
}

document.getElementById("getStartedBtn").addEventListener("click", () => {
  const token = localStorage.getItem("token");

  if (token) {
      document.querySelector(".wrapper-div").style.display = "none";
      document.querySelector(".dashboard-container").style.display = "flex";
      aboutButton.style.display = "none";
      fetchUserGroups();
  } else {
      showPopup("Please log in or sign up before getting started!", 3000);
  }
});

window.addEventListener("load", () => {
  const storedUsername = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  if (!token) {
      document.querySelector(".dashboard-container").style.display = "none";
  } else {
      updateUIAfterLogin(storedUsername);
  }
});


async function fetchUserGroups() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("Please try to sign in again!!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8090/groups/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    

    if (!response.ok) {
      throw new Error("Failed to fetch groups");
    }

    const groups = await response.json(); 
    const groupsList = document.getElementById("groupsList");
    groupsList.innerHTML = ""; 

    groups.forEach((group) => {
      const li = document.createElement("li");
      li.setAttribute("data-id", group.groupId); 
      li.innerHTML = `
        <span class="material-symbols-outlined">
          groups_2
        </span>
        <div class="grp-name">${group.groupName}</div>
      `;
      groupsList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
}




let createdGroupId = null;

async function createGroup() {
  const groupName = document.getElementById("grp-name-input").value;
  const description = document.getElementById("desc-input").value;
  const userId = localStorage.getItem("userId");

  if (!groupName || !description) {
      showPopup("Enter group name and description!", 3000);
      return;
  }

  const requestData = {
      groupName,
      description,
      createdBy: { userId: Number(userId) }
  };

  try {
      const response = await fetch("http://localhost:8090/groups", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(requestData)
      });

      const responseData = await response.json();

      if (response.ok) {
          createdGroupId = responseData.groupId; 
          showPopup("Group created successfully!", 2000);
          document.querySelector(".main-content").style.display="none";
          container.style.display = "flex";

          await updateSelectedUsersIndividually(createdGroupId);


          await fetchUserGroups();
      } else {
          showPopup(responseData.message, 3000);
      }
  } catch (error) {
      console.error("Error creating the group:", error);
      showPopup("Error creating the group!", 3000);
  }
}


document.querySelector(".create").addEventListener("click", createGroup);


async function fetchAllUsers() {
  try {
      const response = await fetch("http://localhost:8090/users", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data); 
      storeUserMap(data);


      if (!Array.isArray(data)) {
          console.error("Expected an array but got:", data);
          return;
      }

      populateUserDropdown(data);
  } catch (error) {
      console.error("Error fetching users:", error);
  }
}

async function populateUserDropdown(users) {
  const select = document.getElementById("member-select");

  select.innerHTML = "";

  users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.userId; 
      option.textContent = user.name;
      select.appendChild(option);
  });
}

fetchAllUsers();


const currentUser = {
    userId: localStorage.getItem("userId"),
    name: localStorage.getItem("name")
};

const selectedUsers = [currentUser];

function storeSelectedUsers() {
  const select = document.getElementById("member-select");

  selectedUsers.length = 0; 
  selectedUsers.push({
      userId: localStorage.getItem("userId"),
      name: localStorage.getItem("name")
  });

  Array.from(select.selectedOptions).forEach(option => {
      if (option.value !== localStorage.getItem("userId")) { 
          selectedUsers.push({
              userId: option.value,
              name: option.textContent
          });
      }
  });

  console.log("Selected Users:", selectedUsers); 
}


document.getElementById("member-select").addEventListener("change", storeSelectedUsers);

async function updateSelectedUsersIndividually(groupId) {
  const select = document.getElementById("member-select");


  const selectedUserIds = Array.from(select.selectedOptions).map(option => option.value);


  const currentUserId = localStorage.getItem("userId");

  //double check here
  if (!selectedUserIds.includes(currentUserId)) {
      selectedUserIds.push(currentUserId);
  }

  if (selectedUserIds.length === 0) {
      console.warn("No users selected.");
      return;
  }

  for (const userId of selectedUserIds) {
      try {
          const response = await fetch(`http://localhost:8090/group-members/${groupId}/${userId}`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
          });

          const data = await response.json();

          if (response.ok) {

          } else {
              showPopup(`Failed to add user ${userId}:`, 2000);
          }
      } catch (error) {
          console.error(`Error adding user ${userId}:`, error);
      }
  }
}

document.querySelector(".create-group-btn").addEventListener("click",()=>{
    document.querySelector(".main-content").style.display = "flex";
    container.style.display = "none";
})

function toggleDropdown() {
  const dropdown = document.getElementById("member-select");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}
  


document.getElementById("groupsList").addEventListener("click", async (e) => {
  const groupItem = e.target.closest("li");

  if (groupItem) {
      const groupId = groupItem.getAttribute("data-id");
      const groupName = groupItem.textContent; 
      localStorage.setItem("currentGroupName",groupName);

      if (groupId) {
          localStorage.setItem("currentGroupId", groupId);

          document.querySelectorAll("#groupsList li").forEach((item) =>
              item.classList.remove("selected-group")
          );
          groupItem.classList.add("selected-group");

          try {
              const membersData = await fetchGroupMembers(groupId);
              await loadGroupDetails(membersData, groupId);
              populateUsersInPaidByDropdown(membersData);
              document.querySelector(".container").style.display = "flex";
              document.querySelector(".main-content").style.display = "none";

              fetchGroupBalances(groupId, groupName);

          } catch (error) {
              console.error("Error loading group details:", error);
          }
      }
  }
});

  

  async function fetchGroupMembers(groupId) {
    const response = await fetch(`http://localhost:8090/group-members/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!response.ok) throw new Error("Failed to fetch group members.");
    return await response.json();
  }
  
  // Load group details
  async function loadGroupDetails(membersData, groupId) {
    const expensesResponse = await fetch(`http://localhost:8090/expenses/group/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!expensesResponse.ok) throw new Error("Failed to fetch group expenses.");
    const expensesData = await expensesResponse.json();
  
    const groupHeader = document.querySelector(".group-header");
    groupHeader.querySelector("h2").textContent = membersData[0]?.group.groupName || "Group Name";
    groupHeader.querySelector("p").textContent = `Members: ${membersData.map((m) => m.user.name).join(", ")}`;
  
    const expensesList = document.getElementById("expenses-list");
    expensesList.innerHTML = expensesData
      .map(
        (expense) =>
          `<li>${expense.description} - ₹${expense.amount.toFixed(2)} (Paid by ${expense.paidBy.name})</li>`
      )
      .join("");
  }
  

  function populateUsersInPaidByDropdown(members) {
    const memberSelect = document.getElementById("member-selects");
    memberSelect.innerHTML = "";


    members.forEach((member) => {
      const option = document.createElement("option");
      option.value = member.user.userId;
      option.textContent = member.user.name;
      memberSelect.appendChild(option);
    });
  
    document.getElementById("split-type").addEventListener("change", (event) => {
      const percentageSplitsDiv = document.getElementById("percentage-splits");
      if (event.target.value === "percentage") {
        createPercentageInputs(members);
        percentageSplitsDiv.style.display = "block";
      } else {
        percentageSplitsDiv.style.display = "none";
      }
    });
  }
  
  // Create percentage input fields
  function createPercentageInputs(members) {
    const percentageSplitsDiv = document.getElementById("percentage-splits");
    percentageSplitsDiv.innerHTML = "";
  
    members.forEach((member) => {
      const userDiv = document.createElement("div");
      userDiv.className = "percentage-row";
  
      const nameLabel = document.createElement("span");
      nameLabel.textContent = member.user.name;
      nameLabel.className = "member-label";
  
      const input = document.createElement("input");
      input.type = "number";
      input.value = "0";
      input.min = "0";
      input.max = "100";
      input.step = "1";
      input.dataset.userId = member.user.userId;
      input.className = "percentage-input";
      input.addEventListener("input", validateTotalPercentage);
  
      userDiv.appendChild(nameLabel);
      userDiv.appendChild(input);
      percentageSplitsDiv.appendChild(userDiv);
    });
  
    const totalValidation = document.createElement("p");
    totalValidation.id = "total-percentage-error";
    totalValidation.style.color = "red";
    percentageSplitsDiv.appendChild(totalValidation);
  }
  
  // Validate total percentage
  function validateTotalPercentage() {
    const inputs = document.querySelectorAll(".percentage-input");
    let totalPercentage = 0;
  
    inputs.forEach((input) => {
      const value = parseFloat(input.value);
      if (!isNaN(value)) totalPercentage += value;
    });
  
    const errorMessage = document.getElementById("total-percentage-error");
    errorMessage.textContent = totalPercentage !== 100 ? "Total percentage must equal 100%" : "";
  }

let balances = {}; 

document.getElementById("submit-expense-btn").addEventListener("click", async () => {
  const description = document.getElementById("expense-description").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const paidBy = document.getElementById("member-selects").value;
  console.log(paidBy);
  const splitType = document.getElementById("split-type").value;

  if (!description || !amount || isNaN(amount) || !paidBy) {
    showPopup("Please fill out all fields with valid data.");
    return;
  }

  const groupId = localStorage.getItem("currentGroupId");
  if (!groupId) {
    alert("No group selected.");
    return;
  }

  try {
    // Add expense
    const expenseResponse = await fetch("http://localhost:8090/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        group: { groupId: parseInt(groupId) },
        paidBy: { userId: parseInt(paidBy) },
        amount,
        description,
      }),
    });

    if (!expenseResponse.ok) throw new Error("Failed to add expense.");
    const expenseData = await expenseResponse.json();
    const expenseId = expenseData.expenseId;

    const members = Array.from(document.querySelectorAll("#member-selects option")).map(option => ({
      userId: parseInt(option.value),
      name: option.textContent,
    })).filter(member => member.userId !== parseInt(paidBy)); 

    let splits;
    if (splitType === "equal") {
      const share = (amount - (amount/(members.length+1)))/ members.length;
      splits = members.map(member => ({
        expense: { expenseId },
        user: { userId: member.userId },
        shareAmount: parseFloat(share.toFixed(2)),
        status: "PENDING",
      }));
    } else if (splitType === "percentage") {
      const inputs = document.querySelectorAll(".percentage-input");
      splits = Array.from(inputs).map(input => ({
        expense: { expenseId },
        user: { userId: parseInt(input.dataset.userId) },
        shareAmount: parseFloat((amount * parseFloat(input.value) / 100).toFixed(2)),
        status: "PENDING",
      }));
    }

    for (const split of splits) {
      const participantResponse = await fetch("http://localhost:8090/expense-participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(split),
      });

      if (!participantResponse.ok) throw new Error("Failed to add expense participant.");


      const currentUserId = parseInt(localStorage.getItem("currentUserId"));
      if (paidBy === currentUserId.toString()) {
        balances[split.user.userId] = (balances[split.user.userId] || 0) - split.shareAmount;
      } else if (split.user.userId === currentUserId) {
        balances[parseInt(paidBy)] = (balances[parseInt(paidBy)] || 0) + split.shareAmount;
      }
    }

    updateBalancesUI({});
    updateExpensesUI(description, amount,paidBy);
    await updateBalances();
    const groupName = localStorage.getItem("currentGroupName");
    await fetchGroupBalances(groupId, groupName);
    alert("Expense added and split successfully!");
    document.getElementById("expense-description").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("split-type").value = "equal";
    document.getElementById("percentage-splits").style.display = "none";
  } catch (error) {
    console.error("Error adding expense:", error);
    alert("An error occurred while adding the expense. Please try again.");
  }
});

function updateBalancesUI(balances) {
  const balanceList = document.getElementById("balance-list");

  if (!balanceList) {
      console.error("Error: Element with id 'balance-list' not found.");
      return;
  }

  balanceList.innerHTML = "";

  if (Object.keys(balances).length === 0) {
      balanceList.innerHTML = "<li>No PENDING balances.</li>";
      return;
  }

  const userMap = JSON.parse(localStorage.getItem("userMap")) || {};

  Object.entries(balances).forEach(([userId, balance]) => {
      const userName = userMap[userId] || `User ${userId}`;
      const li = document.createElement("li");
      li.textContent = balance >= 0
          ? `You owe ${userName}: ₹${balance.toFixed(2)}`
          : `${userName} owes you: ₹${(-balance).toFixed(2)}`;
      balanceList.appendChild(li);
  });
}


function updateExpensesUI(description, amount, paidBy) {
  const expensesList = document.getElementById("expenses-list");

  if (!expensesList) {
    console.error("Error: Element with id 'expenses-list' not found.");
    return;
  }

  const memberSelect = document.getElementById("member-selects");
  const selectedOption = Array.from(memberSelect.options).find(option => option.value == paidBy);
  
  const payerName = selectedOption ? selectedOption.textContent : `User ${paidBy}`;

  const li = document.createElement("li");
  li.textContent = `💰 ${description}: ₹${amount.toFixed(2)} (Paid by ${payerName})`;
  expensesList.appendChild(li);
}

async function fetchUserGroups2() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");  

  if (!userId) {
      console.error("User ID not found in localStorage");
      return [];
  }

  const response = await fetch(`http://localhost:8090/groups/user/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
  });

  return response.json();
}

async function fetchGroupExpenses(groupId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:8090/expenses/group/${groupId}`, {
      headers: { "Authorization": `Bearer ${token}` }
  });

  return response.json();
}

async function fetchExpenseParticipants(expenseId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:8090/expense-participants/expense/${expenseId}`, {
      headers: { "Authorization": `Bearer ${token}` }
  });

  return response.json();
}
async function calculateBalances() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
      console.error("User ID not found in localStorage");
      return {};
  }

  let balances = {};

  try {
      const groups = await fetchUserGroups2();

      for (const group of groups) {
          const expenses = await fetchGroupExpenses(group.groupId);

          for (const expense of expenses) {
              const payerId = expense.paidBy.userId;
              const participants = await fetchExpenseParticipants(expense.expenseId);

              for (const ep of participants) {
                  if (ep.status === "PENDING"  || ep.status === "APPROVE_SETTLE") {
                      const participantId = ep.user.userId;
                      const amountOwed = parseFloat(ep.shareAmount);

                      if (participantId !== payerId) {
                          if (participantId == userId) {
                              balances[payerId] = (balances[payerId] || 0) + amountOwed;
                          } else if (payerId == userId) {
                              balances[participantId] = (balances[participantId] || 0) - amountOwed;
                          }
                      }
                  }
              }
          }
      }

      console.log("Final Balances:", balances);
      return balances;

  } catch (error) {
      console.error("Error fetching balances:", error);
      return {};
  }
}


function storeUserMap(users) {
  let userMap = {};

  users.forEach(user => {
      userMap[user.userId] = user.name; 
  });

  localStorage.setItem("userMap", JSON.stringify(userMap));
  console.log("User Map Stored:", userMap);
}

document.addEventListener("DOMContentLoaded", updateBalances);

async function updateBalances() {
  const balances = await calculateBalances();
  updateBalancesUI(balances);
}

async function fetchGroupBalances(groupId, groupName) {
  const userId = localStorage.getItem("userId");
  if (!userId) {
      console.error("User ID not found in localStorage");
      return;
  }

  try {
      console.log(`Fetching balances for Group: ${groupName} (ID: ${groupId})`);

      const expensesList = document.getElementById("expenses-list");
      const expenses = await fetchGroupExpenses(groupId);
      let groupBalances = {};

      for (const expense of expenses) {
          const payerId = expense.paidBy.userId;
          const participants = await fetchExpenseParticipants(expense.expenseId);

          for (const ep of participants) {
              if (ep.status === "PENDING" || ep.status === "APPROVE_SETTLE") {
                  const participantId = ep.user.userId;
                  const amountOwed = parseFloat(ep.shareAmount);

                  if (participantId !== payerId) {
                      if (participantId == userId) {
                          groupBalances[payerId] = (groupBalances[payerId] || 0) + amountOwed;
                      } else if (payerId == userId) {
                          groupBalances[participantId] = (groupBalances[participantId] || 0) - amountOwed;
                      }
                  }
              }
          }
      }


      expensesList.innerHTML += "<h4>💰 Balances:</h4>";

      if (Object.keys(groupBalances).length === 0) {
          expensesList.innerHTML += "<li>✅ No Pending balances.</li>";
      } else {
          const userMap = JSON.parse(localStorage.getItem("userMap")) || {};
          Object.entries(groupBalances).forEach(([payerId, balance]) => {
              const userName = userMap[payerId] || `User ${payerId}`;
              const balanceText = balance >= 0
                  ? `You owe ${userName}: ₹${balance.toFixed(2)}`
                  : `${userName} owes you: ₹${(-balance).toFixed(2)}`;

              const balanceItem = document.createElement("li");
              balanceItem.textContent = balanceText;


              if (balance > 0) {
                  const settleButton = document.createElement("button");
                  settleButton.textContent = "Settle";
                  settleButton.classList.add("settle-button");
                  settleButton.onclick = async function () {
                    if (this.disabled) {
                        showPopup("Request already sent", 2000);
                        return;
                    }
                
                    const result = await settleBalance(payerId, userId);
                
                    if (result) {
                        this.textContent = "Request Sent";
                        this.disabled = true;
                        this.classList.add("sent-button");
                
                        await fetchGroupBalances(groupId, groupName);
                    }
                };
                

                  balanceItem.appendChild(settleButton);
              }

              expensesList.appendChild(balanceItem);
          });
      }
  } catch (error) {
      console.error("Error fetching group balances:", error);
  }
}


async function settleBalance(payerId, payeeId) {
  try {
      const response = await fetch(`http://localhost:8090/expenses/settle-request/${payerId}?payeeId=${payeeId}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });

      if (response.ok) {
          showPopup("Settlement request sent successfully", 2000);
          return true;
      } else {
          const errorData = await response.json();
          alert(`Error during settlement: ${errorData.message}`);
          return false;
      }
  } catch (error) {
      console.error("Error settling balance:", error);
      alert("An error occurred while settling the balance. Please try again.");
      return false;
  }
}


async function approveSettlement(payerId, payeeId) {
  try {
      const token = localStorage.getItem("token");
      if (!token) {
          console.error("Authorization token not found");
          return;
      }

      const url = `http://localhost:8090/expenses/approve-settlement/${payeeId}?payerId=${payerId}`;

      const response = await fetch(url, {
          method: "PUT",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
          result = await response.json();
      } else {
          result = await response.text(); 
      }

      console.log("Settlement approved successfully:", result);
      showPopup(result, 2000);

      // Update balances UI
      const balances = await calculateBalances();
      updateBalancesUI(balances);
      fetchApprovalRequests();
  } catch (error) {
      console.error("Error approving settlement:", error);
      alert("Failed to approve settlement. Please try again.");
  }
}

async function fetchApprovalRequests() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
      console.error("User ID not found in localStorage");
      return;
  }

  try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8090/expenses/approve-requests/${userId}`, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      if (!text.trim()) {
          console.warn("No approval requests found.");
          return;
      }

      let approvalRequests;
      try {
          approvalRequests = JSON.parse(text);
      } catch (error) {
          console.error("Error parsing JSON response:", error);
          return;
      }

      const approvalList = document.getElementById("approval-list");
      if (!approvalList) {
          console.error("Error: approval-list element not found in the DOM");
          return;
      }

      approvalList.innerHTML = "";

      if (approvalRequests.length === 0) {
          approvalList.innerHTML = "<li>No approval requests found.</li>";
          return;
      }

      approvalRequests.forEach((request) => {
          const approvalItem = document.createElement("li");
          approvalItem.classList.add("approval-item");

          const expenseDescription = request.expense.description;
          const amount = request.shareAmount;
          const groupName = request.expense.group.groupName;
          const payerName = request.expense.paidBy.name;
          const requesterName = request.user.name;

          approvalItem.innerHTML = `
              <p><strong>Requester:</strong> ${requesterName}</p>
              <p><strong>Group:</strong> ${groupName}</p>
              <p><strong>Expense:</strong> ${expenseDescription}</p>
              <p><strong>Amount to approve:</strong> ₹${amount}</p>
              <p><strong>Payer:</strong> ${payerName}</p>
          `;

          const approveButton = document.createElement("button");
          approveButton.textContent = "Approve";
          approveButton.classList.add("approve-button");
          approveButton.onclick = async () => {
              await approveSettlement(request.expense.paidBy.userId, request.user.userId);
              approveButton.textContent = "Approved";
              approveButton.disabled = true;
          };

          approvalItem.appendChild(approveButton);
          approvalList.appendChild(approvalItem);
      });
  } catch (error) {
      console.error("Error fetching approval requests:", error);
  }
}

function reloadDOM() {
  location.reload();
}

window.onload = function () {
  fetchApprovalRequests();
  calculateBalances();
};
