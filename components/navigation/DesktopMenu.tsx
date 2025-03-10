import Link from 'next/link';

export const DesktopMenu = () => {
    return (
        <div className="hidden md:flex space-x-8" data-oid="490f3th">
            <Link href="/" className="hover:text-purple-400 transition-colors" data-oid="x.wi690">
                Home
            </Link>
            <Link
                href="/browse/movies"
                className="hover:text-purple-400 transition-colors"
                data-oid="ztg_dga"
            >
                Movies
            </Link>
            <Link
                href="/browse/tvshows"
                className="hover:text-purple-400 transition-colors"
                data-oid="1afm3ef"
            >
                TV Shows
            </Link>
            <Link
                href="/mylist"
                className="hover:text-purple-400 transition-colors"
                data-oid="zyf13jn"
            >
                My List
            </Link>
        </div>
    );
};
