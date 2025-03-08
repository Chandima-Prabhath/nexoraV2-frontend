'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@components/navigation/Navbar';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { LoadingProvider } from '@/components/loading/SplashScreen';
import { SpinnerLoadingProvider } from '@/components/loading/Spinner';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="1_gq4u4">
            <body className={inter.className} data-oid="9kys4r7">
                <LoadingProvider data-oid=".vw1l-d">
                    <SpinnerLoadingProvider data-oid="coli-8u">
                        <div className="min-h-screen bg-gray-900 text-white" data-oid="lqjkae6">
                            <Navbar data-oid="5q86ab0" />
                            {children}
                            <ProgressBar
                                height="5px"
                                color="#8927e9"
                                options={{ showSpinner: false }}
                                shallowRouting
                                data-oid="egg_77i"
                            />
                        </div>
                    </SpinnerLoadingProvider>
                </LoadingProvider>
            </body>
        </html>
    );
}
