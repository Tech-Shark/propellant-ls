export default function Index() {
    return (
        <div className="p-8">
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-[#606060]">
                    {/* Header */}
                    <header className="mb-16 lg:mb-24">
                        <h1 className="font-montserrat font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] text-[#333333] leading-tight tracking-[-0.02em]">
                            Cameron Williamson
                        </h1>
                    </header>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-20">
                        {/* Left Column */}
                        <div className="space-y-16 lg:space-y-20">
                            {/* About Section */}
                            <section>
                                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-[36px] text-black leading-tight tracking-[-0.02em] mb-7">
                                    About
                                </h2>
                                <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </section>

                            {/* Experience Section */}
                            <section>
                                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-[36px] text-black leading-tight tracking-[-0.02em] mb-8">
                                    Experience
                                </h2>
                                <div className="space-y-12">
                                    {/* Experience Entry 1 */}
                                    <div className="space-y-4">
                                        <p className="font-montserrat font-semibold text-lg sm:text-xl leading-relaxed tracking-[-0.02em]">
                                            2000 - 2001
                                        </p>
                                        <h3 className="font-montserrat font-bold text-xl sm:text-2xl lg:text-[28px] text-[#333333] leading-tight tracking-[-0.02em]">
                                            Head Of Marketing - Google
                                        </h3>
                                        <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                        </p>
                                    </div>

                                    {/* Experience Entry 2 */}
                                    <div className="space-y-4">
                                        <p className="font-montserrat font-semibold text-lg sm:text-xl leading-relaxed tracking-[-0.02em]">
                                            2001 - 2002
                                        </p>
                                        <h3 className="font-montserrat font-bold text-xl sm:text-2xl lg:text-[28px] text-[#333333] leading-tight tracking-[-0.02em]">
                                            Head Of Marketing - Apple Inc.
                                        </h3>
                                        <p className="font-inter text-lg sm:text-xl lg:text-2xl text-neutral-800 leading-relaxed tracking-[-0.02em]">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                        </p>
                                    </div>

                                    {/* Experience Entry 3 */}
                                    <div className="space-y-4">
                                        <p className="font-montserrat font-semibold text-lg sm:text-xl leading-relaxed tracking-[-0.02em]">
                                            2001 - 2002
                                        </p>
                                        <h3 className="font-montserrat font-bold text-xl sm:text-2xl lg:text-[28px] text-[#333333] leading-tight tracking-[-0.02em]">
                                            Head Of Marketing - Apple Inc.
                                        </h3>
                                        <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-16 lg:space-y-20">
                            {/* Contact Info Section */}
                            <section>
                                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-[36px] text-black leading-tight tracking-[-0.02em] mb-7">
                                    About
                                </h2>
                                <div className="space-y-2">
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Uyo, Akwa Ibom, Nigeria
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        precious00@gmail.com
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        +234 7065789076
                                    </p>
                                </div>
                            </section>

                            {/* Languages Section */}
                            <section>
                                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-[36px] text-black leading-tight tracking-[-0.02em] mb-7">
                                    Languages
                                </h2>
                                <div className="space-y-2">
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        English
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        French
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Spanish
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Ibibio
                                    </p>
                                </div>
                            </section>

                            {/* Core Skills Section */}
                            <section>
                                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-[36px] text-black leading-tight tracking-[-0.02em] mb-7">
                                    Core Skills
                                </h2>
                                <div className="space-y-2">
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Team work
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Communication skills
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Marketing
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Bargaining skills
                                    </p>
                                </div>
                            </section>

                            {/* Interest Section */}
                            <section>
                                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-[36px] text-black leading-tight tracking-[-0.02em] mb-7">
                                    Interest
                                </h2>
                                <div className="space-y-2">
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Travelling
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Games
                                    </p>
                                    <p className="font-inter text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-[-0.02em]">
                                        Games
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
