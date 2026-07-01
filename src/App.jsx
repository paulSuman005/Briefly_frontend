import { Route, Routes } from "react-router-dom"
import ChatPage from "./pages/ChatPage"
import ChatLandingPage from "./pages/ChatLandingPage"
import { PageProvider } from "./context/PageProvider"
import SignupPage from "./pages/SignupPage"
import SigninPage from "./pages/SigninPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import ForgotPasswordPage from "./pages/ForgotPassword"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import Layout from "./components/Layout"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getUserData } from "./redux/slices/authSlice"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFoundPage from "./pages/NotFoundPage"



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("landing page useEffect called");
    (async () => {
      await dispatch(getUserData());
    })()
  }, [dispatch])

  return (
    <PageProvider>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verifyEmail" element={<VerifyEmailPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<ChatLandingPage />} />
            <Route path="/chat/:id" element={<ChatPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </PageProvider>
  )
}

export default App
