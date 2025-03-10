import { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

interface CastSectionProps {
    movie: {
        characters?: {
            id: string;
            personImgURL?: string;
            image?: string;
            personName: string;
            url?: string;
            name?: string;
        }[];
    };
}

export default function CastSection({ movie }: CastSectionProps) {
    const [expanded, setExpanded] = useState(false);
    const visibleCharacters = expanded ? movie.characters : movie.characters?.slice(0, 5);

    return (
        <div
            className="flex-1 bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50"
            data-oid="o55v8ny"
        >
            <div className="flex justify-between items-center mb-2" data-oid="gyz2y92">
                <h2 className="text-xl font-semibold text-white" data-oid="j78k17e">
                    Cast
                </h2>
                {movie.characters && movie.characters.length > 5 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-white hover:text-gray-300 flex items-center"
                        data-oid="esqhn-r"
                    >
                        {expanded ? 'Hide' : 'Show'}{' '}
                        {expanded ? (
                            <ChevronUp size={18} data-oid=".m1m_6f" />
                        ) : (
                            <ChevronDown size={18} data-oid="b3t94:3" />
                        )}
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-4" data-oid="tt-qa4r">
                {visibleCharacters?.map((character) => (
                    <div
                        key={character.id}
                        className="flex items-center space-x-3"
                        data-oid="ums1jgy"
                    >
                        <img
                            src={
                                character.personImgURL ||
                                character.image ||
                                `https://eu.ui-avatars.com/api/?name=${character.personName}&size=250`
                            }
                            alt={character.personName}
                            className="w-12 h-12 rounded-full object-cover"
                            data-oid="c6p1msy"
                        />

                        <div data-oid="9cwm23e">
                            <a
                                target="_blank"
                                href={`https://thetvdb.com/people/${character.url}`}
                                className="text-white font-semibold hover:underline"
                                data-oid=".1ie8wm"
                            >
                                {character.personName}
                            </a>
                            {character.name && (
                                <p className="text-sm text-gray-400" data-oid="b:886al">
                                    as {character.name}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
