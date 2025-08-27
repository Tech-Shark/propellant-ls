export default function Index() {
    return (
        <div className="min-h-screen bg-cv-white">
            <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
                {/* Header */}
                <header className="text-center mb-12 sm:mb-16 lg:mb-24">
                    <h1 className="font-montserrat font-bold text-cv-neutral-1000 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                        Cameron Williamson
                    </h1>
                </header>

                {/* Main Content */}
                <div className="space-y-12 sm:space-y-16 lg:space-y-20">
                    {/* About Section */}
                    <section>
                        <h2 className="font-montserrat font-bold text-black text-2xl sm:text-3xl lg:text-4xl leading-relaxed tracking-tight mb-6 lg:mb-8">
                            About
                        </h2>
                        <p className="font-inter text-cv-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </section>

                    {/* Experience Section */}
                    <section>
                        <h2 className="font-montserrat font-bold text-black text-2xl sm:text-3xl lg:text-4xl leading-relaxed tracking-tight mb-6 lg:mb-8">
                            Experience
                        </h2>
                        <div className="space-y-6 lg:space-y-8">
                            {/* Experience Item 1 */}
                            <div className="space-y-3 lg:space-y-4">
                                <p className="font-montserrat font-bold text-cv-neutral-600 text-base sm:text-lg lg:text-xl leading-relaxed tracking-tight">
                                    January 2000 - November 2001
                                </p>
                                <h3 className="font-montserrat font-bold text-cv-neutral-1000 text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight">
                                    Head Of Marketing - Google
                                </h3>
                                <p className="font-inter text-cv-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                </p>
                            </div>

                            {/* Experience Item 2 */}
                            <div className="space-y-3 lg:space-y-4">
                                <p className="font-montserrat font-bold text-cv-neutral-600 text-base sm:text-lg lg:text-xl leading-relaxed tracking-tight">
                                    January 2000 - November 2001
                                </p>
                                <h3 className="font-montserrat font-bold text-cv-neutral-1000 text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight">
                                    Head Of Marketing - Google
                                </h3>
                                <p className="font-inter text-cv-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Education Section */}
                    <section>
                        <h2 className="font-montserrat font-bold text-black text-2xl sm:text-3xl lg:text-4xl leading-relaxed tracking-tight mb-6 lg:mb-8">
                            Education
                        </h2>
                        <div className="space-y-6 lg:space-y-8">
                            {/* Education Item 1 */}
                            <div className="space-y-3 lg:space-y-4">
                                <p className="font-montserrat font-bold text-cv-neutral-600 text-base sm:text-lg lg:text-xl leading-relaxed tracking-tight">
                                    January 2000 - November 2004
                                </p>
                                <h3 className="font-montserrat text-cv-neutral-1000 text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight">
                                    <span className="font-bold">ND Marketing</span> at <span className="font-bold">Nekede Polythecnic</span>
                                </h3>
                            </div>

                            {/* Education Item 2 */}
                            <div className="space-y-3 lg:space-y-4">
                                <p className="font-montserrat font-bold text-cv-neutral-600 text-base sm:text-lg lg:text-xl leading-relaxed tracking-tight">
                                    January 2004 - November 2008
                                </p>
                                <h3 className="font-montserrat text-cv-neutral-1000 text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight">
                                    <span className="font-bold">B.Sc Marketing</span> at <span className="font-bold">University Of Uyo</span>
                                </h3>
                            </div>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section>
                        <h2 className="font-montserrat font-bold text-black text-2xl sm:text-3xl lg:text-4xl leading-relaxed tracking-tight mb-6 lg:mb-8">
                            Contact
                        </h2>
                        <div className="space-y-1 lg:space-y-2">
                            <p className="font-inter text-cv-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">
                                Uyo, Akwa Ibom, Nigeria
                            </p>
                            <p className="font-inter text-cv-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">
                                precious00@gmail.com
                            </p>
                            <p className="font-inter text-cv-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">
                                +234 7065789076
                            </p>
                        </div>
                    </section>

                    {/* Languages Section */}
                    <section>
                        <h2 className="font-montserrat font-bold text-black text-2xl sm:text-3xl lg:text-4xl leading-relaxed tracking-tight mb-6 lg:mb-8">
                            Languages
                        </h2>
                        <div className="space-y-1 lg:space-y-2">
                            <p className="font-inter text-cv-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">
                                English
                            </p>
                            <p className="font-inter text-cv-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">
                                French
                            </p>
                            <p className="font-inter text-cv-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">
                                Spanish
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
