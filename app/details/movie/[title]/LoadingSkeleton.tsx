export function LoadingSkeleton() {
    return (
        <div className="w-full min-h-screen bg-gray-900 animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="relative w-full h-[60vh] bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-7xl px-6 space-y-4">
                        <div className="h-12 bg-gray-700 rounded-lg w-3/4 max-w-2xl"></div>
                        <div className="h-6 bg-gray-700 rounded-lg w-1/4 max-w-xs"></div>
                        <div className="flex gap-4">
                            <div className="h-12 bg-gray-700 rounded-3xl w-32"></div>
                            <div className="h-12 bg-gray-700 rounded-3xl w-32"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section Skeleton */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <div className="h-8 bg-gray-800 rounded-lg w-1/2"></div>
                        <div className="h-32 bg-gray-800 rounded-lg w-full"></div>
                        <div className="h-8 bg-gray-800 rounded-lg w-1/3"></div>
                        <div className="h-24 bg-gray-800 rounded-lg w-full"></div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-800 rounded-lg w-full"></div>
                        <div className="h-40 bg-gray-800 rounded-lg w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
