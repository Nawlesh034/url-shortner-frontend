import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import CodeStats from "./pages/CodeStats"
import RedirectPage from "./pages/RedirectPage"
import Healthz from "./pages/Healthz"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <>
      <Routes>

        {/* Home / Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Stats page */}
        <Route path="/code/:code" element={<CodeStats />} />

        {/* Health check */}
        <Route path="/healthz" element={<Healthz />} />

        {/* Redirect page (important: keep below /code/:code to avoid conflict) */}
        <Route path="/:code" element={<RedirectPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  )
}
