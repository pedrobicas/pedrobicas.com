import { usePortfolioRuntime } from './hooks/usePortfolioRuntime.js';
import Loader from './components/Loader.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Header from './components/Header.jsx';
import SectionDots from './components/SectionDots.jsx';
import Resume from './components/Resume.jsx';
import ProjectGallery from './components/ProjectGallery.jsx';
import ProjectPreview from './components/ProjectPreview.jsx';
import ProjectDetail from './components/ProjectDetail.jsx';
import Overlays from './components/Overlays.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Stack from './sections/Stack.jsx';
import Journey from './sections/Journey.jsx';
import Projects from './sections/Projects.jsx';
import Contact from './sections/Contact.jsx';

export default function App() {
  usePortfolioRuntime();

  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <div className="grain" aria-hidden="true"></div>
      <CustomCursor />
      <Loader />
      <Header />
      <SectionDots />
      <main id="conteudo" tabIndex="-1"><Hero /><About /><Stack /><Journey /><Projects /><Contact /></main>
      <Resume />
      <ProjectGallery />
      <ProjectPreview />
      <ProjectDetail />
      <Overlays />
    </>
  );
}
