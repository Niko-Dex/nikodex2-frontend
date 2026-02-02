export type Niko = {
  id: number;
  name: string;
  author_name: string;
  full_desc: string;
  description: string;
  abilities: {
    id: number;
    name: string;
    niko_id: number;
  }[];
  is_blacklisted: boolean;
  author_id: number | undefined;
};
