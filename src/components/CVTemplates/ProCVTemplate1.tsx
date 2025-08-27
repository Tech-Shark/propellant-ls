import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Index() {
    return (
        <div className="min-h-screen bg-white font-inter">
            {/* Main Container */}
            <div className="max-w-[1600px] mx-auto relative">
                {/* Header Section */}
                <div className="relative px-6 lg:px-36 pt-16 lg:pt-24">
                    {/* Blue Bookmark Accent */}
                    <div className="absolute top-0 right-0 lg:right-0">
                        <svg
                            width="256"
                            height="350"
                            viewBox="0 0 256 350"
                            fill="none"
                            className="w-32 lg:w-64 h-auto"
                        >
                            <path
                                d="M256 342L128 230L0 342V-10C0 -27.68 14.32 -42 32 -42H224C241.68 -42 256 -27.68 256 -10V342Z"
                                fill="#1602C7"
                            />
                        </svg>
                    </div>

                    {/* Name and Title */}
                    <div className="flex flex-col gap-6 lg:gap-10 max-w-2xl">
                        <h1 className="font-montserrat font-bold text-3xl lg:text-[66px] lg:leading-[76px] text-black tracking-tight lg:tracking-[-1.32px]">
                            JEREMIAH BENSON
                        </h1>
                        <h2 className="font-monda text-lg lg:text-2xl text-[#333] tracking-tight lg:tracking-[-0.48px]">
                            MOBILE DEVELOPER
                        </h2>
                    </div>

                    {/* Blue Decorative Line */}
                    <div className="w-full h-2.5 bg-[#1602C7] mt-8 lg:mt-16 mb-8 lg:mb-12"></div>
                </div>

                {/* About Me Section */}
                <section className="px-6 lg:px-36 mb-8 lg:mb-16">
                    <div className="flex flex-col gap-6 lg:gap-8">
                        <h3 className="font-montserrat font-bold text-2xl lg:text-[36px] lg:leading-[46px] text-black tracking-tight lg:tracking-[-0.72px]">
                            About Me
                        </h3>
                        <p className="font-inter text-base lg:text-2xl lg:leading-[34px] text-[#606060] tracking-tight lg:tracking-[-0.48px] max-w-full">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>

                    {/* Divider Line */}
                    <div className="w-full h-0.5 bg-[#A4A4A4] mt-8 lg:mt-12"></div>
                </section>

                {/* Contact Section */}
                <section className="px-6 lg:px-36 mb-8 lg:mb-16">
                    <div className="flex flex-col gap-6 lg:gap-8">
                        <h3 className="font-montserrat font-bold text-2xl lg:text-[36px] lg:leading-[46px] text-black tracking-tight lg:tracking-[-0.72px]">
                            Contact
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
                            {/* Email */}
                            <div className="flex flex-col gap-3">
                                <h4 className="font-montserrat font-bold text-lg lg:text-2xl text-[#333] tracking-tight lg:tracking-[-0.48px]">
                                    Email
                                </h4>
                                <div className="flex items-center gap-4">
                                    <Mail className="w-5 h-5 text-[#333]" />
                                    <span className="font-inter text-base lg:text-xl text-[#333] tracking-tight lg:tracking-[-0.4px]">
                                        precious00@gmail.com
                                    </span>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-3">
                                <h4 className="font-montserrat font-bold text-lg lg:text-2xl text-[#333] tracking-tight lg:tracking-[-0.48px]">
                                    Phone number
                                </h4>
                                <div className="flex items-center gap-4">
                                    <Phone className="w-5 h-5 text-[#333]" />
                                    <span className="font-inter text-base lg:text-xl text-[#333] tracking-tight lg:tracking-[-0.4px]">
                                        +234 7065789076
                                    </span>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex flex-col gap-3">
                                <h4 className="font-montserrat font-bold text-lg lg:text-2xl text-[#333] tracking-tight lg:tracking-[-0.48px]">
                                    Home address
                                </h4>
                                <div className="flex items-center gap-4">
                                    <MapPin className="w-5 h-5 text-[#333]" />
                                    <span className="font-inter text-base lg:text-xl text-[#333] tracking-tight lg:tracking-[-0.4px]">
                                        Uyo, Akwa Ibom, Nigeria
                                    </span>
                                </div>
                            </div>

                            {/* Portfolio */}
                            <div className="flex flex-col gap-3">
                                <h4 className="font-montserrat font-bold text-lg lg:text-2xl text-[#333] tracking-tight lg:tracking-[-0.48px]">
                                    Portfolio link
                                </h4>
                                <div className="flex items-center gap-4">
                                    <ExternalLink className="w-5 h-5 text-[#333]" />
                                    <span className="font-montserrat text-base lg:text-xl text-black tracking-tight lg:tracking-[-0.4px]">
                                        https://www.behance.net/search/project
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills and Education Section */}
                <div className="px-6 lg:px-36 mb-8 lg:mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-32">
                        {/* Skills */}
                        <div className="flex flex-col gap-6 lg:gap-8">
                            <h3 className="font-montserrat font-bold text-2xl lg:text-[36px] lg:leading-[46px] text-black tracking-tight lg:tracking-[-0.72px]">
                                Skills
                            </h3>

                            <div className="flex flex-col gap-6 lg:gap-8">
                                {[1, 2, 3, 4].map((skill) => (
                                    <div key={skill} className="flex flex-col gap-4 lg:gap-5">
                                        <span className="font-inter text-lg lg:text-2xl text-[#333] tracking-tight lg:tracking-[-0.48px]">
                                            Skill {skill}
                                        </span>
                                        <div className="relative w-full h-3 bg-[#D9D9D9] rounded-[10px]">
                                            <div className="absolute top-0 left-0 h-3 bg-[#1602C7] rounded-[10px] w-4/5"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="flex flex-col gap-6 lg:gap-8">
                            <h3 className="font-montserrat font-bold text-2xl lg:text-[36px] lg:leading-[46px] text-black tracking-tight lg:tracking-[-0.72px]">
                                Education
                            </h3>

                            <div className="flex flex-col gap-6">
                                {/* Education Item 1 */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-3">
                                        <span className="font-montserrat text-sm lg:text-base text-[#1602C7] tracking-tight lg:tracking-[-0.32px]">
                                            2000 - 2004
                                        </span>
                                        <div className="flex flex-col gap-2">
                                            <h4 className="font-montserrat font-bold text-xl lg:text-[28px] lg:leading-[38px] text-[#333] tracking-tight lg:tracking-[-0.56px]">
                                                ND in Computer Science
                                            </h4>
                                            <span className="font-montserrat text-lg lg:text-2xl text-[#606060] tracking-tight lg:tracking-[-0.48px]">
                                                Polytechnic 1
                                            </span>
                                        </div>
                                    </div>
                                    <p className="font-inter text-base lg:text-xl lg:leading-[30px] text-[#606060] tracking-tight lg:tracking-[-0.4px]">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    </p>
                                </div>

                                {/* Education Item 2 */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-3">
                                        <span className="font-montserrat text-sm lg:text-base text-[#1602C7] tracking-tight lg:tracking-[-0.32px]">
                                            2006 - 2010
                                        </span>
                                        <div className="flex flex-col gap-2">
                                            <h4 className="font-montserrat font-bold text-xl lg:text-[28px] lg:leading-[38px] text-[#333] tracking-tight lg:tracking-[-0.56px]">
                                                B.Sc in Computer Science
                                            </h4>
                                            <span className="font-montserrat text-lg lg:text-2xl text-[#606060] tracking-tight lg:tracking-[-0.48px]">
                                                University 1
                                            </span>
                                        </div>
                                    </div>
                                    <p className="font-inter text-base lg:text-xl lg:leading-[30px] text-[#606060] tracking-tight lg:tracking-[-0.4px]">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider Line */}
                    <div className="w-full h-0.5 bg-[#A4A4A4] mt-8 lg:mt-16"></div>
                </div>

                {/* Experience Section */}
                <section className="px-6 lg:px-36 pb-16 lg:pb-24">
                    <div className="flex flex-col gap-6 lg:gap-9">
                        <h3 className="font-montserrat font-bold text-2xl lg:text-[36px] lg:leading-[46px] text-black tracking-tight lg:tracking-[-0.72px]">
                            Experience
                        </h3>

                        <div className="flex flex-col gap-6">
                            {/* Experience Item 1 */}
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
                                    <h4 className="font-montserrat font-bold text-xl lg:text-2xl text-black tracking-tight lg:tracking-[-0.48px]">
                                        Product Designer
                                    </h4>
                                    <span className="font-montserrat font-bold text-xl lg:text-2xl text-[#1602C7] tracking-tight lg:tracking-[-0.48px]">
                                        Apple Inc | 2020 till Date
                                    </span>
                                </div>
                                <p className="font-inter text-lg lg:text-2xl lg:leading-[34px] text-[#606060] tracking-tight lg:tracking-[-0.48px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </div>

                            {/* Experience Item 2 */}
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
                                    <h4 className="font-montserrat font-bold text-xl lg:text-2xl text-black tracking-tight lg:tracking-[-0.48px]">
                                        Product Designer
                                    </h4>
                                    <span className="font-montserrat font-bold text-xl lg:text-2xl text-[#1602C7] tracking-tight lg:tracking-[-0.48px]">
                    Apple Inc | 2020 till Date
                  </span>
                                </div>
                                <p className="font-inter text-lg lg:text-2xl lg:leading-[34px] text-[#606060] tracking-tight lg:tracking-[-0.48px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
