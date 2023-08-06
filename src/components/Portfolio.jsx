import portfolio from "../data/portfolio";
import PortfolioItem from "./PortfolioItem";

function Portfolio() {
   return (
      <div className="flex flex-col items-center md:items-start justify-center">
         <h1 className="text-2xl mb-3 font-bold">Projects</h1>
         {/* <div className="flex flex-col md:flex-row items-center justify-center"> */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {portfolio.map(project => (
                  <PortfolioItem
                     imgUrl={project.imgUrl}
                     title={project.title}
                     stack={project.stack}
                     link={project.link}
                  />
               ))}
            </div>
         {/* </div> */}
      </div>

   );
}

export default Portfolio;