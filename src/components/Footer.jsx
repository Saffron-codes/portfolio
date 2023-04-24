import React from 'react';

import { FaGithub, FaGithubAlt, FaInstagram, FaLinkedin, FaLinkedinIn, FaTwitter } from "react-icons/fa";
function Footer() {
	return (
		<div className="py-5 text-center">
			<div className="container max-w-screen-lg mx-auto">
				<div>
					<div className="flex flex-wrap justify-center gap-2">
						<a 
							href='https://twitter.com/sdionysius'
							className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full">
							<FaTwitter size={20}/>
						</a>

						<a 
							href='https://www.linkedin.com/in/saffron-dionysius-t-800996225/'
							className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full">
							<FaLinkedinIn size={20}/>
						</a>
						
						<a 
							href='https://github.com/saffron-codes'
							className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full">
							<FaGithub size={20}/>
						</a>
						
						<a 
							href='https://instagram.com/saffron-codes'
							className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full">
							<FaInstagram size={20}/>
						</a>

					</div>
				</div>
			</div>
			<p className="text-sm mt-2  opacity-50">
				&copy; {new Date().getFullYear()} Saffron Dionysius. All rights reserved.
			</p>
		</div>
	);
}

export default Footer;