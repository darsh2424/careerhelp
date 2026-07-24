import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext"
import { Provider } from "react-redux"
import { store } from "./redux/store";
export default function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  )
}
