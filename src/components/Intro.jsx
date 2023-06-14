function Intro() {
    return (
        <div className="flex items-center justify-center flex-col text center pt-20 pb-6">
            <h1 className="text-4xl md:text-7xl md:mb-3 font-bold">Saffron Dionysius</h1>
            <p className="text-base md:text-xl mb-3 font-medium">Mobile & Embedded Developer</p>
            <p className="text-sm max-w-xl mb-6 font-bold">
                I'm Saffron Dionysius, a Flutter and IoT developer and the founder of the startup <a href="https://svik.netlify.app" className="text-cyan-600 hover:underline" target="_blank">Svik</a> (currently under development). With expertise in both software development and hardware integration, I specialize in creating innovative mobile applications and intelligent IoT solutions.
            </p>
        </div>
    );
}

export default Intro;