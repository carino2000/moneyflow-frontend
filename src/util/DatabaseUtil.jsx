const serverAddr = "http://192.168.0.17:8080";

function nicknameCheck(nickname) {
  return fetch(serverAddr + "/validate/nickname?nickname=" + nickname, {
    method: "get",
  }).then(function (response) {
    return response.json();
  });
}

function emailCheck(email) {
  return fetch(serverAddr + "/validate/email?email=" + email, {
    method: "get",
  }).then(function (response) {
    return response.json();
  });
}

function emailCodeCheck(email) {
  const data = { email };
  return fetch(serverAddr + "/validate/code/send", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
}

function insertAccount(data) {
  return fetch(serverAddr + "/account/sign-in", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
}

function loginCheck(email, pw) {
  const data = { email, pw };
  return fetch(serverAddr + "/account/log-in", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
}

function addBulkExpense(data) {
  return fetch(serverAddr + "/expense/insert/bulk", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      Token: token,
      "Content-type": "application/json",
    },
  }).then((response) => response.json());
}

function addExpense(data) {
  return fetch(serverAddr + "/expense/insert/one", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      Token: token,
      "Content-type": "application/json",
    },
  }).then((response) => response.json());
}

function selectExpenseByPeriod(accountId, startDate, endDate, token) {
  const params = `accountId=${accountId}&startDate=${startDate}&endDate=${endDate}`;
  return fetch(serverAddr + "/expense/select/period?" + params, {
    method: "get",
    headers: {
      Token: token,
      "Content-type": "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
}

export {
  nicknameCheck,
  emailCheck,
  emailCodeCheck,
  loginCheck,
  insertAccount,
  addExpense,
  addBulkExpense,
  selectExpenseByPeriod,
};
