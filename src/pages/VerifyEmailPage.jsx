import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resendOtpToVerifyEmail, verifyUserEmail } from "../redux/slices/authSlice";
import { RESEND_DELAY } from "../utils/variables";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = useSelector((state) => state.auth.user?.email) ||
    JSON.parse(localStorage.getItem("userData"))?.email;

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const [resendTimer, setResendTimer] = useState(() => {
    const expiry = localStorage.getItem("otpExpiry");
    if (expiry) {
      const remaining = Math.max(0, Math.ceil((Number(expiry) - Date.now()) / 1000));
      return remaining;
    }
    return RESEND_DELAY;
  });

  const timerRef = useRef(null);

  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);

  const getRef = (index) => {
    switch (index) {
      case 0: return ref0;
      case 1: return ref1;
      case 2: return ref2;
      case 3: return ref3;
      case 4: return ref4;
      case 5: return ref5;
      default: return ref0;
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("otpExpiry")) {
      const newExpiry = Date.now() + RESEND_DELAY * 1000;
      localStorage.setItem("otpExpiry", newExpiry.toString());
    }

    const tick = () => {
      const expiry = localStorage.getItem("otpExpiry");
      if (expiry) {
        const remaining = Math.max(0, Math.ceil((Number(expiry) - Date.now()) / 1000));
        setResendTimer(remaining);
        if (remaining <= 0) {
          localStorage.removeItem("otpExpiry");
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    ref0.current?.focus();
  }, []);

  const resendOtp = async () => {
    setIsResending(true);
    try {
      await dispatch(resendOtpToVerifyEmail({ email })).unwrap();
      const newExpiry = Date.now() + RESEND_DELAY * 1000;
      localStorage.setItem("otpExpiry", newExpiry.toString());
      setResendTimer(RESEND_DELAY);
      setOtpDigits(["", "", "", "", "", ""]);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const expiry = localStorage.getItem("otpExpiry");
        if (expiry) {
          const remaining = Math.max(0, Math.ceil((Number(expiry) - Date.now()) / 1000));
          setResendTimer(remaining);
          if (remaining <= 0) {
            localStorage.removeItem("otpExpiry");
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      }, 1000);
    } catch (err) {
      if(err.message === "Email is not found, please re-signup" || err.message === "user not Exists, please try again to signup") {
        navigate("/signup");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    setOtpError(false);
    if (value && index < 5) {
      getRef(index + 1).current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        const newOtp = [...otpDigits];
        newOtp[index] = "";
        setOtpDigits(newOtp);
      } else if (index > 0) {
        getRef(index - 1).current?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      getRef(index - 1).current?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      getRef(index + 1).current?.focus();
    }
  };

  const handlePaste = (e) => {
    const pastedOtp = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedOtp)) return;
    setOtpDigits(pastedOtp.split(""));
    ref5.current?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otpDigits.join("");
    if (otpCode.length !== 6) {
      setOtpError(true);
      return;
    }
    setIsVerifying(true);
    try {
      const result = await dispatch(verifyUserEmail({ email, otp: otpCode })).unwrap();
      console.log("verify email result : ", result);
      console.log("Verified OTP:", otpCode);
      localStorage.removeItem("otpExpiry");
      localStorage.removeItem("userData");
      navigate("/");
    } catch (err) {
      if (err.message === "User not found!") {
        navigate("/signup");
      } else if (err.message === 'Email is already verified!') {
        navigate("/signin");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-100 border rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify your email</h2>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="input input-bordered bg-base-200 w-full rounded-xl"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="label mb-4">
                <span className="label-text">Enter 6-digit OTP</span>
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={
                      idx === 0 ? ref0 :
                        idx === 1 ? ref1 :
                          idx === 2 ? ref2 :
                            idx === 3 ? ref3 :
                              idx === 4 ? ref4 : ref5
                    }
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`input bg-base-200 w-12 h-12 text-center text-xl rounded-xl ${otpError && digit === "" ? "border-red-500" : "input-bordered"
                      }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={resendOtp}
              className="btn btn-ghost w-full rounded-xl"
              disabled={resendTimer > 0 || isResending}
            >
              {isResending
                ? "Resending..."
                : resendTimer > 0
                  ? `Resend in ${Math.floor(resendTimer / 60)}:${String(
                    resendTimer % 60
                  ).padStart(2, "0")}`
                  : "Resend OTP"}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full rounded-xl"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Complete Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmailPage;