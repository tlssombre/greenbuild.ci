import Image from 'next/image';

export const constructionStages = [
  { name: 'Murs en BTC', title: 'La matière devient architecture.', text: 'Les murs en terre crue stabilisée prennent forme. Le campus s’ancre dans son territoire.', image: '/images/campus-walls.webp', detail: '01 — ÉLÉVATION DES MURS' },
  { name: 'Structure', title: 'Les volumes prennent leur place.', text: 'Les niveaux et les galeries structurent des espaces ouverts sur la lumière et les circulations.', image: '/images/campus-structure.webp', detail: '02 — ASSEMBLAGE DES VOLUMES' },
  { name: 'Façades & climat', title: 'Une enveloppe qui respire.', text: 'Brise-soleil, ouvertures et galeries ombragées composent une architecture pensée pour le climat.', image: '/images/campus-facades.webp', detail: '03 — CONFORT BIOCLIMATIQUE' },
  { name: 'Campus vivant', title: 'L’architecture prend vie.', text: 'La végétation, les espaces partagés et la vie étudiante donnent au lieu sa raison d’être.', image: '/images/campus-finished.webp', detail: '04 — PAYSAGE & VIE ÉTUDIANTE' },
];

export function RealCampus({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  return <div className={`real-campus ${className}`}><Image src="/images/campus-finished.webp" alt="Vision architecturale du campus GreenBuild : résidences en terre, galeries ombragées et jardin habité par des étudiants" fill sizes={priority ? '100vw' : '(max-width: 700px) 100vw, 60vw'} priority={priority} /></div>;
}

export function ConstructionScene() {
  return <div className="construction-film">
    {constructionStages.map((step, index) => <div className={`construction-frame frame-${index}`} key={step.name} aria-hidden="true"><Image src={step.image} alt="" fill sizes="100vw" quality={85} loading="eager" /></div>)}
    <div className="construction-shade" aria-hidden="true" />
    <div className="construction-scan" aria-hidden="true"><span /></div>
    <div className="film-corner corner-tl" aria-hidden="true"/><div className="film-corner corner-br" aria-hidden="true"/>
  </div>;
}

export function Intro({ active, onSkip }: { active: boolean; onSkip: () => void }) {
  return <div className="cinematic-intro" aria-hidden={!active} role={active ? 'dialog' : undefined} aria-modal={active || undefined} aria-label="Ouverture GreenBuild">
    <div className="intro-grain" aria-hidden="true"/>
    <div className="intro-blueprint" aria-hidden="true"><div/><div/><div/><span/></div>
    <div className="intro-panels" aria-hidden="true">{Array.from({length:5},(_,i)=><div className="intro-panel" key={i}><img src="/images/campus-finished.webp" alt="" style={{left:`-${i*20}vw`}}/></div>)}</div>
    <div className="intro-copy"><p className="intro-overline">MAN · CÔTE D’IVOIRE</p><div className="intro-wordmark"><span>GREEN</span><span>BUILD</span></div><div className="intro-story"><span>De la matière.</span><span>À un lieu.</span><span>À la vie.</span></div></div>
    <div className="intro-bottom"><span>BÂTIR DURABLEMENT. LOGER DIGNEMENT.</span><button type="button" onClick={onSkip} tabIndex={active?0:-1}>Passer l’intro <span aria-hidden="true">↗</span></button></div>
    <div className="intro-progress" aria-hidden="true"/>
  </div>;
}
