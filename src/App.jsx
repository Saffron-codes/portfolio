import { useEffect,useState } from 'react'
import Footer from './components/Footer'
import Intro from './components/Intro'
import Portfolio from './components/Portfolio'

import {BsMoonFill, BsSun} from "react-icons/bs"

function App() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <button
        type="button"
        onClick={handleThemeSwitch}
        className="fixed p-2 z-10 right-8  md:right-20 sm:right-8 top-4 bg-violet-300 dark:bg-orange-300 text-lg p-1 rounded-md"
      >
        {theme === 'dark' ? <BsSun size={24} style={{padding:'2px'}}/> : <BsMoonFill color='white' size={24} style={{padding:'2px'}}/>}
      </button>
      <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-300 min-h-screen font-inter">
        <div className='max-w-5xl w-11/12 mx-auto'>
          <Intro />
          <Portfolio />
          <Footer />
        </div>
      </div>
    </>


  )
}

export default App
