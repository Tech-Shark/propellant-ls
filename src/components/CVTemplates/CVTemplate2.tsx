export default function Index() {
    return (
        <div className="min-h-screen bg-cv-white">
            {/* Header */}
            <header className="bg-cv-teal w-full h-64 flex items-center px-8 md:px-32">
                <h1 className="font-montserrat font-bold text-6xl md:text-8xl lg:text-[96px] text-cv-white leading-tight tracking-[-1.92px]">
                    Eleanor Pena
                </h1>
            </header>

            {/* Main Content */}
            <main className="px-8 md:px-32 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 max-w-7xl">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-20">
                        {/* About Section */}
                        <section className="space-y-7">
                            <h2 className="font-montserrat font-bold text-4xl text-cv-black leading-[64px] tracking-[-0.72px]">
                                About
                            </h2>
                            <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </section>

                        {/* Education Section */}
                        <section className="space-y-8">
                            <h2 className="font-montserrat font-bold text-4xl text-cv-black leading-[64px] tracking-[-0.72px]">
                                Education
                            </h2>

                            <div className="space-y-4">
                                <div className="font-montserrat font-bold text-xl text-cv-light-gray leading-[34px] tracking-[-0.4px]">
                                    2000 - 2006
                                </div>
                                <h3 className="font-montserrat font-bold text-[28px] text-cv-dark-gray leading-[34px] tracking-[-0.56px]">
                                    Unity Primary School
                                </h3>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodi
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="font-montserrat font-bold text-xl text-cv-light-gray leading-[34px] tracking-[-0.4px]">
                                    2006 - 2011
                                </div>
                                <h3 className="font-montserrat font-bold text-[28px] text-cv-dark-gray leading-[34px] tracking-[-0.56px]">
                                    Unity High school
                                </h3>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="font-montserrat font-bold text-xl text-cv-light-gray leading-[34px] tracking-[-0.4px]">
                                    2011 - 2016
                                </div>
                                <h3 className="font-montserrat font-bold text-[28px] text-cv-dark-gray leading-[34px] tracking-[-0.56px]">
                                    University Of Uyo
                                </h3>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                </p>
                            </div>
                        </section>

                        {/* Experience Section */}
                        <section className="space-y-8">
                            <h2 className="font-montserrat font-bold text-4xl text-cv-black leading-[64px] tracking-[-0.72px]">
                                Experience
                            </h2>

                            <div className="space-y-4">
                                <div className="font-montserrat font-bold text-xl text-cv-light-gray leading-[34px] tracking-[-0.4px]">
                                    2000 - 2001
                                </div>
                                <h3 className="font-montserrat font-bold text-[28px] text-cv-dark-gray leading-[34px] tracking-[-0.56px]">
                                    Head Of Marketing - Google
                                </h3>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="font-montserrat font-bold text-xl text-cv-light-gray leading-[34px] tracking-[-0.4px]">
                                    2001 - 2002
                                </div>
                                <h3 className="font-montserrat font-bold text-[28px] text-cv-dark-gray leading-[34px] tracking-[-0.56px]">
                                    Head Of Marketing - Apple Inc.
                                </h3>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-20">
                        {/* Contact Section */}
                        <section className="space-y-7">
                            <h2 className="font-montserrat font-bold text-4xl text-cv-black leading-[64px] tracking-[-0.72px]">
                                Contact
                            </h2>
                            <div className="space-y-2">
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Uyo, Akwa Ibom, Nigeria
                                </p>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    precious00@gmail.com
                                </p>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    +234 7065789076
                                </p>
                            </div>
                        </section>

                        {/* Languages Section */}
                        <section className="space-y-7">
                            <h2 className="font-montserrat font-bold text-4xl text-cv-black leading-[64px] tracking-[-0.72px]">
                                Languages
                            </h2>
                            <div className="space-y-2">
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    English
                                </p>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    French
                                </p>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Spanish
                                </p>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Ibibio
                                </p>
                            </div>
                        </section>

                        {/* Core Skills Section */}
                        <section className="space-y-7">
                            <h2 className="font-montserrat font-bold text-4xl text-cv-black leading-[64px] tracking-[-0.72px]">
                                Core Skills
                            </h2>
                            <div className="space-y-2">
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Team work
                                </p>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Communication skills
                                </p>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Marketing
                                </p>
                                <p className="font-inter text-2xl text-cv-medium-gray leading-[34px] tracking-[-0.48px]">
                                    Bargaining skills
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}