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
  const formData = new FormData();
  formData.append("email", email);
  return fetch(serverAddr + "/validate/code/send", {
    method: "post",
    body: formData,
  }).then(function (response) {
    return response.json();
  });
}

function insertAccount({ email, pw, nickname }) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("pw", pw);
  formData.append("nickname", nickname);
  return fetch(serverAddr + "/account/sign-in", {
    method: "post",
    body: formData,
  }).then(function (response) {
    return response.json();
  });
}

function loginCheck(email, pw) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("pw", pw);
  return fetch(serverAddr + "/account/log-in", {
    method: "post",
    body: formData,
  }).then(function (response) {
    return response.json();
  });
}

function addBulkExpense({ accountId, token, payment }) {
  const formData = new FormData();
  formData.append("accountId", accountId);
  //formData.append("items", payment);
  for (let i = 0; i < payment.length; i++) {
    const index = `items[${i}]`;
    formData.append(`${index}.idx`, payment[i].idx);
    formData.append(`${index}.usedAt`, payment[i].usedAt);
    formData.append(`${index}.description`, payment[i].description);
    formData.append(`${index}.cash`, payment[i].cash);
    formData.append(`${index}.card`, payment[i].card);
    formData.append(`${index}.category`, payment[i].category);
    formData.append(`${index}.tag`, payment[i].tag);
  }
  return fetch(serverAddr + "/expense/insert/bulk", {
    method: "post",
    body: formData,
    headers: {
      Token: token,
    },
  }).then((response) => response.json());
}

function addExpense({
  token,
  accountId,
  usedAt,
  description,
  cash,
  card,
  category,
  tag,
}) {
  const formData = new FormData();
  formData.append("accountId", accountId);
  formData.append("usedAt", usedAt);
  formData.append("description", description);
  formData.append("cash", cash);
  formData.append("card", card);
  formData.append("category", category);
  formData.append("tag", tag);
  return fetch(serverAddr + "/expense/insert/one", {
    method: "post",
    body: formData,
    headers: {
      Token: token,
    },
  }).then((response) => response.json());
}

function selectExpenseByPeriod(accountId, startDate, endDate, token) {
  const params = `accountId=${accountId}&startDate=${startDate}&endDate=${endDate}`;
  return fetch(serverAddr + "/expense/select/period?" + params, {
    method: "get",
    headers: {
      Token: token,
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
