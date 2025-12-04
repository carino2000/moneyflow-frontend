import { useEffect, useState } from "react";
import { useAccount, useToken } from "../stores/account-store";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { addBulkExpense, addExpense, selectExpenseByPeriod } from "../util/DatabaseUtil";

function FlowWritePage() {
  const account = useAccount((s) => s.account);
  const token = useToken((t) => t.token);
  const navigate = useNavigate();

  // 오늘 날짜 (YYYY-MM-DD)
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const category = [
    "미분류",
    "식비",
    "주거/통신",
    "생활용품",
    "의복/미용",
    "건강/문화",
    "교육/육아",
    "교통/차량",
    "경조사/회비",
    "세금/이자",
    "용돈/기타",
    "저축/보험",
    "카드대금",
  ];

  function createDefaultObj() {
    return {
      idx: 0,
      usedAt: today,
      description: "",
      cash: 0,
      card: 0,
      category: category[0],
      tag: "",
    };
  }

  const [payment, setPayment] = useState([createDefaultObj()]);
  const [startDate, setStartDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );

  function addInputHandle() {
    setPayment((old) => [...old, createDefaultObj()]);
  }

  //1건 넘기기!!
  function expenseSubmitHandle(evt) {
    evt.preventDefault();
    const data = {
      ...payment[payment.length - 1],
      accountId: account.id,
      token: token,
    };
    addExpense(data).then((obj) => {
      obj.success
        ? window.alert("정상 처리되었습니다.")
        : window.alert("오류!");
      window.location.reload();
    });
  }

  function expenseBulkSubmitHandle(evt) {
    evt.preventDefault();
    const data = {
      token: token,
      accountId: account.id,
      payment: [...payment],
    };
    addBulkExpense(data).then((obj) => {
      obj.success
        ? window.alert("전체 저장이 정상 처리되었습니다.")
        : window.alert("전체 저장 오류!");
      window.location.reload();
    });
  }

  function movePrevDay() {
    setStartDate(function (old) {
      return dayjs(old).subtract(1, "month").format("YYYY-MM-DD");
    });
    setEndDate(function (old) {
      return dayjs(old).subtract(1, "month").format("YYYY-MM-DD");
    });
  }
  function moveNextDay() {
    setStartDate(function (old) {
      return dayjs(old).add(1, "month").format("YYYY-MM-DD");
    });
    setEndDate(function (old) {
      return dayjs(old).add(1, "month").format("YYYY-MM-DD");
    });
  }

  // 로그인 체크
  useEffect(() => {
    if (!account) {
      navigate("/login");
    }
  }, [account]);

  // 기간 조회
  useEffect(() => {
    if (startDate && endDate && account && token) {
      selectExpenseByPeriod(account.id, startDate, endDate, token).then(
        (res) => {
          if (res.success && res.data.length > 0) {
            const list = res.data.map((item) => ({
              idx: item.idx,
              usedAt: item.usedAt,
              description: item.description,
              cash: item.cash,
              card: item.card,
              category: item.category,
              tag: item.tag,
            }));
            setPayment([...list, createDefaultObj()]);
          } else if (token === null) {
            setPayment([createDefaultObj()]);
            window.alert("서버에서 정보를 가져오지 못했습니다.");
          } else {
            setPayment([createDefaultObj()]);
          }
        }
      );
    }
  }, [startDate, endDate, account]);

  return (
    <>
      {account && (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* 상단 헤더 */}
          <header className="sticky top-0 bg-white p-3 border-b flex justify-between items-center z-10">
            <h1 className="text-xl font-semibold">머니플로우</h1>
            <div className="text-sm text-gray-600">
              {account.nickname} ({account.email})
            </div>
          </header>

          {/* 조회 기간 */}
          <section className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-center gap-3">
            <button
              onClick={movePrevDay}
              type="button"
              className="px-2 py-1 rounded bg-gray-100 shadow hover:bg-gray-200"
            >
              &lt;
            </button>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>~</span>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              onClick={moveNextDay}
              type="button"
              className="px-2 py-1 rounded bg-gray-100 shadow hover:bg-gray-200"
            >
              &gt;
            </button>
          </section>

          {/* 그래프 모드 */}
          <section className="flex justify-end items-center">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              그래프 보기
            </label>
          </section>

          {/* 메인 테이블 */}
          <form
            onSubmit={expenseSubmitHandle}
            className="bg-white shadow-sm rounded-lg p-4"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="p-2 text-center">
                    <input type="checkbox" />
                  </th>
                  <th className="p-2">날짜</th>
                  <th className="p-2">사용내역</th>
                  <th className="p-2">현금</th>
                  <th className="p-2">카드</th>
                  <th className="p-2">분류</th>
                  <th className="p-2">태그</th>
                </tr>
              </thead>

              <tbody>
                {payment.map((one, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="p-2">
                      <input
                        type="date"
                        className="border px-2 py-1 rounded w-full"
                        value={one.usedAt || ""}
                        onChange={(e) => {
                          const newPayment = [...payment];
                          newPayment[index].usedAt = e.target.value;
                          setPayment(newPayment);
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border px-2 py-1 rounded w-full"
                        value={one.description || ""}
                        onChange={(e) => {
                          const newPayment = [...payment];
                          newPayment[index].description = e.target.value;
                          setPayment(newPayment);
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        className="border px-2 py-1 rounded w-full text-left"
                        value={one.cash}
                        onChange={(e) => {
                          const newPayment = [...payment];
                          newPayment[index].cash = e.target.value;
                          setPayment(newPayment);
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        className="border px-2 py-1 rounded w-full text-left"
                        value={one.card}
                        onChange={(e) => {
                          const newPayment = [...payment];
                          newPayment[index].card = e.target.value;
                          setPayment(newPayment);
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        className="border px-2 py-1 rounded w-115%"
                        value={one.category || category[0]}
                        onChange={(e) => {
                          const newPayment = [...payment];
                          newPayment[index].category = e.target.value;
                          setPayment(newPayment);
                        }}
                      >
                        {category.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border px-2 py-1 rounded w-full"
                        value={one.tag || ""}
                        onChange={(e) => {
                          const newPayment = [...payment];
                          newPayment[index].tag = e.target.value;
                          setPayment(newPayment);
                        }}
                      />
                    </td>
                  </tr>
                ))}

                {/* 새 입력 줄 */}
                <tr
                  onClick={addInputHandle}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-2 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      className="border px-2 py-1 rounded w-full opacity-50"
                      readOnly
                    />
                  </td>
                  <td className="p-2"></td>
                  <td className="p-2"></td>
                  <td className="p-2"></td>
                  <td className="p-2"></td>
                  <td className="p-2"></td>
                </tr>
              </tbody>
            </table>
            <button
              className="m-3 p-1 bg-white shadow rounded hover:bg-gray-100"
              disabled={
                payment[payment.length - 1].description === "" ||
                (payment[payment.length - 1].card === 0 &&
                  payment[payment.length - 1].cash === 0)
              }
            >
              저장하기
            </button>
            <button
              onClick={expenseBulkSubmitHandle}
              type="button"
              className="m-3 p-1 bg-white shadow rounded hover:bg-gray-100"
            >
              전체 저장하기
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default FlowWritePage;
