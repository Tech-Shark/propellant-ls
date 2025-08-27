export default function Index() {
    return (
        <div className="min-h-screen bg-white">
            {/* Blue Diagonal Header */}
            <div className="relative h-[279px] overflow-hidden">
                {/* Blue diagonal shape */}
                <svg
                    className="absolute top-0 right-0 w-[67%] h-full"
                    viewBox="0 0 1072 279"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    <path d="M141.5 0H1072V279H0L141.5 0Z" fill="#0C00AD"/>
                </svg>

                {/* Contact Information */}
                <div className="absolute top-[111px] right-4 lg:right-[126px] max-w-[792px] z-10 px-4 lg:px-0">
                    <h2 className="text-white font-montserrat text-2xl lg:text-4xl font-bold leading-[46px] tracking-[-0.72px] mb-[20px] lg:mb-[30px]">
                        Contact
                    </h2>
                    <div className="flex flex-col lg:flex-row lg:flex-wrap items-start gap-3 lg:gap-5">
                        {/* Email */}
                        <div className="flex items-center gap-4">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M1.69271 4L9.20833 11.0143C9.653 11.4303 10.3503 11.4303 10.7943 11.0143L18.3099 4H1.69271ZM0.667969 4.86719V16H19.3346V4.86719L11.7044 11.9883C11.2264 12.4343 10.614 12.6576 10.0013 12.6576C9.38863 12.6576 8.77618 12.4343 8.29818 11.9883L0.667969 4.86719Z" fill="white"/>
                            </svg>
                            <span className="text-white font-inter text-sm lg:text-xl font-medium leading-[34px] tracking-[-0.4px]">
                precious00@gmail.com
              </span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-4">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g clipPath="url(#clip0_124_1935)">
                                    <path d="M17.2208 13.8671C16.0309 12.8485 14.8199 12.2295 13.645 13.2482L12.9419 13.8611C12.4281 14.3089 11.4726 16.3942 7.77966 12.1424C4.08675 7.8996 6.28326 7.23854 6.80009 6.79684L7.50622 6.18085C8.67509 5.16222 8.23338 3.87917 7.38903 2.55705L6.88122 1.75777C6.03386 0.441668 5.10838 -0.423716 3.93651 0.591908L3.30249 1.1478C2.78266 1.5234 1.33434 2.75237 0.982781 5.0841C0.559103 7.88157 1.89624 11.0877 4.95213 14.6033C8.00502 18.122 10.9978 19.8888 13.8283 19.8587C16.1811 19.8317 17.6054 18.5697 18.0501 18.1099L18.6841 17.554C19.856 16.5384 19.1288 15.5018 17.9359 14.4831L17.2208 13.8671Z" fill="white"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_124_1935">
                                        <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="text-white font-inter text-sm lg:text-xl font-medium leading-[34px] tracking-[-0.4px]">
                +234 7065789076
              </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10.0016 0.399902C6.47344 0.399902 3.60156 3.27178 3.60156 6.7999C3.60156 12.4452 9.45312 19.178 9.70156 19.4624C9.77812 19.5499 9.88594 19.5999 10.0016 19.5999C10.125 19.5921 10.225 19.5499 10.3016 19.4624C10.55 19.1733 16.4016 12.3249 16.4016 6.7999C16.4016 3.27178 13.5297 0.399902 10.0016 0.399902ZM10.0016 4.7999C11.3266 4.7999 12.4016 5.8749 12.4016 7.1999C12.4016 8.5249 11.3266 9.5999 10.0016 9.5999C8.67656 9.5999 7.60156 8.5249 7.60156 7.1999C7.60156 5.8749 8.67656 4.7999 10.0016 4.7999Z" fill="white"/>
                            </svg>
                            <span className="text-white font-inter text-sm lg:text-xl font-medium leading-[34px] tracking-[-0.4px]">
                Uyo, Akwa Ibom, Nigeria
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Name and Title */}
            <div className="absolute top-[80px] lg:top-[100px] left-4 lg:left-[144px] z-10">
                <div className="flex flex-col gap-2">
                    <h1 className="font-poppins text-[36px] lg:text-[56px] font-bold leading-[40px] lg:leading-[58px] tracking-[1.5px] lg:tracking-[2.24px] text-cv-dark uppercase">
                        JANE<br />
                        FREDDRICK
                    </h1>
                </div>
                <div className="mt-[15px] lg:mt-[22px]">
                    <p className="font-monda text-lg lg:text-2xl font-bold leading-[24px] lg:leading-[34px] tracking-[-0.36px] lg:tracking-[-0.48px] text-cv-dark">
                        SENIOR PRODUCT DESIGNER
                    </p>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="pt-[100px] lg:pt-[135px] pb-20">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-[126px]">
                    <div className="grid grid-cols-1 lg:grid-cols-[800px_1fr] gap-10 lg:gap-20">
                        {/* Left Column */}
                        <div className="space-y-16">
                            {/* Education Section */}
                            <div>
                                <h2 className="font-montserrat text-2xl lg:text-4xl font-bold leading-[30px] lg:leading-[46px] tracking-[-0.48px] lg:tracking-[-0.72px] text-black mb-6 lg:mb-8">
                                    Education
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="space-y-3">
                                            <p className="font-montserrat text-base font-medium leading-[26px] tracking-[-0.32px] text-cv-light-gray">
                                                January 2000 - November 2004
                                            </p>
                                            <h3 className="font-montserrat text-[28px] font-bold leading-[34px] tracking-[-0.56px] text-cv-dark">
                                                ND Marketing
                                            </h3>
                                            <p className="font-montserrat text-xl font-bold leading-[30px] tracking-[-0.4px] text-cv-dark">
                                                Nekede Polythecnic
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {/* Divider line */}
                                <div className="w-full h-0.5 bg-cv-light-gray mt-12"></div>
                            </div>

                            {/* Experience Section */}
                            <div>
                                <h2 className="font-montserrat text-2xl lg:text-4xl font-bold leading-[30px] lg:leading-[46px] tracking-[-0.48px] lg:tracking-[-0.72px] text-black mb-6 lg:mb-9">
                                    Experience
                                </h2>
                                <div className="space-y-6">
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="space-y-4 lg:space-y-6">
                                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 lg:gap-0">
                                                <h3 className="font-montserrat text-xl lg:text-2xl font-bold leading-[28px] lg:leading-[34px] tracking-[-0.4px] lg:tracking-[-0.48px] text-black">
                                                    Product Designer
                                                </h3>
                                                <p className="font-montserrat text-lg lg:text-2xl font-bold leading-[24px] lg:leading-[34px] tracking-[-0.36px] lg:tracking-[-0.48px] text-black lg:text-right">
                                                    Apple Inc | 2020 till Date
                                                </p>
                                            </div>
                                            <p className="font-inter text-lg lg:text-2xl font-normal leading-[28px] lg:leading-[34px] tracking-[-0.36px] lg:tracking-[-0.48px] text-cv-gray">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-10 lg:space-y-16">
                            {/* About Me Section */}
                            <div>
                                <h2 className="font-montserrat text-2xl lg:text-4xl font-bold leading-[30px] lg:leading-[46px] tracking-[-0.48px] lg:tracking-[-0.72px] text-black mb-6 lg:mb-[30px]">
                                    About Me
                                </h2>
                                <p className="font-inter text-lg lg:text-2xl font-normal leading-[28px] lg:leading-[34px] tracking-[-0.36px] lg:tracking-[-0.48px] text-cv-gray">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                {/* Divider line */}
                                <div className="w-full h-0.5 bg-cv-light-gray mt-12"></div>
                            </div>

                            {/* Skills Section */}
                            <div>
                                <h2 className="font-montserrat text-2xl lg:text-4xl font-bold leading-[30px] lg:leading-[46px] tracking-[-0.48px] lg:tracking-[-0.72px] text-black mb-6 lg:mb-[30px]">
                                    Skills
                                </h2>
                                <div className="space-y-6 lg:space-y-8">
                                    {[1, 2, 3, 4].map((skill) => (
                                        <div key={skill} className="space-y-4 lg:space-y-5">
                                            <p className="font-inter text-lg lg:text-2xl font-medium leading-[28px] lg:leading-[34px] tracking-[-0.36px] lg:tracking-[-0.48px] text-cv-dark">
                                                Skill {skill}
                                            </p>
                                            <div className="relative w-full h-3">
                                                <div className="w-full h-3 bg-cv-progress-bg rounded-[10px]"></div>
                                                <div
                                                    className="absolute top-0 left-0 h-3 bg-cv-gray rounded-[10px]"
                                                    style={{ width: skill === 4 ? '84%' : '84%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Divider line */}
                                <div className="w-full h-0.5 bg-cv-light-gray mt-12"></div>
                            </div>

                            {/* Certification Section */}
                            <div>
                                <h2 className="font-montserrat text-2xl lg:text-4xl font-bold leading-[30px] lg:leading-[46px] tracking-[-0.48px] lg:tracking-[-0.72px] text-black mb-6 lg:mb-[30px]">
                                    Certification
                                </h2>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="font-inter text-xl lg:text-[32px] font-medium leading-[28px] lg:leading-[42px] tracking-[-0.4px] lg:tracking-[-0.64px] text-cv-medium-gray">
                                            Fundamentals Of Design certification - Udemy
                                        </h3>
                                        <p className="font-inter text-lg lg:text-xl font-normal leading-[24px] lg:leading-[30px] tracking-[-0.36px] lg:tracking-[-0.4px] text-cv-gray">
                                            2025
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="font-inter text-xl lg:text-[32px] font-medium leading-[28px] lg:leading-[42px] tracking-[-0.4px] lg:tracking-[-0.64px] text-cv-medium-gray">
                                            Fundamentals Of Design certification - IBM
                                        </h3>
                                        <p className="font-inter text-lg lg:text-xl font-normal leading-[24px] lg:leading-[30px] tracking-[-0.36px] lg:tracking-[-0.4px] text-cv-gray">
                                            2025
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
