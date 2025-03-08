import Link from 'next/link';

export const DesktopMenu = () => {
    return (
        <div className="hidden md:flex space-x-8" data-oid="8clvgxs">
            <Link href="/" className="hover:text-purple-400 transition-colors" data-oid="en._w4y">
                Home
            </Link>
            <Link
                href="/browse/movies"
                className="hover:text-purple-400 transition-colors"
                data-oid=".4cp8fx"
            >
                Movies
            </Link>
            <Link
                href="/browse/tvshows"
                className="hover:text-purple-400 transition-colors"
                data-oid="s0:-:vi"
            >
                TV Shows
            </Link>
            <Link
                href="/mylist"
                className="hover:text-purple-400 transition-colors"
                data-oid="aci1ac:"
            >
                My List
            </Link>
        </div>
    );
};
