import Link from 'next/link';

export const DesktopMenu = () => {
    return (
        <div className="hidden md:flex space-x-8" data-oid="i87:nw2">
            <Link href="/" className="hover:text-purple-400 transition-colors" data-oid="wiyo7-t">
                Home
            </Link>
            <Link
                href="/browse/movies"
                className="hover:text-purple-400 transition-colors"
                data-oid="vo0:_nc"
            >
                Movies
            </Link>
            <Link
                href="/browse/tvshows"
                className="hover:text-purple-400 transition-colors"
                data-oid="9x822vw"
            >
                TV Shows
            </Link>
            <Link
                href="/mylist"
                className="hover:text-purple-400 transition-colors"
                data-oid="1paexkk"
            >
                My List
            </Link>
        </div>
    );
};
