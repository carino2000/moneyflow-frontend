import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginCheck } from "../util/DatabaseUtil";
import { useAccount, useToken } from "../stores/account-store";

function LoginPage() {
  const loginForm = useRef();

  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const { setAccount } = useAccount();
  const { setToken } = useToken();

  function loginCheckHandle(evt) {
    evt.preventDefault();
    const email = loginForm.current.email.value;
    const pw = loginForm.current.pw.value;
    loginCheck(email, pw).then(function (obj) {
      if (obj.success) {
        //로그인 성공
        setLoginError("");
        setAccount({
          id: obj.data.id,
          nickname: obj.data.nickname,
          email: obj.data.email,
        });
        setToken(obj.token);
        navigate("/flow/write");
      } else {
        //로그인 실패
        setLoginError("로그인 정보가 일치하지 않습니다.");
        loginForm.current.pw.value = "";
      }
    });
  }

  return (
    <div className="p-2">
      <div className="space-x-2 text-right text-sm">
        회원이 아니신가요?
        <Link to="/signup" className="underline underline-offset-2">
          회원가입 ➡
        </Link>
      </div>

      <div className="mt-3 space-y-4">
        <h2 className="text-xl text-center font-semibold">머니플로우 로그인</h2>

        <form onSubmit={loginCheckHandle} className="space-y-2" ref={loginForm}>
          {/* 이메일 */}
          <label className={"block "}>
            이메일*
            <input
              name="email"
              type="text"
              className="pb-2 w-full focus:outline-none border-b "
              placeholder="Email"
            />
          </label>

          {/* 비밀번호 */}
          <label className={"block "}>
            비밀번호*
            <input
              name="pw"
              type="password"
              className="pb-2 w-full focus:outline-none border-b "
              placeholder="Password"
            />
          </label>

          <p className="text-red-600 font-bold text-center">
            <small className="flex items-center my-3">{loginError}</small>
          </p>

          {/* 버튼 */}
          <button className="bg-black/80 text-white p-2 w-full rounded-sm ">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
