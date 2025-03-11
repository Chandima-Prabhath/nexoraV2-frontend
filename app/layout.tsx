'use client';
import './globals.css';
import { Navbar } from '@components/navigation/Navbar';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { LoadingProvider } from '@/components/loading/SplashScreen';
import { SpinnerLoadingProvider } from '@/components/loading/Spinner';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="-c9_10s">
            <body className="bg-gray-900" data-oid="b7ms1mi">
                <LoadingProvider data-oid="e-fo7e9">
                    <SpinnerLoadingProvider data-oid="ip53nv_">
                        <div className="min-h-screen text-white" data-oid="a6_il.2">
                            <Navbar data-oid="-t-ak3n" />
                            {children}
                            <ProgressBar
                                height="5px"
                                color="#8927e9"
                                options={{ showSpinner: false }}
                                shallowRouting
                                data-oid="6fxf_rh"
                            />
                        </div>
                    </SpinnerLoadingProvider>
                </LoadingProvider>
            </body>
        </html>
    );
}
