'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const [floating, setFloating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFloating((prev) => !prev);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen text-white"
            data-oid="rf0xpp-"
        >
            <h1
                className={`text-6xl font-bold text-gray-300 transition-transform duration-500 ${
                    floating ? 'translate-y-1' : '-translate-y-1'
                }`}
                data-oid="gvlrt07"
            >
                <svg
                    fill="#b8b8b8"
                    height="200px"
                    width="200px"
                    version="1.1"
                    id="Layer_1"
                    viewBox="0 0 512 512"
                    stroke="#b8b8b8"
                    data-oid="a8k-9_r"
                >
                    <g id="SVGRepo_bgCarrier" stroke-width="0" data-oid="rp1eof9"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        data-oid="fk.ul8h"
                    ></g>
                    <g id="SVGRepo_iconCarrier" data-oid="s88:4r2">
                        {' '}
                        <g data-oid="urk:g71">
                            {' '}
                            <g data-oid="7x2a1pv">
                                {' '}
                                <path
                                    d="M170.667,320.007V320c0-11.782-9.551-21.333-21.333-21.333C137.552,298.667,128,308.218,128,320v-56.89 c0-11.782-9.551-21.333-21.333-21.333s-21.333,9.551-21.333,21.333v78.229c-0.001,11.783,9.551,21.334,21.333,21.334H128v42.66 c0,11.782,9.551,21.333,21.333,21.333s21.333-9.551,21.333-21.333v-42.66c11.782,0,21.333-9.551,21.333-21.333 C192,329.558,182.449,320.007,170.667,320.007z"
                                    data-oid="13.qvoe"
                                ></path>{' '}
                            </g>{' '}
                        </g>{' '}
                        <g data-oid="ofy4rxj">
                            {' '}
                            <g data-oid="z7svgvp">
                                {' '}
                                <path
                                    d="M426.667,320.007V320c0-11.782-9.551-21.333-21.333-21.333C393.552,298.667,384,308.218,384,320v-56.89 c0-11.782-9.551-21.333-21.333-21.333c-11.782,0-21.333,9.551-21.333,21.333v78.229c-0.001,11.783,9.551,21.334,21.333,21.334H384 v42.66c0,11.782,9.551,21.333,21.333,21.333c11.782,0,21.333-9.551,21.333-21.333v-42.66c11.782,0,21.333-9.551,21.333-21.333 C448,329.558,438.449,320.007,426.667,320.007z"
                                    data-oid="ek_s5vt"
                                ></path>{' '}
                            </g>{' '}
                        </g>{' '}
                        <g data-oid="43b09rt">
                            {' '}
                            <g data-oid="cm2ja6v">
                                {' '}
                                <path
                                    d="M266.667,256c-29.446,0-53.333,23.887-53.333,53.333v64c-0.001,29.446,23.887,53.334,53.333,53.334 S320,402.78,320,373.334v-64C320,279.887,296.114,256,266.667,256z M277.334,373.333c0,5.882-4.785,10.667-10.667,10.667 c-5.882,0-10.667-4.785-10.667-10.667v-64c0-5.882,4.785-10.667,10.667-10.667c5.882,0,10.667,4.785,10.667,10.667V373.333z"
                                    data-oid="usnpdlz"
                                ></path>{' '}
                            </g>{' '}
                        </g>{' '}
                        <g data-oid="naz1:0-">
                            {' '}
                            <g data-oid="4j8zd0s">
                                {' '}
                                <path
                                    d="M490.667,0H21.333C9.552,0,0,9.551,0,21.333V192v298.667C0,502.449,9.552,512,21.333,512h469.333 c11.782,0,21.333-9.551,21.333-21.333V192V21.333C512,9.551,502.45,0,490.667,0z M469.334,469.333L469.334,469.333H42.667v-256 h426.667V469.333z M469.334,170.667H42.667v-128h426.667V170.667z"
                                    data-oid="c:yafk1"
                                ></path>{' '}
                            </g>{' '}
                        </g>{' '}
                        <g data-oid="zdj-vcu">
                            {' '}
                            <g data-oid="9:shmpp">
                                {' '}
                                <path
                                    d="M435.505,106.666l6.248-6.248c8.331-8.331,8.331-21.838,0-30.17c-8.331-8.331-21.839-8.331-30.17,0l-6.248,6.248 l-6.248-6.248c-8.331-8.331-21.839-8.331-30.17,0c-8.331,8.331-8.331,21.839,0,30.17l6.248,6.248l-6.248,6.248 c-8.331,8.331-8.331,21.839,0,30.17s21.839,8.331,30.17,0l6.248-6.248l6.248,6.248c8.331,8.331,21.839,8.331,30.17,0 s8.331-21.839,0-30.17L435.505,106.666z"
                                    data-oid="yqb7vnt"
                                ></path>{' '}
                            </g>{' '}
                        </g>{' '}
                        <g data-oid="mk8:2yl">
                            {' '}
                            <g data-oid="4e64n.1">
                                {' '}
                                <path
                                    d="M256,85.333H85.333C73.552,85.333,64,94.885,64,106.667S73.552,128,85.333,128H256c11.782,0,21.333-9.551,21.333-21.333 S267.783,85.333,256,85.333z"
                                    data-oid="a7g4.yd"
                                ></path>{' '}
                            </g>{' '}
                        </g>{' '}
                    </g>
                </svg>
            </h1>

            <p className="text-xl text-gray-400 mt-4" data-oid="lqjfn-x">
                Oops! The page you’re looking for doesn’t exist.
            </p>
            <Link
                href="/"
                className="mt-5 px-6 py-2 rounded-3xl bg-purple-600 hover:bg-purple-500 transition-all text-white text-lg font-semibold shadow-lg shadow-purple-500/30"
                data-oid="68r1-f-"
            >
                Go Home
            </Link>
        </div>
    );
}
