
export enum ContentCategory {
  ALL = 'الكل',
  RESEARCH = 'أبحاث',
  PROJECTS = 'مشاريع',
  VIDEOS = 'فيديوهات'
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: ContentCategory;
  date: string;
  thumbnail: string;
  url?: string;
  pdfUrl?: string;
  youtubeId?: string;
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
