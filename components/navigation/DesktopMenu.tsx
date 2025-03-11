import Link from 'next/link';

export const DesktopMenu = () => {
    return (
        <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-purple-400 transition-colors">
                Home
            </Link>
            <Link href="/browse/movies" className="hover:text-purple-400 transition-colors">
                Movies
            </Link>
            <Link href="/browse/tvshows" className="hover:text-purple-400 transition-colors">
                TV Shows
            </Link>
            <Link href="/mylist" className="hover:text-purple-400 transition-colors">
                My List
            </Link>
        </div>
    );
};
