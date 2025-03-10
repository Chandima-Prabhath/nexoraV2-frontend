import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FileStructure {
    contents?: any[];
}

export default function EpisodesSection({
    fileStructure,
    tvshow,
}: {
    fileStructure: FileStructure;
    tvshow: any;
}) {
    const [activeSeasonName, setActiveSeasonName] = useState('');

    useEffect(() => {
        if (!activeSeasonName && fileStructure.contents && fileStructure.contents.length > 0) {
            setActiveSeasonName(fileStructure.contents[0].path.split('/').pop() || '');
        }
    }, [fileStructure.contents, activeSeasonName]);

    const activeSeasonContent = fileStructure.contents?.find(
        (season) => season.path.split('/').pop() === activeSeasonName,
    );

    return (
        <div
            className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50"
            data-oid="1k.l-s8"
        >
            <div className="flex flex-col space-y-4" data-oid="00kr_pi">
                <div className="flex items-center justify-between" data-oid="ps:oevi">
                    <h3 className="text-lg font-semibold text-gray-200" data-oid="t1it:v_">
                        Episodes
                    </h3>
                </div>

                {/* Season Buttons */}
                <div
                    className="overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-hide snap-x snap-mandatory pb-2"
                    data-oid="8.6l5c-"
                >
                    {fileStructure.contents?.map((season, idx) => {
                        const seasonName = season.path.split('/').pop();
                        const isSpecials = seasonName === 'Specials';

                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveSeasonName(seasonName)}
                                className={`px-4 py-2 min-w-fit rounded-full text-sm font-medium transition-colors snap-start ${
                                    activeSeasonName === seasonName
                                        ? 'bg-purple-500 text-white'
                                        : isSpecials
                                          ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                          : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                                }`}
                                data-oid="3d.2epc"
                            >
                                {seasonName}
                            </button>
                        );
                    })}
                </div>

                {/* Episodes List */}
                <div className="space-y-8 mt-4" data-oid="ch_qf:z">
                    {activeSeasonContent && (
                        <div key={activeSeasonName} className="space-y-4" data-oid="wc990t_">
                            <h4
                                className={`text-base font-medium ${
                                    activeSeasonContent.path.includes('Specials')
                                        ? 'text-amber-300'
                                        : 'text-purple-300'
                                }`}
                                data-oid="1j9kzne"
                            >
                                {activeSeasonName}
                            </h4>
                            <div className="space-y-2" data-oid="jgc45po">
                                {activeSeasonContent.contents?.map(
                                    (episode: any, episodeIdx: number) => {
                                        const match = episode.path.match(
                                            /[S](\d+)[E](\d+) - (.+?)\./,
                                        );
                                        if (!match) return null;

                                        const [, , episodeNum, episodeTitle] = match;
                                        const isSpecials =
                                            activeSeasonContent.path.includes('Specials');

                                        // Use the actual file name from the file structure for the Link href
                                        const fileName = episode.path.split('/').pop();

                                        return (
                                            <div
                                                key={episodeIdx}
                                                className="group flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-gray-700/50 cursor-pointer"
                                                data-oid="vzpapbs"
                                            >
                                                {/* Episode Number */}
                                                <div
                                                    className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gray-700/50 ${
                                                        isSpecials
                                                            ? 'group-hover:bg-amber-500/20'
                                                            : 'group-hover:bg-purple-500/20'
                                                    }`}
                                                    data-oid="ru.q60w"
                                                >
                                                    <span
                                                        className={`text-lg font-semibold text-gray-300 ${
                                                            isSpecials
                                                                ? 'group-hover:text-amber-300'
                                                                : 'group-hover:text-purple-300'
                                                        }`}
                                                        data-oid="pjq:bk1"
                                                    >
                                                        {episodeNum}
                                                    </span>
                                                </div>

                                                {/* Episode Info */}
                                                <div className="flex-grow" data-oid="z1084fe">
                                                    <h4
                                                        className="text-gray-200 font-medium"
                                                        data-oid=":2jll8m"
                                                    >
                                                        {episodeTitle.replace(/_/g, ' ')}
                                                    </h4>
                                                    <div
                                                        className="flex items-center gap-3 text-sm text-gray-400"
                                                        data-oid="xxyf-rg"
                                                    >
                                                        <span data-oid=".10b7li">
                                                            {Math.round(episode.size / 1024 / 1024)}{' '}
                                                            MB
                                                        </span>
                                                        <span data-oid="315j1f_">•</span>
                                                        <span data-oid="arw:4z9">
                                                            {episode.path.includes('720p')
                                                                ? 'HD'
                                                                : 'SD'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Play Button */}
                                                <Link
                                                    href={`/watch/tvshow/${tvshow}/${activeSeasonName}/${fileName}`}
                                                    className={`flex-shrink-0 p-2 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ${
                                                        isSpecials
                                                            ? 'bg-amber-500/20 hover:bg-amber-500/30'
                                                            : 'bg-purple-500/20 hover:bg-purple-500/30'
                                                    }`}
                                                    data-oid="horxee2"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        data-oid="nbfbw.i"
                                                    >
                                                        <path
                                                            d="M4 4l12 6-12 6V4z"
                                                            data-oid="n.b71t2"
                                                        />
                                                    </svg>
                                                </Link>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
