export default function Index() {
    return (
        <div className="min-h-screen bg-white">
            {/* Main CV Container */}
            <div className="flex flex-col xl:flex-row max-w-[1600px] mx-auto min-h-screen">
                {/* Left Sidebar */}
                <div className="w-full xl:w-[560px] bg-cv-brown text-white px-6 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16 xl:min-h-screen">
                    {/* Profile Photo */}
                    <div className="flex justify-center mb-8 md:mb-12">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format"
                                alt="Jeremiah Benson"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mb-8 md:mb-12">
                        <h2 className="font-montserrat text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 tracking-tight">Contact</h2>

                        <div className="space-y-8 md:space-y-10 lg:space-y-12">
                            {/* Email */}
                            <div>
                                <h3 className="font-montserrat text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Email</h3>
                                <div className="flex items-center gap-4">
                                    <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M1.69271 4L9.20833 11.0143C9.653 11.4303 10.3503 11.4303 10.7943 11.0143L18.3099 4H1.69271ZM0.667969 4.86719V16H19.3346V4.86719L11.7044 11.9883C11.2264 12.4343 10.614 12.6576 10.0013 12.6576C9.38863 12.6576 8.77618 12.4343 8.29818 11.9883L0.667969 4.86719Z"/>
                                    </svg>
                                    <span className="font-inter text-sm md:text-lg lg:text-xl break-all">precious00@gmail.com</span>
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <h3 className="font-montserrat text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Phone number</h3>
                                <div className="flex items-center gap-4">
                                    <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.2208 13.8671C16.0309 12.8485 14.8199 12.2295 13.645 13.2482L12.9419 13.8611C12.4281 14.3089 11.4726 16.3942 7.77966 12.1424C4.08675 7.8996 6.28326 7.23854 6.80009 6.79684L7.50622 6.18085C8.67509 5.16222 8.23338 3.87917 7.38903 2.55705L6.88122 1.75777C6.03386 0.441668 5.10838 -0.423716 3.93651 0.591908L3.30249 1.1478C2.78266 1.5234 1.33434 2.75237 0.982781 5.0841C0.559103 7.88157 1.89624 11.0877 4.95213 14.6033C8.00502 18.122 10.9978 19.8888 13.8283 19.8587C16.1811 19.8317 17.6054 18.5697 18.0501 18.1099L18.6841 17.554C19.856 16.5384 19.1288 15.5018 17.9359 14.4831L17.2208 13.8671Z"/>
                                    </svg>
                                    <span className="font-inter text-sm md:text-lg lg:text-xl">+234 7065789076</span>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <h3 className="font-montserrat text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Home address</h3>
                                <div className="flex items-center gap-4">
                                    <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.99961 0.399902C6.47148 0.399902 3.59961 3.27178 3.59961 6.7999C3.59961 12.4452 9.45117 19.178 9.69961 19.4624C9.77617 19.5499 9.88398 19.5999 9.99961 19.5999C10.123 19.5921 10.223 19.5499 10.2996 19.4624C10.548 19.1733 16.3996 12.3249 16.3996 6.7999C16.3996 3.27178 13.5277 0.399902 9.99961 0.399902ZM9.99961 4.7999C11.3246 4.7999 12.3996 5.8749 12.3996 7.1999C12.3996 8.5249 11.3246 9.5999 9.99961 9.5999C8.67461 9.5999 7.59961 8.5249 7.59961 7.1999C7.59961 5.8749 8.67461 4.7999 9.99961 4.7999Z"/>
                                    </svg>
                                    <span className="font-inter text-sm md:text-lg lg:text-xl">Uyo, Akwa Ibom, Nigeria</span>
                                </div>
                            </div>

                            {/* Portfolio */}
                            <div>
                                <h3 className="font-montserrat text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Portfolio link</h3>
                                <div className="flex items-center gap-4">
                                    <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5.83398 9.16675H13.334V10.8334H5.83398V9.16675Z"/>
                                        <path d="M5.00065 14.1666C5.58398 14.1666 7.75065 14.1666 8.33398 14.1666V12.4999C7.66732 12.4999 5.66732 12.4999 5.00065 12.4999C3.58398 12.4999 2.50065 11.4166 2.50065 9.99992C2.50065 8.58325 3.58398 7.49992 5.00065 7.49992C5.66732 7.49992 7.66732 7.49992 8.33398 7.49992V5.83325C7.75065 5.83325 5.58398 5.83325 5.00065 5.83325C2.66732 5.83325 0.833984 7.66659 0.833984 9.99992C0.833984 12.3333 2.66732 14.1666 5.00065 14.1666Z"/>
                                    </svg>
                                    <span className="font-montserrat text-sm md:text-lg lg:text-xl break-all">https://www.behance.net/search/project</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mb-8 md:mb-12">
                        <h2 className="font-montserrat text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 tracking-tight">Skills</h2>

                        <div className="space-y-6 md:space-y-8">
                            {[
                                { name: "Skill 1", percentage: 84 },
                                { name: "Skill 2", percentage: 84 },
                                { name: "Skill 3", percentage: 84 },
                                { name: "Skill 4", percentage: 84 }
                            ].map((skill, index) => (
                                <div key={index}>
                                    <div className="font-inter text-lg md:text-xl lg:text-2xl mb-3 md:mb-5">{skill.name}</div>
                                    <div className="w-full h-3 bg-cv-progress-gray rounded-lg">
                                        <div
                                            className="h-3 bg-white rounded-lg transition-all duration-300"
                                            style={{ width: `${skill.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-0.5 bg-white mb-8 md:mb-12"></div>

                    {/* References Section */}
                    <div>
                        <h2 className="font-montserrat text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-9 tracking-tight">Reference</h2>

                        <div className="space-y-6">
                            {[
                                { name: "John Doe", position: "Executive Director", phone: "09087654678" },
                                { name: "Jennifer Lopez", position: "HR", phone: "09087654678" },
                                { name: "Jennifer Lopez", position: "HR", phone: "09087654678" }
                            ].map((ref, index) => (
                                <div key={index}>
                                    <div className="font-montserrat text-lg md:text-xl mb-0.5">{ref.name}</div>
                                    <div className="font-montserrat text-xl md:text-2xl font-bold mb-0.5">{ref.position}</div>
                                    <div className="font-montserrat text-sm md:text-base">{ref.phone}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 px-6 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16">
                    {/* Header */}
                    <div className="mb-8 md:mb-11">
                        <h1 className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 md:mb-7 tracking-tight leading-tight">
                            JEREMIAH BENSON
                        </h1>
                        <p className="font-monda text-lg md:text-xl lg:text-2xl text-cv-dark tracking-tight">
                            MOBILE DEVELOPER
                        </p>
                    </div>

                    {/* About Me */}
                    <div className="mb-8 md:mb-11">
                        <h2 className="font-montserrat text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 md:mb-7 tracking-tight">About Me</h2>
                        <p className="font-inter text-base md:text-lg lg:text-xl text-cv-gray leading-relaxed tracking-tight max-w-4xl">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                            sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>

                    {/* Education */}
                    <div className="mb-8 md:mb-11">
                        <h2 className="font-montserrat text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 md:mb-7 tracking-tight">Education</h2>

                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            {/* First Education */}
                            <div className="flex-1">
                                <div className="mb-6">
                                    <div className="font-montserrat text-sm md:text-base text-cv-gray-light mb-3 md:mb-4 tracking-tight">2000 - 2004</div>
                                    <h3 className="font-montserrat text-xl md:text-2xl lg:text-3xl font-bold text-cv-blue mb-2 tracking-tight">
                                        B.Sc in Computer Science
                                    </h3>
                                    <div className="font-montserrat text-lg md:text-xl lg:text-2xl text-cv-gray mb-4 md:mb-6 tracking-tight">Polytechnic 1</div>
                                </div>
                                <p className="font-inter text-base md:text-lg lg:text-2xl text-cv-gray leading-normal tracking-tight">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="hidden lg:block w-0.5 h-80 xl:h-96 bg-cv-gray-lighter"></div>

                            {/* Second Education */}
                            <div className="flex-1">
                                <div className="mb-6">
                                    <div className="font-montserrat text-sm md:text-base text-cv-gray-light mb-3 md:mb-4 tracking-tight">2000 - 2004</div>
                                    <h3 className="font-montserrat text-xl md:text-2xl lg:text-3xl font-bold text-cv-blue mb-2 tracking-tight">
                                        Master in Product design
                                    </h3>
                                    <div className="font-montserrat text-lg md:text-xl lg:text-2xl text-cv-gray mb-4 md:mb-6 tracking-tight">School 1</div>
                                </div>
                                <p className="font-inter text-base md:text-lg lg:text-2xl text-cv-gray leading-normal tracking-tight">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <h2 className="font-montserrat text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 md:mb-9 tracking-tight">Experience</h2>

                        <div className="space-y-12 md:space-y-16">
                            {/* First Experience */}
                            <div>
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 md:mb-6">
                                    <h3 className="font-montserrat text-lg md:text-xl lg:text-2xl font-bold text-cv-blue tracking-tight">Senior developer</h3>
                                    <div className="font-montserrat text-lg md:text-xl lg:text-2xl font-bold text-cv-gray-light tracking-tight lg:text-right">
                                        Apple Inc | 2020 till Date
                                    </div>
                                </div>
                                <p className="font-inter text-base md:text-lg lg:text-xl text-cv-gray leading-relaxed tracking-tight mb-4 md:mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                    dolor in reprehenderit i
                                </p>

                                {/* Bullet Points */}
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex items-start gap-4 md:gap-6">
                                        <div className="w-3 h-3 md:w-4 md:h-4 bg-cv-dark rotate-45 flex-shrink-0 mt-2"></div>
                                        <p className="font-inter text-base md:text-lg lg:text-xl text-cv-gray leading-relaxed tracking-tight">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4 md:gap-6">
                                        <div className="w-3 h-3 md:w-4 md:h-4 bg-cv-dark rotate-45 flex-shrink-0 mt-2"></div>
                                        <p className="font-inter text-base md:text-lg lg:text-xl text-cv-gray leading-relaxed tracking-tight">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Second Experience */}
                            <div>
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 md:mb-6">
                                    <h3 className="font-montserrat text-lg md:text-xl lg:text-2xl font-bold text-cv-blue tracking-tight">Senior developer</h3>
                                    <div className="font-montserrat text-lg md:text-xl lg:text-2xl font-bold text-cv-gray-light tracking-tight lg:text-right">
                                        Apple Inc | 2020 till Date
                                    </div>
                                </div>
                                <p className="font-inter text-base md:text-lg lg:text-xl text-cv-gray leading-relaxed tracking-tight mb-4 md:mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                    dolor in reprehenderit i
                                </p>

                                {/* Bullet Points */}
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex items-start gap-4 md:gap-6">
                                        <div className="w-3 h-3 md:w-4 md:h-4 bg-cv-dark rotate-45 flex-shrink-0 mt-2"></div>
                                        <p className="font-inter text-base md:text-lg lg:text-xl text-cv-gray leading-relaxed tracking-tight">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4 md:gap-6">
                                        <div className="w-3 h-3 md:w-4 md:h-4 bg-cv-dark rotate-45 flex-shrink-0 mt-2"></div>
                                        <p className="font-inter text-base md:text-lg lg:text-xl text-cv-gray leading-relaxed tracking-tight">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
