import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  nicknameCheck,
  emailCheck,
  emailCodeCheck,
  insertAccount,
} from "../util/DatabaseUtil.jsx";

function SignUpPage() {
  const [nickname, setNickname] = useState("");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeExpired, setCodeExpired] = useState();

  const [nicknameError, setNicknameError] = useState("");
  const [pwError, setPwError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");

  const navigate = useNavigate();

  // 비밀번호 검증 함수 (원하시는 규칙에 맞춰 변경 가능)
  function pwHandle(evt) {
    const value = evt.target.value;
    setPw(value);

    if (value.length < 6) {
      setPwError("비밀번호는 최소 6자 이상이어야 합니다.");
    } else {
      setPwError("");
    }
  }

  // 닉네임 중복 검사 + 값 저장
  function nicknameCheckHandle(evt) {
    const value = evt.target.value;
    setNickname(value);

    if (value === "") {
      setNicknameError("");
      return;
    }

    nicknameCheck(value).then(function (obj) {
      if (obj.nicknameDuplicate) {
        setNicknameError("이미 사용 중인 닉네임입니다.");
      } else {
        setNicknameError("");
      }
    });
  }

  // 이메일 중복 검사 + 값 저장
  function emailCheckHandle(evt) {
    const value = evt.target.value;
    setEmail(value);

    if (value === "") {
      setEmailError("");
      return;
    }

    emailCheck(value).then(function (obj) {
      if (obj.emailDuplicate) {
        setEmailError("이미 가입된 이메일 정보입니다.");
      } else {
        setEmailError("");
      }
    });
  }

  //이메일 코드 검증!!!
  function emailCodeCheckHandle(evt) {
    const currentCode = code;
    const value = evt.target.value;
    const now = new Date();

    if (currentCode !== value) {
      setCodeError("유효한 인증코드가 아닙니다.");
    } else if (codeExpired < now) {
      setCodeError("이미 만료된 코드입니다.");
    } else {
      setCodeError("");
    }
  }

  //이메일 코드 전송!!
  function emailCodeSendHandle(evt) {
    evt.preventDefault();
    emailCodeCheck(email).then(function (obj) {
      setCode(() => obj.code);
      setCodeExpired(new Date(obj.expiredAt));
    });
  }

  // 회원가입 제출
  function signUpSubmitHandle(evt) {
    evt.preventDefault();

    const data = {
      nickname: nickname,
      pw: pw,
      email: email,
    };

    insertAccount(data).then(function (obj) {
      console.log("가입 결과:", obj);
      if (!obj.success) {
        window.alert("오류! 예상치 못한 오류 발생");
      } else {
        window.alert("환영합니다");
        navigate("/login");
      }
    });
  }

  return (
    <div className="p-2">
      <div className="space-x-2 text-right text-sm">
        이미 계정을 가지고 계신가요?
        <Link to="/login" className="underline underline-offset-2">
          로그인 ➡
        </Link>
      </div>

      <div className="mt-3 space-y-4">
        <h2 className="text-xl text-center font-semibold">
          머니플로우 가입하기
        </h2>

        <form onSubmit={emailCodeSendHandle} className="space-y-2">
          {/* 이메일 */}
          <label className={"block " + (emailError && "text-red-600")}>
            이메일*
            <input
              onChange={emailCheckHandle}
              type="text"
              className={
                "pb-2 w-full focus:outline-none border-b " +
                (emailError && "border-b-red-600")
              }
              placeholder="Email"
              readOnly={code}
            />
            <small>{emailError}</small>
          </label>

          {/* 비밀번호 */}
          <label className={"block " + (pwError && "text-red-600")}>
            비밀번호*
            <input
              onChange={pwHandle}
              type="password"
              className={
                "pb-2 w-full focus:outline-none border-b " +
                (pwError && "border-b-red-600")
              }
              placeholder="Password"
              readOnly={code}
            />
            <small>{pwError}</small>
          </label>

          {/* 닉네임 */}
          <label className={"block " + (nicknameError && "text-red-600")}>
            닉네임*
            <input
              onChange={nicknameCheckHandle}
              type="text"
              className={
                "pb-2 w-full focus:outline-none border-b " +
                (nicknameError && "border-b-red-600")
              }
              placeholder="Nickname"
              readOnly={code}
            />
            <small>{nicknameError}</small>
          </label>

          {/* 버튼 */}
          <button
            className={
              "bg-black/80 text-white p-2 w-full rounded-sm " +
              (code
                ? "cursor-not-allowed opacity-80"
                : "hover:bg-black/90 cursor-pointer")
            }
            disabled={nicknameError || pwError || emailError || code}
          >
            인증코드 발송
          </button>
        </form>
        {code && (
          <form onSubmit={signUpSubmitHandle} className="space-y-2">
            <label className={"block " + (codeError && "text-red-600")}>
              인증코드*
              <input
                onChange={emailCodeCheckHandle}
                type="text"
                placeholder="Email Code"
                className={
                  "pb-2 w-full focus:outline-none border-b " +
                  (codeError && "border-b-red-600")
                }
              />
              <small>{codeError}</small>
            </label>

            <button
              className="bg-black/80 text-white p-2 w-full rounded-sm hover:bg-black/90 cursor-pointer"
              disabled={!!codeError}
            >
              계정 생성하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignUpPage;
