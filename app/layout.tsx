'use client';
import './globals.css';
import { Navbar } from '@components/navigation/Navbar';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { LoadingProvider } from '@/components/loading/SplashScreen';
import { SpinnerLoadingProvider } from '@/components/loading/Spinner';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="bg-gray-900">
                <LoadingProvider>
                    <SpinnerLoadingProvider>
                        <div className="min-h-screen text-white">
                            <Navbar />
                            {children}
                            <ProgressBar
                                height="5px"
                                color="#8927e9"
                                options={{ showSpinner: false }}
                                shallowRouting
                            />
                        </div>
                    </SpinnerLoadingProvider>
                </LoadingProvider>
            </body>
        </html>
    );
}
