import Link from 'next/link';

export const DesktopMenu = () => {
    return (
        <div className="hidden md:flex space-x-8" data-oid="-iugxvg">
            <Link href="/" className="hover:text-purple-400 transition-colors" data-oid="1xitwgq">
                Home
            </Link>
            <Link
                href="/browse/movies"
                className="hover:text-purple-400 transition-colors"
                data-oid="4msh0lk"
            >
                Movies
            </Link>
            <Link
                href="/browse/tvshows"
                className="hover:text-purple-400 transition-colors"
                data-oid="v6w5fdk"
            >
                TV Shows
            </Link>
            <Link
                href="/mylist"
                className="hover:text-purple-400 transition-colors"
                data-oid="cbsd.un"
            >
                My List
            </Link>
        </div>
    );
};
