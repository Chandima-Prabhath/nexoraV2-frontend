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
        <html lang="en" data-oid="8llvxu5">
            <body className={inter.className} data-oid="44qw108">
                <LoadingProvider data-oid="todahgd">
                    <SpinnerLoadingProvider data-oid="x591h0f">
                        <div className="min-h-screen bg-gray-900 text-white" data-oid="29h82by">
                            <Navbar data-oid="9w.10nt" />
                            {children}
                            <ProgressBar
                                height="5px"
                                color="#8927e9"
                                options={{ showSpinner: false }}
                                shallowRouting
                                data-oid="_x5k-lq"
                            />
                        </div>
                    </SpinnerLoadingProvider>
                </LoadingProvider>
            </body>
        </html>
    );
}
