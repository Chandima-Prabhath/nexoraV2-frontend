'use client';

import { useSpinnerLoading } from '@/components/loading/Spinner';
import { useLoading } from '@/components/loading/SplashScreen';

export default function MyListPage() {
    const { loading, setLoading } = useLoading();
    const { spinnerLoading, setSpinnerLoading } = useSpinnerLoading();
    if (loading === true) {
        setLoading(false);
    }
    if (spinnerLoading === false) {
        setSpinnerLoading(true);
    }
    return <div data-oid="9cj3kyn"></div>;
}
