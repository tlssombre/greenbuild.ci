import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'GreenBuild — Bâtir durablement, loger dignement.', description: 'Des campus étudiants durables en Côte d’Ivoire. Découvrez le projet pilote de Man, ses logements et l’innovation en briques de terre crue stabilisée.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
