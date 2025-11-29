type Niko = {
  name: string;
  author: string;
  short_desc: string;
  description: string;
  abilities: {
    id: number;
    name: string;
    niko_id: number;
  }[];
  is_blacklisted: boolean;
  id: number;
  author_id: number;
};
