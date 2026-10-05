export type ContentKind = 'invest' | 'news' | 'team' | 'contact' | 'jobs';
export type ContentRecord = { id: string; kind: ContentKind; title: string; subtitle: string; body: string; image: string; link: string; location: string; contract: string; email: string; phone: string; published: boolean; sort: number; updatedAt: string };
export type PublicContent = Record<ContentKind, ContentRecord[]>;
export type InboxRecord = { id: string; kind: 'messages' | 'applications'; name: string; email: string; phone: string; message: string; interest: string; jobId: string; jobTitle: string; status: string; createdAt: string; resumeName: string };
export const contentKinds: ContentKind[] = ['invest','news','team','contact','jobs'];
