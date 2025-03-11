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
            data-oid="xvljy7c"
        >
            <div className="flex justify-between items-center mb-2" data-oid="1627pqg">
                <h2 className="text-xl font-semibold text-white" data-oid="-jl42ys">
                    Cast
                </h2>
                {movie.characters && movie.characters.length > 5 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-white hover:text-gray-300 flex items-center"
                        data-oid="shxhbl1"
                    >
                        {expanded ? 'Hide' : 'Show'}{' '}
                        {expanded ? (
                            <ChevronUp size={18} data-oid="73i9oh_" />
                        ) : (
                            <ChevronDown size={18} data-oid="e7pbexl" />
                        )}
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-4" data-oid="k16rm9-">
                {visibleCharacters?.map((character) => (
                    <div
                        key={character.id}
                        className="flex items-center space-x-3"
                        data-oid="il89uph"
                    >
                        <img
                            src={
                                character.personImgURL ||
                                character.image ||
                                `https://eu.ui-avatars.com/api/?name=${character.personName}&size=250`
                            }
                            alt={character.personName}
                            className="w-12 h-12 rounded-full object-cover"
                            data-oid="xseu92d"
                        />

                        <div data-oid="zmir0no">
                            <a
                                target="_blank"
                                href={`https://thetvdb.com/people/${character.url}`}
                                className="text-white font-semibold hover:underline"
                                data-oid="ory3c:w"
                            >
                                {character.personName}
                            </a>
                            {character.name && (
                                <p className="text-sm text-gray-400" data-oid="e1z0ykj">
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
