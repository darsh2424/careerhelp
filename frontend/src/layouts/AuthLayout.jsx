import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
export default function AuthLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 max-w-5xl border border-gray-200 rounded-lg shadow-md p-4 mx-auto my-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
