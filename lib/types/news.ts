export type NewsItem = {
  _id: string;
  publisher: {
    _id: string;
    name: string;
  };
  title?: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  visible?: boolean;
};
