import { Link, Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
export default function AuthLayout() {
    return (
        <div className='flex flex-col min-h-screen items-center justify-center bg-slate-100 px-4'>
            <div className="w-full flex flex-1 items-center justify-center p-4">
                <div className='w-full max-w-lg'>
                    <div className='rounded-3xl bg-white p-8 shadow-xl'>
                        <Outlet />
                    </div>
                </div>
            </div>
            <div className='w-full mt-5'>
                <Footer />
            </div>
        </div>
    )
}
